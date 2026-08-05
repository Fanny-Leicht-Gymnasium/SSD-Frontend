import os
import requests
import webbrowser

from flask import Flask, render_template_string, request, redirect
from urllib.parse import quote


MISSING_FILE = "missing-icons.txt"
ICON_OUTPUT_DIR = "./html/assets/icons"

TABLER_RAW = (
    "https://raw.githubusercontent.com/tabler/"
    "tabler-icons/main/icons/outline/"
)


app = Flask(__name__)

app.jinja_env.filters["urlencode"] = quote


missing_icons = []
tabler_icons = []


def load_missing():
    global missing_icons

    if os.path.exists(MISSING_FILE):
        with open(MISSING_FILE, "r", encoding="utf-8") as file:
            missing_icons = sorted(set(
                line.strip()
                .replace(".svg", "")
                .lstrip("/")
                for line in file
                if line.strip()
            ))


def icon_filename(path):
    path = path.replace(
        "assets/icons/",
        "",
        1
    )
    return os.path.basename(path)


def load_data():
    global tabler_icons

    load_missing()

    response = requests.get(
        "https://api.github.com/repos/tabler/tabler-icons/git/trees/main?recursive=1",
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    tabler_icons = []

    for item in data["tree"]:
        path = item["path"]

        if (
            path.startswith("icons/outline/")
            and path.endswith(".svg")
        ):
            name = (
                path
                .replace("icons/outline/", "")
                .replace(".svg", "")
            )

            tabler_icons.append(name)

    tabler_icons.sort()

    print(
        f"Loaded {len(tabler_icons)} Tabler icons"
    )


def search_icons(query, limit=30):
    query = query.strip().lower()

    parts = (
        query
        .replace("_", "-")
        .split("-")
    )

    result = []

    for icon in tabler_icons:
        filename = icon_filename(icon).lower()

        score = 0

        for part in parts:
            if part and part in filename:
                score += 1

        if score:
            result.append(
                (score, icon)
            )

    result.sort(
        key=lambda x: (
            -x[0],
            x[1]
        )
    )

    return [
        icon
        for _, icon in result[:limit]
    ]


def download_icon(icon_name, target_name):

    url = (
        TABLER_RAW
        + icon_name
        + ".svg"
    )

    response = requests.get(
        url,
        timeout=10
    )

    if response.status_code != 200:
        print(
            "Download failed:",
            url
        )
        return False


    # Remove frontend base path
    target_name = target_name.replace(
        "assets/icons/",
        "",
        1
    )


    target_path = os.path.join(
        ICON_OUTPUT_DIR,
        target_name + ".svg"
    )


    os.makedirs(
        os.path.dirname(target_path),
        exist_ok=True
    )


    with open(
        target_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(
            response.text
        )


    print(
        "Saved:",
        target_path
    )

    return True



MAIN_PAGE = """
<!doctype html>

<html>

<head>

<title>
Icon Fixer
</title>

<style>

body {
    font-family: Arial;
    padding:20px;
}

.grid {
    display:flex;
    flex-wrap:wrap;
    gap:15px;
}

.card {
    width:140px;
    border:1px solid #aaa;
    border-radius:8px;
    padding:10px;
    text-align:center;
}

.card img {
    width:70px;
    height:70px;
}

.name {
    font-size:12px;
    word-break:break-word;
}

</style>

</head>


<body>


<h1>
Missing Icons
</h1>


{% for icon in icons %}

<hr>

<h2>
{{icon}}
</h2>


<form method="post" action="/use">

<input
type="hidden"
name="target"
value="{{icon}}"
>


<div class="grid">


{% for option in suggestions[icon] %}

<div class="card">

<img src="https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/{{option}}.svg">

<br>

<input
type="radio"
name="icon"
value="{{option}}"
>

<div class="name">
{{option}}
</div>

</div>

{% endfor %}


</div>


<br>

<button>
Use selected
</button>


</form>


<br>


<a href="/search/{{icon|urlencode}}">
No match? Search manually
</a>


{% endfor %}


</body>

</html>
"""



SEARCH_PAGE = """
<!doctype html>

<html>

<head>

<title>
Search Icons
</title>


<style>

.card {
    display:inline-block;
    width:140px;
    border:1px solid #aaa;
    border-radius:8px;
    padding:10px;
    margin:10px;
    text-align:center;
}

.card img {
    width:70px;
    height:70px;
}

</style>


</head>


<body>


<h1>
Search icon for {{filename}}
</h1>


<form method="get" action="/search/{{target|urlencode}}">

<input
name="q"
value="{{query}}"
placeholder="Search Tabler icons"
>

<button>
Search
</button>

</form>



<form method="post" action="/use">


<input
type="hidden"
name="target"
value="{{target}}"
>


{% for icon in results %}


<div class="card">


<img src="https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/{{icon}}.svg">


<br>


<label>

<input
type="radio"
name="icon"
value="{{icon}}"
>

{{icon}}

</label>


</div>


{% endfor %}


<br>


<button>
Use selected icon
</button>


</form>


</body>

</html>
"""



@app.route("/")
def index():

    load_missing()

    return render_template_string(
        MAIN_PAGE,
        icons=missing_icons,
        suggestions={
            icon: search_icons(icon_filename(icon))
            for icon in missing_icons
        }
    )



@app.route("/search/<path:target>")
def search_page(target):

    filename = icon_filename(target)

    query = request.args.get(
        "q",
        filename
    )

    results = search_icons(
        query
    )

    print(
        "Search:",
        query,
        results
    )

    return render_template_string(
        SEARCH_PAGE,
        target=target,
        filename=filename,
        query=query,
        results=results
    )



@app.route(
    "/use",
    methods=["POST"]
)
def use_icon():

    target = request.form["target"]

    selected = request.form["icon"]


    if download_icon(
        selected,
        target
    ):

        if target in missing_icons:
            missing_icons.remove(target)
            save_missing_icons()


    return redirect("/")



def save_missing_icons():

    with open(
        MISSING_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        for icon in missing_icons:
            file.write(
                icon + "\n"
            )



if __name__ == "__main__":

    load_data()

    webbrowser.open(
        "http://127.0.0.1:5000"
    )

    app.run(
        host="127.0.0.1",
        port=5000
    )