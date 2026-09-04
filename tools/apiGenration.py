import yaml
import re
from pathlib import Path
import subprocess

INPUT_FILE = "./SSD-Docs/swagger.yml"
OUTPUT_FILE = "html/assets/js/api/api.generated.js"
API_BASE_VALUE = "{APIENDPOINT}"  # you can replace or inject env usage

# Optional: template for linking straight to the spec source on your repo
# host (GitHub/GitLab/etc.) instead of a bare local file path, e.g.:
#   "https://github.com/your-org/your-repo/blob/main/SSD-Docs/swagger.yml#L{line}"
# Leave as None to just reference the local file path + line number.
SPEC_SOURCE_URL_TEMPLATE  = None
SPEC_REPO_URL = " https://github.com/Fanny-Leicht-Gymnasium/SSD-Docs/blob/{commit}/swagger.yml#L{line}"

def get_submodule_commit(submodule_path: str) -> str:
    """Return the commit SHA recorded by the parent repository for the submodule."""
    result = subprocess.run(
        ["git", "ls-tree", "HEAD", submodule_path],
        capture_output=True,
        text=True,
        check=True,
    )

    match = re.search(r"\b160000\s+commit\s+([0-9a-f]{40})\b", result.stdout)
    if not match:
        raise RuntimeError(
            f"Could not determine the commit of submodule '{submodule_path}'."
        )

    return match.group(1)


submodule_commit = get_submodule_commit("SSD-Docs")


def get_spec_source_url(line: int) -> str:
    """Build a link to the exact submodule commit and source line."""
    return SPEC_REPO_URL.format(
        commit=submodule_commit,
        line=line,
    )
# ---------------------------------------------------------------------------
# Schema resolution helpers
# ---------------------------------------------------------------------------

def resolve_ref(ref: str, spec: dict):
    """Resolve a '#/components/schemas/Foo' style ref against the spec."""
    parts = ref.lstrip("#/").split("/")
    node = spec
    for part in parts:
        node = node[part]
    return node


def resolve_schema(schema: dict, spec: dict):
    """Follow a single $ref one level (does not recurse into nested refs)."""
    if not schema:
        return {}
    if "$ref" in schema:
        return resolve_ref(schema["$ref"], spec)
    return schema


def ref_name(ref: str) -> str:
    return ref.split("/")[-1]


def pascal(name: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9]", " ", name)
    return "".join(part[:1].upper() + part[1:] for part in safe.split() if part)


# ---------------------------------------------------------------------------
# Source-location lookup (path, method) -> line number in the spec file
# ---------------------------------------------------------------------------
# Built from a *parallel* pass over the composed YAML node tree, entirely
# separate from the normal yaml.safe_load() data. This is deliberate:
# tagging line numbers onto the actual parsed dicts (a common recipe using
# a custom SafeLoader) would inject an extra key into every mapping in the
# document - including `properties` dicts - which would then get picked up
# as a bogus schema field everywhere. Composing the tree a second time,
# read-only, avoids that entirely.

def _mapping_child(node, key: str):
    """Given a yaml MappingNode, return the value node for `key`, or None."""
    if node is None or not isinstance(node, yaml.MappingNode):
        return None
    for key_node, value_node in node.value:
        if key_node.value == key:
            return value_node
    return None


def build_operation_line_map(text: str):
    """Map (path, method) -> 1-indexed line number of the `method:` key
    itself (e.g. the line `put:` appears on) by walking the composed node
    tree for `paths.<path>.<method>`."""
    line_map = {}
    root = yaml.compose(text, Loader=yaml.SafeLoader)
    paths_node = _mapping_child(root, "paths")
    if not isinstance(paths_node, yaml.MappingNode):
        return line_map

    for path_key_node, path_val_node in paths_node.value:
        if not isinstance(path_val_node, yaml.MappingNode):
            continue
        for method_key_node, _method_val_node in path_val_node.value:
            line_map[(path_key_node.value, method_key_node.value)] = (
                method_key_node.start_mark.line + 1
            )
    return line_map


