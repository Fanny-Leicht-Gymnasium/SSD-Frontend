import yaml
import re
from pathlib import Path

INPUT_FILE = "./SSD-Docs/swagger.yml"
OUTPUT_FILE = "html/assets/js/api/api.generated.js"
API_BASE_VALUE = "http://localhost:8080"  # you can replace or inject env usage

def extract_query_params(operation: dict):
    params = operation.get("parameters", [])
    return [
        p["name"]
        for p in params
        if p.get("in") == "query"
    ]


def extract_all_query_param_defs(operation: dict):
    return [
        p for p in operation.get("parameters", [])
        if p.get("in") == "query"
    ]

def extract_path_params(path: str):
    return re.findall(r"{(.*?)}", path)


def build_js_endpoint(path: str):
    # /user/{id} -> /user/${id}
    for param in extract_path_params(path):
        path = path.replace(f"{{{param}}}", f"${{{param}}}")
    return path


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

  return res.json();
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

def generate_function(path, method, operation):
    func_name = operation.get("operationId")

    if not func_name:
        clean = re.sub(r"[{}]", "", path).replace("/", " ").title().replace(" ", "")
        func_name = method.lower() + clean

    path_params = extract_path_params(path)
    query_params = extract_query_params(operation)

    js_path = build_js_endpoint(path)
    has_body = method.lower() in ["post", "put", "patch"]

    args = []
    args.extend(path_params)
    args.extend(query_params)
    if has_body:
        args.append("body")

    args_str = ", ".join(args)

    lines = []
    lines.append(f"export async function {func_name}({args_str}) {{")

    # params object for path params only
    if path_params:
        lines.append("  const pathParams = {")
        for p in path_params:
            lines.append(f"    {p},")
        lines.append("  };")
    else:
        lines.append("  const pathParams = {};")

    # query object
    if query_params:
        lines.append("  const queryParams = {")
        for p in query_params:
            lines.append(f"    {p},")
        lines.append("  };")
    else:
        lines.append("  const queryParams = {};")

    lines.append("")

    # build query string
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
        spec = yaml.safe_load(f)

    paths = spec.get("paths", {})

    output = []

    output.append("// AUTO GENERATED FILE - DO NOT EDIT\n")

    # API BASE constant
    output.append(f"const API_BASE = \"{API_BASE_VALUE}\";\n")

    # apiFetch
    output.append(generate_api_fetch())
    output.append("\n")
    output.append(generate_query_string_helper())
    output.append("\n")
    # endpoints
    for path, methods in paths.items():
        for method, operation in methods.items():
            if method.lower() not in ["get", "post", "put", "delete", "patch"]:
                continue

            output.append(generate_function(path, method, operation))
            output.append("\n")

    Path(OUTPUT_FILE).write_text("\n".join(output), encoding="utf-8")
    print(f"Generated {OUTPUT_FILE}")


if __name__ == "__main__":
    generate()