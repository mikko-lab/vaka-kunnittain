export interface Kunta {
  kunta: string;
  kaikki: number;
  vk: number;
  osuus: number | null; // null kun lapsia 0 -> osuutta ei voi laskea
  epavarma: boolean; // true kun lapsia vain vähän (kohina + tunnistettavuus)
}

export interface Data {
  vuosi: number;
  lahde: string;
  kokoMaa: { kaikki: number; vk: number; osuus: number };
  kuntienMediaani: number;
  epavarmaRaja: number;
  kunnat: Kunta[];
}