def spec_source_link(line: int):
    if line is None:
        return None
    if SPEC_SOURCE_URL_TEMPLATE:
        return SPEC_SOURCE_URL_TEMPLATE.format(line=line)
    if SPEC_REPO_URL:
        return SPEC_REPO_URL.format(commit=submodule_commit, line=line)
    return f"{INPUT_FILE}:{line}"


# ---------------------------------------------------------------------------
# JSDoc typedef generation (plain JSDoc, no TypeScript-only syntax)
# ---------------------------------------------------------------------------
# Every object schema - whether it's a named $ref or an inline/anonymous
# object - gets its own `@typedef {Object} Name` block with `@property`
# lines. Optional fields use the standard JSDoc `[name]` bracket syntax
# (not `name?: type`, which is TS-flavored and not reliably understood by
# plain-JS JSDoc tooling).

def schema_type_variants(schema: dict):
    """Return the list of primitive/structural 'type' keywords this schema
    can take, expanding `oneOf`/`anyOf` and OpenAPI 3.1's array-form
    `type: [string, integer]`. Used so a field that can genuinely be more
    than one type (e.g. `location` being string OR integer) is represented
    as a real union everywhere, instead of silently collapsing to the
    first type seen."""
    if "oneOf" in schema or "anyOf" in schema:
        out = []
        for v in (schema.get("oneOf") or schema.get("anyOf")):
            for t in schema_type_variants(v or {}):
                if t not in out:
                    out.append(t)
        return out
    stype = schema.get("type")
    if isinstance(stype, list):
        return [t for t in stype if t != "null"]
    if stype:
        return [stype]
    return []


def schema_js_type(schema: dict, spec: dict, typedefs: dict, seen: set, name_hint: str) -> str:
    """Return a JSDoc type name/string for a schema. Any object schema
    encountered (named or anonymous) is registered as a @typedef, keyed by
    its resolved name or by `name_hint` when it has no $ref. Schemas that
    allow more than one type (`oneOf`/`anyOf`, or OpenAPI 3.1's
    `type: [a, b]`) produce a real `TypeA | TypeB` union rather than
    picking just one."""
    if not schema:
        return "*"

    if "$ref" in schema:
        ref = schema["$ref"]
        name = ref_name(ref)
        if ref not in seen:
            resolved = resolve_ref(ref, spec)
            ensure_typedef(name, resolved, spec, typedefs, seen | {ref})
        return name

    if "oneOf" in schema or "anyOf" in schema:
        variants = schema.get("oneOf") or schema.get("anyOf")
        types = []
        for i, v in enumerate(variants):
            t = schema_js_type(v or {}, spec, typedefs, seen, f"{name_hint}Variant{i + 1}")
            if t not in types:
                types.append(t)
        js_union = " | ".join(types) if types else "*"
        return js_union if len(types) == 1 else f"({js_union})"

    stype = schema.get("type")

    if isinstance(stype, list):
        non_null = [t for t in stype if t != "null"]
        types = []
        for st in non_null:
            t = schema_js_type({**schema, "type": st}, spec, typedefs, seen, name_hint)
            if t not in types:
                types.append(t)
        js_union = " | ".join(types) if types else "*"
        if "null" in stype:
            types.append("null")
            js_union = " | ".join(types)
        return js_union if len(types) <= 1 else f"({js_union})"

    if stype == "array":
        item_type = schema_js_type(schema.get("items", {}) or {}, spec, typedefs, seen, name_hint + "Item")
        return f"{item_type}[]"

    if stype == "object" or "properties" in schema:
        ensure_typedef(name_hint, schema, spec, typedefs, seen)
        return name_hint

    if stype == "string":
        if "enum" in schema:
            union = " | ".join(f'"{e}"' for e in schema["enum"])
            return union if len(schema["enum"]) == 1 else f"({union})"
        return "string"

    if stype in ("integer", "number"):
        return "number"

    if stype == "boolean":
        return "boolean"

    return "*"


