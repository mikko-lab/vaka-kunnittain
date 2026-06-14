import type { Kunta } from "../types";
import { pros, luku } from "../laske";

export default function Tulos({ kunta }: { kunta: Kunta }) {
  // Tila 1: lapsia 0 -> osuutta ei voi laskea
  if (kunta.osuus === null) {
    return (
      <div className="tulos tulos--tyhja">
        <p className="tulos__eitietoa">Ei tietoa</p>
        <p className="tulos__selite">
          {kunta.kunta}ssa ei ollut varhaiskasvatuksen lapsia tässä aineistossa,
          joten osuutta ei voi laskea.
        </p>
      </div>
    );
  }

  // Tila 2: pieni kunta -> luku epävarma
  // Tila 3: normaali
  return (
    <div className={"tulos" + (kunta.epavarma ? " tulos--epavarma" : "")}>
      <div className="tulos__luku">
        {kunta.epavarma ? "≈ " : ""}
        {pros(kunta.osuus)}
      </div>
      <p className="tulos__raaka">
        {luku(kunta.vk)} / {luku(kunta.kaikki)} lasta vieraskielisiä
      </p>
      {kunta.epavarma && (
        <p className="tulos__varoitus">
          Luku epävarma — kunnassa vain {luku(kunta.kaikki)} lasta. Pieni määrä
          tekee osuudesta herkän yksittäisille muutoksille.
        </p>
      )}
    </div>
  );
}
