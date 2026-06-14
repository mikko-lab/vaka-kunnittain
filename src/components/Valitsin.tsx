import type { Kunta } from "../types";

interface Props {
  kunnat: Kunta[];
  valittu: string;
  onChange: (kunta: string) => void;
}

export default function Valitsin({ kunnat, valittu, onChange }: Props) {
  return (
    <div className="valitsin">
      <label htmlFor="kunta-valinta">Valitse kunta</label>
      <select
        id="kunta-valinta"
        value={valittu}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— Valitse kunta —</option>
        {kunnat.map((k) => (
          <option key={k.kunta} value={k.kunta}>
            {k.kunta}
          </option>
        ))}
      </select>
    </div>
  );
}