def ensure_typedef(name: str, resolved_schema: dict, spec: dict, typedefs: dict, seen: set):
    """Register a @typedef block for an (already-resolved) object schema, once."""
    if name in typedefs:
        return
    typedefs[name] = ""  # reserve the slot so recursive/self refs don't loop

    props = resolved_schema.get("properties", {})
    required = set(resolved_schema.get("required", []))

    lines = ["/**", f" * @typedef {{Object}} {name}"]
    for prop_name, prop_schema in props.items():
        prop_schema = prop_schema or {}
        t = schema_js_type(prop_schema, spec, typedefs, seen, f"{name}{pascal(prop_name)}")
        optional = prop_name not in required
        field = f"[{prop_name}]" if optional else prop_name
        desc = prop_schema.get("description", "")
        line = f" * @property {{{t}}} {field}"
        if desc:
            line += f" - {desc}"
        lines.append(line)
    lines.append(" */")
    typedefs[name] = "\n".join(lines)


# ---------------------------------------------------------------------------
# Runtime body templates (plain JS object literals -> structural autocomplete)
# ---------------------------------------------------------------------------

def default_value_for_schema(schema: dict, spec: dict, seen: set, indent: str) -> str:
    """Representative JS literal (source text) for a schema, indented for
    its position inside the enclosing object literal. For a schema with
    more than one allowed type (`oneOf`/`anyOf`, or `type: [a, b]`), the
    default is taken from the first variant - the JSDoc type still lists
    every variant, this only picks one concrete placeholder value."""
    if not schema:
        return "null"

    if "$ref" in schema:
        ref = schema["$ref"]
        if ref in seen:
            return "{}"  # cycle guard
        return default_value_for_schema(resolve_ref(ref, spec), spec, seen | {ref}, indent)

    if "oneOf" in schema or "anyOf" in schema:
        variants = schema.get("oneOf") or schema.get("anyOf")
        if variants:
            return default_value_for_schema(variants[0] or {}, spec, seen, indent)
        return "null"

    stype = schema.get("type")

    if isinstance(stype, list):
        non_null = [t for t in stype if t != "null"]
        if non_null:
            return default_value_for_schema({**schema, "type": non_null[0]}, spec, seen, indent)
        return "null"

    if stype == "string":
        if "enum" in schema and schema["enum"]:
            return repr(schema["enum"][0]).replace("'", '"')
        return '""'

    if stype in ("integer", "number"):
        return str(schema.get("default", 0))

    if stype == "boolean":
        return "false"

    if stype == "array":
        item = default_value_for_schema(schema.get("items", {}) or {}, spec, seen, indent + "  ")
        return f"[{item}]"

    if stype == "object" or "properties" in schema:
        return build_object_literal(schema, spec, seen, indent)

    return "null"


def describe_prop_type(prop_schema: dict) -> str:
    """Short human-readable type description for a trailing `//` comment,
    honoring real unions instead of just the first type."""
    if "$ref" in prop_schema:
        return ref_name(prop_schema["$ref"])
    variants = schema_type_variants(prop_schema)
    if variants:
        return " | ".join(variants)
    if "properties" in prop_schema:
        return "object"
    return "object"


def build_object_literal(schema: dict, spec: dict, seen: set, indent: str) -> str:
    props = schema.get("properties", {})
    required = set(schema.get("required", []))
    if not props:
        return "{}"

    inner_indent = indent + "  "
    lines = ["{"]
    for name, prop_schema in props.items():
        prop_schema = prop_schema or {}
        value = default_value_for_schema(prop_schema, spec, seen, inner_indent)
        tag = "required" if name in required else "optional"
        prop_type = describe_prop_type(prop_schema)
        fmt = prop_schema.get("format")
        note = f", {fmt}" if fmt else ""
        lines.append(f"{inner_indent}{name}: {value}, // {tag} ({prop_type}{note})")
    lines.append(f"{indent}}}")
    return "\n".join(lines)


def template_function_name(type_name: str) -> str:
    return f"create{pascal(type_name)}Template"


JS_RESERVED_WORDS = {
    "break", "case", "catch", "class", "const", "continue", "debugger",
    "default", "delete", "do", "else", "export", "extends", "finally",
    "for", "function", "if", "import", "in", "instanceof", "new", "return",
    "super", "switch", "this", "throw", "try", "typeof", "var", "void",
    "while", "with", "yield", "let", "static", "enum", "await",
    "implements", "package", "protected", "interface", "private", "public",
    "null", "true", "false",
}


