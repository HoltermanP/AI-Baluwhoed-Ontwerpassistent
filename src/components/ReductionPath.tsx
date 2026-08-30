import { Measure } from "@/lib/data";
import { detail, reductionMid } from "@/lib/measureDetails";
import styles from "./ReductionPath.module.css";

interface ReductionPathProps {
  co2: number;
  budget: number;
  bvo: number;
  selectedMeasures: Measure[];
  candidates: Measure[];
  onToggle: (id: string) => void;
}

export function reductionTotals(selected: Measure[]): { low: number; mid: number; high: number } {
  return selected.reduce(
    (acc, m) => {
      const [low, high] = detail(m).reduction;
      return { low: acc.low + low, mid: acc.mid + (low + high) / 2, high: acc.high + high };
    },
    { low: 0, mid: 0, high: 0 }
  );
}

export default function ReductionPath({ co2, budget, bvo, selectedMeasures, candidates, onToggle }: ReductionPathProps) {
  const contributing = selectedMeasures.filter((m) => reductionMid(m) > 0);
  const totals = reductionTotals(selectedMeasures);
  const gap = Math.max(0, co2 - budget);
  const afterMid = Math.max(0, co2 - totals.mid);
  const remaining = Math.max(0, afterMid - budget);
  const coverage = gap > 0 ? Math.min(100, Math.round((totals.mid / gap) * 100)) : 100;

  const scaleMax = Math.max(co2, budget) * 1.1;
  const pct = (value: number) => `${Math.max(0, Math.min(100, (value / scaleMax) * 100))}%`;

  const suggestions = candidates
    .filter((m) => !selectedMeasures.some((s) => s.id === m.id) && reductionMid(m) > 0)
    .sort((a, b) => reductionMid(b) - reductionMid(a))
    .slice(0, 4);

  const statusClass = remaining === 0 ? styles.ok : coverage >= 50 ? styles.warn : styles.danger;

  return (
    <section id="reductiepad" className={styles.path}>
      <div className="section-heading">
        <span className="step">R</span>
        <div>
          <h2>CO2-reductiepad</h2>
          <p>Indicatief effect van geselecteerde maatregelen op de afstand tot Paris Proof.</p>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: pct(co2) }} />
        <div className={styles.barAfter} style={{ width: pct(afterMid) }} />
        <div className={styles.budgetLine} style={{ left: pct(budget) }}>
          <span>budget {budget}</span>
        </div>
      </div>
      <div className={styles.legend}>
        <span>
          <i className={styles.swatchNow} /> Huidig {co2} kg/m2
        </span>
        <span>
          <i className={styles.swatchAfter} /> Na maatregelen ~{Math.round(afterMid)} kg/m2
        </span>
        <span>
          <i className={styles.swatchBudget} /> Paris Proof {budget} kg/m2
        </span>
      </div>

      <div className={styles.stats}>
        <article className={statusClass}>
          <span>Dekking van de opgave</span>
          <strong>{coverage}%</strong>
          <small>
            {Math.round(totals.low)}–{Math.round(totals.high)} kg/m2 reductie geselecteerd van {gap} kg/m2 nodig
          </small>
        </article>
        <article>
          <span>Resterende opgave</span>
          <strong>{Math.round(remaining)}</strong>
          <small>kg CO2/m2 BVO · ~{Math.round((remaining * bvo) / 1000)} ton totaal</small>
        </article>
        <article>
          <span>Bijdragende maatregelen</span>
          <strong>{contributing.length}</strong>
          <small>van {selectedMeasures.length} geselecteerd hebben een CO2-effect</small>
        </article>
      </div>

      <div className={styles.columns}>
        <div>
          <h3>Geselecteerde bijdragen</h3>
          {contributing.length === 0 ? (
            <p className={styles.empty}>Nog geen maatregelen met CO2-effect geselecteerd. Kies hieronder of bij de maatregelen.</p>
          ) : (
            <ul className={styles.list}>
              {contributing
                .sort((a, b) => reductionMid(b) - reductionMid(a))
                .map((m) => {
                  const [low, high] = detail(m).reduction;
                  return (
                    <li key={m.id}>
                      <div className={styles.miniBar}>
                        <i style={{ width: `${Math.min(100, (reductionMid(m) / Math.max(1, gap)) * 100)}%` }} />
                      </div>
                      <span>{m.title}</span>
                      <b>
                        {low}–{high}
                      </b>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
        <div>
          <h3>{remaining > 0 ? "Grootste resterende kansen in deze fase" : "Extra kansen voor marge"}</h3>
          {suggestions.length === 0 ? (
            <p className={styles.empty}>Geen aanvullende CO2-maatregelen binnen de huidige filters.</p>
          ) : (
            <ul className={styles.list}>
              {suggestions.map((m) => {
                const [low, high] = detail(m).reduction;
                return (
                  <li key={m.id}>
                    <button type="button" onClick={() => onToggle(m.id)} className={styles.add}>
                      + toevoegen
                    </button>
                    <span>{m.title}</span>
                    <b>
                      {low}–{high}
                    </b>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <p className={styles.footnote}>
        Bandbreedtes zijn indicatief (embodied carbon, kg CO2/m2 BVO) en niet zonder meer optelbaar; laat de gekozen set
        doorrekenen in een MPG/LCA-variantberekening voordat het besluit wordt vastgelegd.
      </p>
    </section>
  );
}
