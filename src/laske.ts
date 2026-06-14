import type { Kunta } from "./types";

// Suomalainen muotoilu: 13,9 %  ja  12 602
export const pros = (n: number): string =>
  n.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";

export const luku = (n: number): string => n.toLocaleString("fi-FI");

// Kuinka suuri osuus kunnista on valittua matalampi.
// Vertailu vain kuntiin joiden osuus on laskettavissa (ei nollajakoja).
export function persentiili(valittu: Kunta, kunnat: Kunta[]): number {
  if (valittu.osuus === null) return 0;
  const laskettavat = kunnat.filter((k) => k.osuus !== null);
  const matalampia = laskettavat.filter((k) => (k.osuus as number) < (valittu.osuus as number)).length;
  return Math.round((matalampia / laskettavat.length) * 100);
}

// Yksi selkokielinen lause ruudunlukijalle. Plain string, ei JSX.
export function ilmoitusTeksti(
  kunta: Kunta,
  mediaani: number,
  kunnat: Kunta[]
): string {
  if (kunta.osuus === null) {
    return `${kunta.kunta}: ei tietoa. Kunnassa ei varhaiskasvatuksen lapsia.`;
  }
  const pros2 = persentiili(kunta, kunnat);
  let sijalause: string;
  if (pros2 >= 100) sijalause = "Suomen korkein osuus.";
  else if (pros2 <= 0) sijalause = "Suomen matalin osuus.";
  else if (kunta.osuus < mediaani) sijalause = `Matalampi kuin ${100 - pros2} % Suomen kunnista.`;
  else sijalause = `Korkeampi kuin ${pros2} % Suomen kunnista.`;
  const epav = kunta.epavarma ? " Luku on epävarma, koska kunnassa on vähän lapsia." : "";
  return (
    `${kunta.kunta}: ${pros(kunta.osuus)} vieraskielisiä. ` +
    `Vieraskielisiä ${luku(kunta.vk)} lasta, kaikkiaan ${luku(kunta.kaikki)} lasta. ` +
    sijalause +
    epav
  );
}
