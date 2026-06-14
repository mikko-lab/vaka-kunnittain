import type { ReactNode } from "react";
import type { Kunta } from "../types";
import { pros, persentiili } from "../laske";

function jakaumalause(pros2: number, osuus: number, mediaani: number): ReactNode {
  if (pros2 >= 100) return <>Suomen <strong>korkein</strong> osuus.</>;
  if (pros2 <= 0)   return <>Suomen <strong>matalin</strong> osuus.</>;
  if (osuus < mediaani)
    return <>Matalampi kuin <strong>{100 - pros2} %</strong> Suomen kunnista.</>;
  return <>Korkeampi kuin <strong>{pros2} %</strong> Suomen kunnista.</>;
}

interface Props {
  kunta: Kunta;
  kokoMaa: number;
  mediaani: number;
  kunnat: Kunta[];
}

export default function Jakauma({ kunta, kokoMaa, mediaani, kunnat }: Props) {
  if (kunta.osuus === null) return null;

  // Skaala 0..max. Suomen korkein kuntaosuus on n. 41 %.
  const max = Math.max(45, Math.ceil(kunta.osuus));
  const sija = (v: number) => `${(v / max) * 100}%`;
  const pros2 = persentiili(kunta, kunnat);

  const kuntaLeftPct = (kunta.osuus / max) * 100;
  const kuntaNimiStyle: React.CSSProperties =
    kuntaLeftPct < 12
      ? { left: 0, transform: "none" }
      : kuntaLeftPct > 88
      ? { left: "100%", transform: "translateX(-100%)" }
      : {};

  const seliteTeksti =
    `${kunta.kunta}: ${pros(kunta.osuus)}. ` +
    `Kuntien mediaani ${pros(mediaani)}, koko maa ${pros(kokoMaa)}.`;

  return (
    <section className="jakauma" aria-labelledby="jakauma-otsikko">
      <h2 id="jakauma-otsikko" className="jakauma__otsikko">
        Suhteessa muuhun Suomeen
      </h2>

      <div className="jakauma__jana" role="img" aria-label={seliteTeksti}>
        <div className="jakauma__viiva" role="presentation" />
        <div className="jakauma__merkki jakauma__merkki--mediaani" role="presentation" style={{ left: sija(mediaani) }} aria-hidden="true" />
        <span className="jakauma__lipuke jakauma__lipuke--mediaani" style={{ left: sija(mediaani) }} aria-hidden="true">mediaani {pros(mediaani)}</span>
        <div className="jakauma__merkki jakauma__merkki--maa" role="presentation" style={{ left: sija(kokoMaa) }} aria-hidden="true" />
        <span className="jakauma__lipuke" style={{ left: sija(kokoMaa) }} aria-hidden="true">koko maa {pros(kokoMaa)}</span>
        <div className="jakauma__kunta" role="presentation" style={{ left: sija(kunta.osuus) }} aria-hidden="true">
          <span className="jakauma__kunta-nimi" style={kuntaNimiStyle}>{kunta.kunta}</span>
        </div>
      </div>

      <p className="jakauma__lause">{jakaumalause(pros2, kunta.osuus, mediaani)}</p>
      <p className="jakauma__huom">
        Koko maan osuus ({pros(kokoMaa)}) on suurten kaupunkien painottama.
        Mediaani ({pros(mediaani)}) kuvaa tyypillistä kuntaa paremmin.
      </p>
    </section>
  );
}
