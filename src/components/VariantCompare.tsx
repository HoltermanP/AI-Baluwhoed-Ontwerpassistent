import { Variant, newId, scoreVariant } from "@/lib/project";
import buttonStyles from "./shared/Button.module.css";
import styles from "./VariantCompare.module.css";

interface VariantCompareProps {
  variants: Variant[];
  budget: number;
  bvo: number;
  onChange: (variants: Variant[]) => void;
  onUseAsCurrent: (co2: number) => void;
}

const numericFields: { key: keyof Variant; label: string; unit: string; min?: number; max?: number }[] = [
  { key: "co2", label: "CO2", unit: "kg/m2 BVO", min: 0 },
  { key: "extraCost", label: "Meerkosten", unit: "euro/m2 BVO" },
  { key: "risk", label: "Risico", unit: "1 laag – 5 hoog", min: 1, max: 5 },
  { key: "weeks", label: "Bouwtijd", unit: "± weken t.o.v. ref." }
];

export default function VariantCompare({ variants, budget, bvo, onChange, onUseAsCurrent }: VariantCompareProps) {
  const update = (id: string, patch: Partial<Variant>) =>
    onChange(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const remove = (id: string) => onChange(variants.filter((v) => v.id !== id));

  const add = () =>
    onChange([
      ...variants,
      { id: newId("v"), name: `Variant ${variants.length + 1}`, co2: budget, extraCost: 0, risk: 2, weeks: 0, note: "" }
    ]);

  const ranked = [...variants].map((v) => ({ v, score: scoreVariant(v, variants, budget) })).sort((a, b) => b.score - a.score);
  const best = ranked[0]?.v;
  const reference = variants[0];

  return (
    <section id="varianten" className={styles.compare}>
      <div className="section-heading">
        <span className="step">V</span>
        <div>
          <h2>Variantvergelijking</h2>
          <p>Vergelijk ontwerpvarianten op CO2, kosten, risico en bouwtijd. Vul eigen cijfers uit MPG/raming in.</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Variant</th>
              {numericFields.map((f) => (
                <th key={f.key}>
                  {f.label}
                  <small>{f.unit}</small>
                </th>
              ))}
              <th>
                Totaal CO2
                <small>ton, indicatief</small>
              </th>
              <th>
                Meerkosten
                <small>euro totaal</small>
              </th>
              <th>Score</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => {
              const score = scoreVariant(variant, variants, budget);
              const withinBudget = variant.co2 <= budget;
              return (
                <tr key={variant.id} className={best?.id === variant.id ? styles.best : ""}>
                  <td className={styles.nameCell}>
                    <input
                      value={variant.name}
                      onChange={(e) => update(variant.id, { name: e.target.value })}
                      aria-label="Variantnaam"
                    />
                    <input
                      value={variant.note}
                      placeholder="Aandachtspunt of randvoorwaarde"
                      onChange={(e) => update(variant.id, { note: e.target.value })}
                      aria-label="Notitie"
                      className={styles.note}
                    />
                  </td>
                  {numericFields.map((f) => (
                    <td key={f.key}>
                      <input
                        type="number"
                        min={f.min}
                        max={f.max}
                        value={variant[f.key] as number}
                        onChange={(e) => update(variant.id, { [f.key]: Number(e.target.value) } as Partial<Variant>)}
                        aria-label={f.label}
                        className={f.key === "co2" ? (withinBudget ? styles.good : styles.bad) : ""}
                      />
                    </td>
                  ))}
                  <td className={styles.calc}>{Math.round((variant.co2 * bvo) / 1000)} t</td>
                  <td className={styles.calc}>
                    {variant.extraCost === 0 ? "—" : `${variant.extraCost > 0 ? "+" : ""}${Math.round((variant.extraCost * bvo) / 1000)}k`}
                  </td>
                  <td className={styles.score}>
                    <strong>{score}</strong>
                  </td>
                  <td className={styles.actions}>
                    <button type="button" onClick={() => onUseAsCurrent(variant.co2)} title="Gebruik deze CO2-waarde als huidige projectprestatie">
                      Gebruik
                    </button>
                    {variants.length > 1 && (
                      <button type="button" onClick={() => remove(variant.id)} title="Variant verwijderen" className={styles.remove}>
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <button type="button" className={`${buttonStyles.button} ${buttonStyles.dark}`} onClick={add}>
          + Variant toevoegen
        </button>
        {best && reference && (
          <p>
            <strong>Hoogste integrale score: {best.name}</strong>
            {best.id !== reference.id && (
              <>
                {" "}
                — {Math.round(reference.co2 - best.co2)} kg CO2/m2 minder dan de referentie (~
                {Math.round(((reference.co2 - best.co2) * bvo) / 1000)} ton), meerkosten ~
                {Math.round(((best.extraCost - reference.extraCost) * bvo) / 1000)}k euro.
              </>
            )}{" "}
            {best.co2 <= budget ? "Deze variant valt binnen het Paris Proof-budget." : `Nog ${Math.round(best.co2 - budget)} kg/m2 boven budget: combineer met maatregelen uit het reductiepad.`}
          </p>
        )}
      </div>
    </section>
  );
}
