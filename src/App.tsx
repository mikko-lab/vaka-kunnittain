import { useState } from "react";
import type { Data } from "./types";
import rawData from "./data.json";
import Valitsin from "./components/Valitsin";
import Tulos from "./components/Tulos";
import Jakauma from "./components/Jakauma";

const data = rawData as Data;

export default function App() {
  const [valittu, setValittu] = useState("");
  const kunta = data.kunnat.find((k) => k.kunta === valittu) ?? null;

  return (
    <main className="sovellus">
      <header className="otsikko">
        <h1>Vieraskieliset päiväkotilapset kunnittain</h1>
        <p className="otsikko__ala">
          Vieraskielisten lasten osuus varhaiskasvatuksesta · {data.vuosi}
        </p>
      </header>

      <Valitsin kunnat={data.kunnat} valittu={valittu} onChange={setValittu} />

      <div className="tulosalue" aria-live="polite">
        {kunta === null ? (
          <p className="kehote">Valitse kunta nähdäksesi sen osuuden ja vertailun koko maahan.</p>
        ) : (
          <>
            <Tulos kunta={kunta} />
            <Jakauma
              kunta={kunta}
              kokoMaa={data.kokoMaa.osuus}
              mediaani={data.kuntienMediaani}
              kunnat={data.kunnat}
            />
          </>
        )}
      </div>

      <footer className="lahde">
        <p>
          Lähde: {data.lahde}, {data.vuosi}. Vieraskielinen = henkilö, jonka
          äidinkieli on muu kuin suomi, ruotsi tai saame. Luku kuvaa kieltä, ei
          kansalaisuutta eikä suomen kielen taitoa.
        </p>
      </footer>
    </main>
  );
}
