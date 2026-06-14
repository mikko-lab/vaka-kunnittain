#!/usr/bin/env python3
"""
Muuntaa Tilastokeskuksen StatFin 14jt -CSV:n sovelluksen data.json-muotoon.

Lataa CSV osoitteesta:
  https://statfin.stat.fi/PxWeb/pxweb/fi/StatFin/StatFin__vaka/statfin_vaka_pxt_14jt.px/
Valitse: kaikki alueet, ikä=yhteensä, vuosi=2024, lataa puolipisteCSV.

Käyttö:
  python3 muunna.py 14jt_2024.csv
  python3 muunna.py 14jt_2024.csv --vuosi 2023
"""

import csv
import json
import sys
import statistics
from pathlib import Path


EPAVARMARAJA = 50  # alle tämän lapsiluvun kunta merkitään epävarmaksi


def lue_csv(polku: str) -> list[dict]:
    with open(polku, encoding="latin-1", newline="") as f:
        rivit = list(f)

    # Rivi 0: otsikkorivi, rivi 1: tyhjä, rivi 2: sarakeheaderit
    lukija = csv.reader(rivit[2:], delimiter=";", quotechar='"')
    sarakkeet = next(lukija)  # Vuosi; Alue; Kaikki; Vieraskieliset

    rivit_out = []
    for rivi in lukija:
        if len(rivi) < 4:
            continue
        vuosi, alue, kaikki_s, vk_s = rivi[0], rivi[1], rivi[2], rivi[3]
        try:
            kaikki = int(kaikki_s)
            vk = int(vk_s)
        except ValueError:
            # Tilastokeskus merkitsee puuttuvat tiedot pisteellä
            kaikki, vk = 0, 0
        rivit_out.append({"vuosi": int(vuosi), "alue": alue, "kaikki": kaikki, "vk": vk})
    return rivit_out


def osuus(kaikki: int, vk: int) -> float | None:
    if kaikki == 0:
        return None
    return round(vk / kaikki * 100, 1)


def muunna(csv_polku: str, vuosi: int = 2024) -> dict:
    kaikki_rivit = lue_csv(csv_polku)
    rivit = [r for r in kaikki_rivit if r["vuosi"] == vuosi]

    koko_maa = next(r for r in rivit if r["alue"].upper() == "KOKO MAA")
    kunnat_rivit = [r for r in rivit if r["alue"].upper() != "KOKO MAA"]

    kunnat = []
    for r in kunnat_rivit:
        osuus_arvo = osuus(r["kaikki"], r["vk"])
        kunnat.append({
            "kunta": r["alue"],
            "kaikki": r["kaikki"],
            "vk": r["vk"],
            "osuus": osuus_arvo,
            "epavarma": 0 < r["kaikki"] < EPAVARMARAJA,
        })

    kunnat.sort(key=lambda k: k["kunta"])

    osuudet = [k["osuus"] for k in kunnat if k["osuus"] is not None]
    mediaani = round(statistics.median(osuudet), 1)

    return {
        "vuosi": vuosi,
        "lahde": "Tilastokeskus, StatFin 14jt (varhaiskasvatus)",
        "kokoMaa": {
            "kaikki": koko_maa["kaikki"],
            "vk": koko_maa["vk"],
            "osuus": osuus(koko_maa["kaikki"], koko_maa["vk"]),
        },
        "kuntienMediaani": mediaani,
        "epavarmaRaja": EPAVARMARAJA,
        "kunnat": kunnat,
    }


if __name__ == "__main__":
    import argparse

    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("csv", help="Tilastokeskuksen 14jt-CSV-tiedosto")
    ap.add_argument("--vuosi", type=int, default=2024, help="Tilastovuosi (oletus: 2024)")
    ap.add_argument("--kohde", default="src/data.json", help="Kohdetiedosto (oletus: src/data.json)")
    args = ap.parse_args()

    data = muunna(args.csv, args.vuosi)

    kohde = Path(args.kohde)
    kohde.parent.mkdir(parents=True, exist_ok=True)
    with open(kohde, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Kirjoitettu {kohde}: {len(data['kunnat'])} kuntaa, mediaani {data['kuntienMediaani']} %")