def safe_local_name(name: str) -> str:
    """A property name straight from the spec (e.g. `class`, `2fa-code`)
    isn't always a legal bare JS identifier - reserved words can't be used
    as a destructuring shorthand, and characters like `-` aren't legal in
    an identifier at all. Returns a safe local variable name to bind it
    to; when the original name is already legal, returns it unchanged so
    destructuring can still use the shorthand form."""
    base = re.sub(r"[^A-Za-z0-9_$]", "_", name)
    if not re.match(r"^[A-Za-z_$]", base):
        base = "_" + base
    if base in JS_RESERVED_WORDS:
        base = base + "_"
    return base


def build_param_destructure(resolved_schema: dict, spec: dict, typedefs: dict, type_name: str):
    """Build the destructured-parameter signature lines AND the matching
    per-field JSDoc `@param {Type} params.field` lines. Required fields
    get no default (stays `undefined` until supplied) and an un-bracketed
    `@param` tag; optional fields get a representative default and a
    bracketed `[params.field]` tag. The dotted-name form is what VSCode's
    JS/TS engine actually type-checks against for a destructured
    parameter - a single `@param {Type} [params]` tag does NOT get
    enforced the same way, it only documents the shape.

    The JSDoc `@param` tags and the returned object's keys always use the
    real property name from the spec (e.g. `class`); only the local
    binding inside the function is renamed when the property name isn't a
    legal bare identifier (`{ class: class_ = "" }` instead of the
    illegal `{ class = "" }`)."""
    props = resolved_schema.get("properties", {})
    required = set(resolved_schema.get("required", []))

    param_lines = []
    jsdoc_lines = []
    names = []
    locals_by_name = {}
    for name, prop_schema in props.items():
        prop_schema = prop_schema or {}
        names.append(name)
        local = safe_local_name(name)
        locals_by_name[name] = local
        binding = name if local == name else f"{name}: {local}"

        t = schema_js_type(prop_schema, spec, typedefs, set(), f"{type_name}{pascal(name)}")
        tag = "required" if name in required else "optional"
        prop_type = describe_prop_type(prop_schema)
        fmt = prop_schema.get("format")
        note = f", {fmt}" if fmt else ""
        comment = f"// {tag} ({prop_type}{note})"

        if name in required:
            param_lines.append(f"  {binding}, {comment}")
            jsdoc_lines.append(f" * @param {{{t}}} params.{name}")
        else:
            value = default_value_for_schema(prop_schema, spec, set(), "  ")
            param_lines.append(f"  {binding} = {value}, {comment}")
            jsdoc_lines.append(f" * @param {{{t}}} [params.{name}]")

    return param_lines, jsdoc_lines, names, locals_by_name


def build_coercion_expr(var_name: str, prop_schema: dict) -> str:
    """JS expression that coerces a single field to the type the schema
    declares - only for unambiguous single-type primitives (string,
    number, boolean). Arrays, objects, $refs, and real unions (oneOf/
    multi-type) are left untouched, since there's no single safe
    conversion for those - the caller's value is passed through as-is."""
    variants = schema_type_variants(prop_schema)
    if "$ref" in prop_schema or len(variants) != 1:
        return var_name

    t = variants[0]
    if t == "string":
        return f"({var_name} == null ? {var_name} : String({var_name}))"
    if t in ("integer", "number"):
        return f"({var_name} == null ? {var_name} : Number({var_name}))"
    if t == "boolean":
        return f"({var_name} == null ? {var_name} : Boolean({var_name}))"
    return var_name


