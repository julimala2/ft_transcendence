"""Génère les silhouettes de pays des questions taguées "silhouette" (prisma/data/geography.json).

Données : Natural Earth 1:10m, version « point de vue de la France » (domaine public).

Depuis Backend/scripts/silhouettes/ :
    python3 -m venv .venv && .venv/bin/pip install -r requirements.txt   (une seule fois)
    .venv/bin/python generate.py            tous les pays de COUNTRIES
    .venv/bin/python generate.py ESP PRT    seulement ces codes (colonne ADM0_A3 de Natural Earth)

Les images sont écrites dans Backend/assets/quiz/geographie/silhouette-<slug>.webp
"""

import io
import sys
import urllib.request
from pathlib import Path

import geopandas as gpd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image
from shapely.ops import unary_union

HERE = Path(__file__).resolve().parent
DATA_URL = "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries_fra.zip"
DATA_FILE = HERE / "data" / "ne_10m_admin_0_countries_fra.zip"
OUT_DIR = HERE.parent.parent / "assets" / "quiz" / "geographie"

SIZE_PX = 512
MARGIN = 0.06
LINE_PX = 3
# Une île est gardée si elle est à moins de GAP_KM d'une partie déjà gardée :
# on garde ainsi les archipels, mais pas les territoires lointains (Canaries, Alaska, île de Pâques...).
GAP_KM = 350
# Les îles plus petites que cette fraction de la surface du pays sont ignorées (ce ne serait que des points).
MIN_AREA_RATIO = 0.0005

COUNTRIES = {
    # Europe
    "ESP": "espagne", "PRT": "portugal", "IRL": "irlande", "ISL": "islande", "NOR": "norvege",
    "SWE": "suede", "FIN": "finlande", "DEU": "allemagne", "HRV": "croatie", "UKR": "ukraine",
    "AUT": "autriche", "DNK": "danemark", "NLD": "pays-bas", "MDA": "moldavie", "CHE": "suisse",
    # Asie
    "JPN": "japon", "IND": "inde", "CHN": "chine", "VNM": "vietnam", "THA": "thailande",
    "LKA": "sri-lanka", "TUR": "turquie", "SAU": "arabie-saoudite", "IRN": "iran", "MNG": "mongolie",
    "PHL": "philippines", "IDN": "indonesie",
    # Afrique
    "EGY": "egypte", "MDG": "madagascar", "ZAF": "afrique-du-sud", "SOM": "somalie", "DZA": "algerie",
    "NGA": "nigeria", "ETH": "ethiopie", "KEN": "kenya", "GMB": "gambie", "MAR": "maroc",
    # Amérique
    "USA": "etats-unis", "CAN": "canada", "MEX": "mexique", "CUB": "cuba", "PAN": "panama",
    "BRA": "bresil", "ARG": "argentine", "CHL": "chili", "PER": "perou", "COL": "colombie",
    # Océanie
    "AUS": "australie", "NZL": "nouvelle-zelande", "PNG": "papouasie-nouvelle-guinee",
}


def load_countries():
    if not DATA_FILE.exists():
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        print(f"Téléchargement de {DATA_URL}")
        urllib.request.urlretrieve(DATA_URL, DATA_FILE)
    return gpd.read_file(DATA_FILE)


def local_projection(lon, lat):
    # Projection équivalente centrée sur le pays : les formes ne sont pas étirées, même près des pôles.
    return f"+proj=laea +lat_0={lat} +lon_0={lon} +datum=WGS84 +units=m"


def main_territory(geometry):
    """Garde la partie principale du pays et les îles proches, en mètres dans une projection locale."""
    parts = gpd.GeoSeries(list(getattr(geometry, "geoms", [geometry])), crs="EPSG:4326")
    largest = parts.iloc[parts.to_crs("EPSG:6933").area.argmax()].representative_point()
    parts = parts.to_crs(local_projection(largest.x, largest.y))

    kept = {int(parts.area.argmax())}
    changed = True
    while changed:
        changed = False
        kept_shape = unary_union([parts.iloc[i] for i in kept])
        for i in range(len(parts)):
            if i not in kept and parts.iloc[i].distance(kept_shape) <= GAP_KM * 1000:
                kept.add(i)
                changed = True

    total = sum(parts.iloc[i].area for i in kept)
    shape = unary_union([parts.iloc[i] for i in kept if parts.iloc[i].area >= total * MIN_AREA_RATIO])

    # Reprojection centrée sur le territoire gardé, et non plus sur sa plus grande île.
    center = gpd.GeoSeries([shape.centroid], crs=parts.crs).to_crs("EPSG:4326").iloc[0]
    return gpd.GeoSeries([shape], crs=parts.crs).to_crs(local_projection(center.x, center.y)).iloc[0]


def render(shape, out_path):
    minx, miny, maxx, maxy = shape.bounds
    extent = max(maxx - minx, maxy - miny)
    shape = shape.simplify(extent / 1500)
    half = extent * (0.5 + MARGIN)
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2

    dpi = 100
    fig = plt.figure(figsize=(SIZE_PX / dpi, SIZE_PX / dpi), dpi=dpi, facecolor="white")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(cx - half, cx + half)
    ax.set_ylim(cy - half, cy + half)
    ax.set_aspect("equal")
    ax.axis("off")
    gpd.GeoSeries([shape]).plot(ax=ax, facecolor="white", edgecolor="black", linewidth=LINE_PX * 72 / dpi)

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=dpi, facecolor="white")
    plt.close(fig)
    buffer.seek(0)
    Image.open(buffer).convert("L").save(out_path, "WEBP", lossless=True, method=6)


def main(codes):
    unknown = [c for c in codes if c not in COUNTRIES]
    if unknown:
        sys.exit(f"Codes inconnus (à ajouter dans COUNTRIES) : {', '.join(unknown)}")

    world = load_countries()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for code in codes or COUNTRIES:
        rows = world[world["ADM0_A3"] == code]
        if rows.empty:
            sys.exit(f"{code} absent des données Natural Earth")
        out_path = OUT_DIR / f"silhouette-{COUNTRIES[code]}.webp"
        render(main_territory(rows.iloc[0].geometry), out_path)
        print(f"{code}  {out_path.name}  {out_path.stat().st_size / 1024:.1f} Ko")


if __name__ == "__main__":
    main(sys.argv[1:])
