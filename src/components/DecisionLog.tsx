import { useState } from "react";
import { Measure, Phase } from "@/lib/data";
import { Decision, DecisionOutcome, newId } from "@/lib/project";
import buttonStyles from "./shared/Button.module.css";
import styles from "./DecisionLog.module.css";

interface DecisionLogProps {
  phase: Phase;
  measures: Measure[];
  decisions: Decision[];
  onChange: (decisions: Decision[]) => void;
}

const outcomes: DecisionOutcome[] = ["aangenomen", "afgewezen", "uitgesteld"];

export default function DecisionLog({ phase, measures, decisions, onChange }: DecisionLogProps) {
  const [measureId, setMeasureId] = useState(measures[0]?.id ?? "");
  const [outcome, setOutcome] = useState<DecisionOutcome>("aangenomen");
  const [reason, setReason] = useState("");

  const selectedId = measures.some((m) => m.id === measureId) ? measureId : measures[0]?.id ?? "";

  const add = () => {
    const measure = measures.find((m) => m.id === selectedId);
    if (!measure || !reason.trim()) return;
    onChange([
      {
        id: newId("d"),
        measureId: measure.id,
        measureTitle: measure.title,
        phase,
        outcome,
        reason: reason.trim(),
        date: new Date().toISOString().slice(0, 10)
      },
      ...decisions
    ]);
    setReason("");
  };

  const remove = (id: string) => onChange(decisions.filter((d) => d.id !== id));

  return (
    <section id="besluiten" className={styles.log}>
      <div className="section-heading">
        <span className="step">L</span>
        <div>
          <h2>Besluitenlog</h2>
          <p>Leg vast wat is aangenomen, afgewezen of uitgesteld, en waarom. Zo blijft de keuze later uitlegbaar.</p>
        </div>
      </div>

      <div className={styles.form}>
        <label>
          Maatregel
          <select value={selectedId} onChange={(e) => setMeasureId(e.target.value)}>
            {measures.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Besluit
          <select value={outcome} onChange={(e) => setOutcome(e.target.value as DecisionOutcome)}>
            {outcomes.map((o) => (
              <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.reason}>
          Onderbouwing
          <input
            value={reason}
            placeholder="Bijv. MPG-variant B scoort 22 kg/m2 lager bij +3% bouwkosten; directie akkoord op 12 mei."
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
        </label>
        <button type="button" className={buttonStyles.button} onClick={add} disabled={!reason.trim()}>
          Vastleggen
        </button>
      </div>

      {decisions.length === 0 ? (
        <p className={styles.empty}>Nog geen besluiten vastgelegd in dit project.</p>
      ) : (
        <ul className={styles.list}>
          {decisions.map((d) => (
            <li key={d.id}>
              <span className={`${styles.badge} ${styles[d.outcome]}`}>{d.outcome}</span>
              <div>
                <strong>{d.measureTitle}</strong>
                <p>{d.reason}</p>
                <small>
                  {d.phase} · {d.date}
                </small>
              </div>
              <button type="button" onClick={() => remove(d.id)} title="Besluit verwijderen">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