def generate_body_template(type_name: str, schema: dict, spec: dict, typedefs: dict, templates: dict):
    """Register (once) a `create<Name>Template({...})` factory whose
    parameter is a destructured object matching the body schema - every
    field is a named, defaulted, and individually-typed parameter, so the
    editor both autocompletes field names and flags a wrong type as you
    type the call.

    Unlike the endpoint function itself (which sends whatever body it's
    given, untouched), this factory coerces each field to the schema's
    declared type (String()/Number()/Boolean()) before returning it - so
    callers that hand it loosely-typed values (e.g. a number where the
    spec says string) still get a body that matches the schema. `null`/
    `undefined` are passed through rather than coerced, so "not provided"
    stays distinguishable from an actual value."""
    fn_name = template_function_name(type_name)
    if fn_name in templates:
        return fn_name

    resolved = resolve_schema(schema, spec)
    param_lines, jsdoc_param_lines, names, locals_by_name = build_param_destructure(resolved, spec, typedefs, type_name)
    props = resolved.get("properties", {})

    return_props = []
    for name in names:
        prop_schema = props.get(name) or {}
        local = locals_by_name[name]
        expr = build_coercion_expr(local, prop_schema)
        if expr == local and local == name:
            return_props.append(name)  # shorthand: same identifier, no coercion needed
        else:
            return_props.append(f"{name}: {expr}")
    return_obj = "{ " + ", ".join(return_props) + " }" if return_props else "{}"

    lines = [
        "/**",
        f" * Generates request body: {{@link {type_name}}}. Fields are named,",
        " * this coerces each field to its declared schema type",
        " * (e.g. a number passed for a string field becomes a string).",
        " * @param {Object} params",
    ]
    lines.extend(jsdoc_param_lines)
    lines.append(f" * @returns {{{type_name}}}")
    lines.append(" */")
    if param_lines:
        lines.append(f"export function {fn_name}({{")
        lines.extend(param_lines)
        lines.append("} = {}) {")
    else:
        lines.append(f"export function {fn_name}(params = {{}}) {{")
    lines.append(f"  return {return_obj};")
    lines.append("}")

    templates[fn_name] = "\n".join(lines)
    return fn_name


# ---------------------------------------------------------------------------
# Path / query param helpers (unchanged behaviour)
# ---------------------------------------------------------------------------

def extract_query_params(operation: dict):
    params = operation.get("parameters", [])
    return [p["name"] for p in params if p.get("in") == "query"]


def extract_path_params(path: str):
    return re.findall(r"{(.*?)}", path)


def build_js_endpoint(path: str):
    for param in extract_path_params(path):
        path = path.replace(f"{{{param}}}", f"${{{param}}}")
    return path


def extract_request_body_schema(operation: dict, spec: dict):
    rb = operation.get("requestBody")
    if not rb:
        return None
    content = rb.get("content", {})
    json_content = content.get("application/json")
    if not json_content and content:
        json_content = next(iter(content.values()))
    if not json_content:
        return None
    return json_content.get("schema")


def param_js_type(param: dict) -> str:
    schema = param.get("schema", {}) or {}
    t = schema.get("type", "string")
    return {"integer": "number", "number": "number", "boolean": "boolean"}.get(t, "string")


# ---------------------------------------------------------------------------
# Boilerplate generators (unchanged)
# ---------------------------------------------------------------------------

def generate_api_fetch():
    return f"""
async function apiFetch(endpoint, options = {{}}, params = {{}}) {{
  const token = localStorage.getItem("jwt");

  const url =
    typeof endpoint === "function"
      ? `${{API_BASE}}${{endpoint(params)}}`
      : `${{API_BASE}}${{endpoint}}`;

  const headers = {{
    ...(token && {{ Authorization: `Bearer ${{token}}` }}),
    ...(options.body ? {{ "Content-Type": "application/json" }} : {{}}),
    ...options.headers,
  }};

  const res = await fetch(url, {{
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  }});

  if (!res.ok) {{
    const text = await res.text();
    throw new Error(text || `HTTP ${{res.status}}`);
  }}
  if (res.status == 204){{
    return {{}}
  }}
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {{
  return res.json();
  }}

  return {{}};
}}
""".strip()


def generate_query_string_helper():
    return """
function buildQueryString(queryParams) {
  return Object.entries(queryParams)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}
""".strip()


# ---------------------------------------------------------------------------
# Endpoint function generation
# ---------------------------------------------------------------------------

