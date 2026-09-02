
#!/usr/bin/env python3

"""
Scan HTML and JavaScript files for translation keys and update a language file.

Supported translation tags:

    <x-translation>application.approve</x-translation>
    <x-trans>application.deny</x-trans>

The translation key itself is used as the default translation value.

Example:

    application.approve

becomes:

    {
        "application": {
            "approve": "application.approve"
        }
    }

Existing translations are preserved.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


TRANSLATION_PATTERN = re.compile(
    r"<(?:x-translation|x-trans)\b[^>]*>"
    r"\s*([^<]+?)\s*"
    r"</(?:x-translation|x-trans)>",
    re.IGNORECASE,
)


def find_translation_keys(root: Path) -> set[str]:
    """Recursively find translation keys in HTML and JavaScript files."""
    keys: set[str] = set()

    for path in root.rglob("*"):
        if not path.is_file():
            continue

        if path.suffix.lower() not in {".html", ".js"}:
            continue

        # Do not scan the generated language file itself.
        if path.as_posix().endswith("assets/lang/full.js"):
            continue

        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            print(f"Warning: Could not decode {path}", file=sys.stderr)
            continue
        except OSError as error:
            print(f"Warning: Could not read {path}: {error}", file=sys.stderr)
            continue

        for match in TRANSLATION_PATTERN.finditer(content):
            key = match.group(1).strip()

            if key:
                keys.add(key)

    return keys


def set_nested_value(
    data: dict[str, Any],
    key: str,
    value: str,
) -> bool:
    """
    Add a nested translation key without overwriting existing values.

    Returns True if the key was added.
    """
    parts = key.split(".")

    if not all(part.strip() for part in parts):
        return False

    current: dict[str, Any] = data

    for part in parts[:-1]:
        existing = current.get(part)

        if existing is None:
            current[part] = {}
            current = current[part]
            continue

        if not isinstance(existing, dict):
            # There is already a translation value where an object
            # would be required. Do not overwrite it.
            return False

        current = existing

    final_key = parts[-1]

    if final_key in current:
        return False

    current[final_key] = value
    return True


def load_language_file(path: Path) -> dict[str, Any]:
    """
    Load the JSON object from full.js.

    Supports files containing:

        {
            "lang": "English"
        }

    and also:

        export default {
            "lang": "English"
        };

    or:

        const translations = {
            "lang": "English"
        };
    """
    content = path.read_text(encoding="utf-8").strip()

    # Remove common JavaScript wrappers.
    content = re.sub(
        r"^\s*export\s+default\s+",
        "",
        content,
        flags=re.IGNORECASE,
    )

    content = re.sub(
        r"^\s*(?:const|let|var)\s+\w+\s*=\s*",
        "",
        content,
        flags=re.IGNORECASE,
    )

    # Remove a trailing semicolon.
    content = re.sub(r";\s*$", "", content)

    try:
        data = json.loads(content)
    except json.JSONDecodeError as error:
        raise ValueError(
            f"Could not parse language file {path}: {error}"
        ) from error

    if not isinstance(data, dict):
        raise ValueError(
            f"Language file {path} must contain a JSON object."
        )

    return data


def write_language_file(
    path: Path,
    data: dict[str, Any],
) -> None:
    """Write the language file as formatted JavaScript-compatible JSON."""
    content = json.dumps(
        data,
        ensure_ascii=False,
        indent=4,
    )

    path.write_text(
        content + "\n",
        encoding="utf-8",
    )


def sort_translation_tree(value: Any) -> Any:
    """
    Sort dictionary keys recursively.

    This keeps full.js deterministic and easy to diff.
    """
    if isinstance(value, dict):
        return {
            key: sort_translation_tree(value[key])
            for key in sorted(value.keys())
        }

    if isinstance(value, list):
        return [
            sort_translation_tree(item)
            for item in value
        ]

    return value


def update_language_file(
    root: Path,
    language_file: Path,
) -> tuple[int, int]:
    """Scan files and update the language file."""
    keys = find_translation_keys(root)

    if not language_file.exists():
        data: dict[str, Any] = {
            "lang": "English",
        }
    else:
        data = load_language_file(language_file)

    added = 0
    skipped = 0

    for key in sorted(keys):
        if set_nested_value(data, key, key):
            added += 1
        else:
            skipped += 1

    data = sort_translation_tree(data)

    language_file.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    write_language_file(
        language_file,
        data,
    )

    return added, skipped


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Scan HTML and JavaScript files for "
            "x-translation and x-trans elements."
        )
    )

    parser.add_argument(
        "directory",
        nargs="?",
        default="./html",
        help="Directory to scan. Default: ./html",
    )

    parser.add_argument(
        "--output",
        default="./html/lang/full.json",
        help=(
            "Translation file to update. "
            "Default: ./html/lang/full.json"
        ),
    )

    args = parser.parse_args()

    root = Path(args.directory).resolve()
    language_file = Path(args.output).resolve()

    if not root.exists():
        print(
            f"Error: Directory does not exist: {root}",
            file=sys.stderr,
        )
        return 1

    if not root.is_dir():
        print(
            f"Error: Not a directory: {root}",
            file=sys.stderr,
        )
        return 1

    try:
        added, skipped = update_language_file(
            root,
            language_file,
        )
    except (OSError, ValueError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Scanned: {root}")
    print(f"Language file: {language_file}")
    print(f"New translations: {added}")
    print(f"Existing translations: {skipped}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

