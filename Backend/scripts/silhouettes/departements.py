"""Génère les cartes de France où un département est mis en évidence (questions taguées "carte").

Données : Natural Earth 1:10m, divisions administratives de niveau 1 (domaine public).

Depuis Backend/scripts/silhouettes/ :
    .venv/bin/python departements.py          tous les départements de métropole (sauf Paris et petite couronne)
    .venv/bin/python departements.py 29 2A    seulement ces numéros

Écrit Backend/assets/quiz/geographie/carte-departement-<numéro>.webp
et data/voisins-departements.json (départements limitrophes, utiles pour choisir les mauvaises réponses).
"""

import io
import json
import sys
import urllib.request
from pathlib import Path

import geopandas as gpd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

HERE = Path(__file__).resolve().parent
DATA_URL = "https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.zip"
DATA_FILE = HERE / "data" / "ne_10m_admin_1_states_provinces.zip"
NEIGHBOURS_FILE = HERE / "data" / "voisins-departements.json"
OUT_DIR = HERE.parent.parent / "assets" / "quiz" / "geographie"

SIZE_PX = 512
MARGIN = 0.04
# Trop petits pour être visibles sur une carte de toute la France.
EXCLUDED = {"75", "92", "93", "94"}


def load_departments():
    if not DATA_FILE.exists():
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        print(f"Téléchargement de {DATA_URL}")
        urllib.request.urlretrieve(DATA_URL, DATA_FILE)
    world = gpd.read_file(DATA_FILE)
    metro = world[(world["adm0_a3"] == "FRA") & (world["type_en"] == "Metropolitan department")].copy()
    metro["code"] = metro["iso_3166_2"].str.split("-").str[1]
    # Lambert-93 : la projection officielle de la France métropolitaine.
    return metro.to_crs("EPSG:2154").set_index("code")


def write_neighbours(departments):
    neighbours = {}
    for code, row in departments.iterrows():
        touching = departments[departments.geometry.intersects(row.geometry.buffer(1000))].index
        neighbours[code] = sorted(c for c in touching if c != code)
    NEIGHBOURS_FILE.write_text(json.dumps(neighbours, indent=2, ensure_ascii=False))


def render(departments, france, code, out_path):
    minx, miny, maxx, maxy = france.bounds
    half = max(maxx - minx, maxy - miny) * (0.5 + MARGIN)
    cx, cy = (minx + maxx) / 2, (miny + maxy) / 2

    dpi = 100
    fig = plt.figure(figsize=(SIZE_PX / dpi, SIZE_PX / dpi), dpi=dpi, facecolor="white")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(cx - half, cx + half)
    ax.set_ylim(cy - half, cy + half)
    ax.set_aspect("equal")
    ax.axis("off")
    departments.plot(ax=ax, facecolor="white", edgecolor="#a0a0a0", linewidth=0.4)
    departments.loc[[code]].plot(ax=ax, facecolor="black", edgecolor="black", linewidth=0.4)
    gpd.GeoSeries([france]).plot(ax=ax, facecolor="none", edgecolor="black", linewidth=1.1)

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=dpi, facecolor="white")
    plt.close(fig)
    buffer.seek(0)
    Image.open(buffer).convert("L").save(out_path, "WEBP", lossless=True, method=6)


def main(codes):
    departments = load_departments()
    unknown = [c for c in codes if c not in departments.index or c in EXCLUDED]
    if unknown:
        sys.exit(f"Numéros inconnus ou exclus : {', '.join(unknown)}")

    write_neighbours(departments)
    france = departments.geometry.union_all()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for code in codes or sorted(c for c in departments.index if c not in EXCLUDED):
        out_path = OUT_DIR / f"carte-departement-{code.lower()}.webp"
        render(departments, france, code, out_path)
        print(f"{code}  {out_path.name}  {out_path.stat().st_size / 1024:.1f} Ko")


if __name__ == "__main__":
    main(sys.argv[1:])