def generate_function(path, method, operation, spec, typedefs, templates, line_map=None):
    func_name = operation.get("operationId")
    if not func_name:
        clean = re.sub(r"[{}]", "", path).replace("/", " ").title().replace(" ", "")
        func_name = method.lower() + clean

    params = operation.get("parameters", [])
    path_params = extract_path_params(path)
    query_params = extract_query_params(operation)
    path_param_defs = {p["name"]: p for p in params if p.get("in") == "path"}
    query_param_defs = {p["name"]: p for p in params if p.get("in") == "query"}

    body_schema = extract_request_body_schema(operation, spec)
    has_body = body_schema is not None

    js_path = build_js_endpoint(path)

    args = list(path_params) + list(query_params)
    body_type_name = None
    if has_body:
        args.append("body")
        hint_name = f"{pascal(func_name)}Body"
        # schema_js_type registers the typedef (named or synthetic) and
        # returns whichever name it actually ended up using.
        body_type_name = schema_js_type(body_schema, spec, typedefs, set(), hint_name)
        generate_body_template(body_type_name, body_schema, spec, typedefs, templates)

    args_str = ", ".join(args)

    # ---- JSDoc block -------------------------------------------------
    doc = ["/**", f" * {method.upper()} {path}"]
    source_line = (line_map or {}).get((path, method))
    source_link = spec_source_link(source_line)
    if source_link:
        doc.append(f" * @see {source_link} - endpoint definition in the OpenAPI spec")
    for p in path_params:
        t = param_js_type(path_param_defs.get(p, {}))
        doc.append(f" * @param {{{t}}} {p}")
    for p in query_params:
        t = param_js_type(query_param_defs.get(p, {}))
        doc.append(f" * @param {{{t}}} [{p}]")
    if has_body:
        doc.append(f" * @param {{{body_type_name}}} body - see {{@link {body_type_name}}} for generation: {{@link {template_function_name(body_type_name)}()}}")
    doc.append(" * @returns {Promise<any>}")
    doc.append(" */")

    lines = []
    lines.extend(doc)
    lines.append(f"export async function {func_name}({args_str}) {{")

    if path_params:
        lines.append("  const pathParams = {")
        for p in path_params:
            lines.append(f"    {p},")
        lines.append("  };")
    else:
        lines.append("  const pathParams = {};")

    if query_params:
        lines.append("  const queryParams = {")
        for p in query_params:
            lines.append(f"    {p},")
        lines.append("  };")
    else:
        lines.append("  const queryParams = {};")

    lines.append("")
    lines.append("  const queryString = buildQueryString(queryParams);")
    lines.append("")
    lines.append("  const url = (p) => {")
    lines.append(f"    const base = `{js_path.replace('${', '${p.')}`;")
    lines.append("    return queryString ? `${base}?${queryString}` : base;")
    lines.append("  };")
    lines.append("")
    lines.append("  return apiFetch(")
    lines.append("    url,")
    lines.append("    {")
    lines.append(f"      method: '{method.upper()}',")
    if has_body:
        lines.append("      body,")
    lines.append("    },")
    lines.append("    pathParams")
    lines.append("  );")
    lines.append("}")

    return "\n".join(lines)


def generate():
    with open(INPUT_FILE, "r") as f:
        text = f.read()
    spec = yaml.safe_load(text)
    line_map = build_operation_line_map(text)

    paths = spec.get("paths", {})

    typedefs = {}   # name -> JSDoc @typedef block text
    templates = {}  # fn_name -> template factory source text
    functions = []

    for path, methods in paths.items():
        for method, operation in methods.items():
            if method.lower() not in ["get", "post", "put", "delete", "patch"]:
                continue
            functions.append(generate_function(path, method, operation, spec, typedefs, templates, line_map))
            functions.append("\n")

    output = []
    output.append("// AUTO GENERATED FILE - DO NOT EDIT\n")
    output.append(f"const API_BASE = `{API_BASE_VALUE}`;\n")
    output.append(generate_api_fetch())
    output.append("\n")
    output.append(generate_query_string_helper())
    output.append("\n")

    if typedefs:
        output.append("// ---- Request/response body type definitions ----\n")
        output.extend(v for v in typedefs.values() if v)
        output.append("\n")

    if templates:
        output.append("// ---- Request body scaffolds (call to get an editable object) ----\n")
        output.extend(templates.values())
        output.append("\n")

    output.append("// ---- Endpoints ----\n")
    output.extend(functions)

    Path(OUTPUT_FILE).parent.mkdir(parents=True, exist_ok=True)
    Path(OUTPUT_FILE).write_text("\n".join(output), encoding="utf-8")
    print(f"Generated {OUTPUT_FILE}")


if __name__ == "__main__":
    generate()