# Vieraskieliset päiväkotilapset kunnittain

Hakukone, jolla näkee vieraskielisten varhaiskasvatuslasten osuuden
kunnittain ja suhteuttaa sen koko maahan. Datajournalistinen demo
Tilastokeskuksen avoimesta aineistosta.

## Käyttö

```bash
npm install
npm run dev      # kehitys
npm run build    # tuotanto -> dist/
```

## Data

Lähde: Tilastokeskus, StatFin 14jt (varhaiskasvatus), vuosi 2024.
Ladattu käyttöliittymästä CSV:nä (ei rajapintaa). Muunnos `muunna.py`
tuottaa `src/data.json`:in. Vieraskielinen = äidinkieli muu kuin suomi,
ruotsi tai saame.

## Ratkaisuista

- Osuus = vieraskieliset / kaikki osallistuneet per kunta.
- Suhteutus: kunnan sija jakaumassa + kuntien mediaani + koko maa.
  Koko maan luku (13,9 %) on suurten kaupunkien painottama, joten mediaani
  (4,3 %) kuvaa tyypillistä kuntaa rehellisemmin.
- Nollajako (0 lasta): osuus = null, näytetään "Ei tietoa".
- Pienet kunnat (< 50 lasta): merkitään epävarmoiksi.

## Tekninen

Vite + React + TypeScript. Ei riippuvuuksia datavisualisointiin
(jakaumajana käsin). Saavutettavuus: semanttinen rakenne, aria-live
tulosalueella, näppäimistö, tarkistetut kontrastit. Mobile-first.
