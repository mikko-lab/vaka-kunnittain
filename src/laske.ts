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
