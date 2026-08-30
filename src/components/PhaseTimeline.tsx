import { Measure, Phase, phases } from "@/lib/data";
import { isExpired, isLastChance, phaseIndex } from "@/lib/measureDetails";
import styles from "./PhaseTimeline.module.css";

interface PhaseTimelineProps {
  phase: Phase;
  measures: Measure[];
  selected: Set<string>;
  decidedIds: Set<string>;
  onSelectPhase: (phase: Phase) => void;
}

export default function PhaseTimeline({ phase, measures, selected, decidedIds, onSelectPhase }: PhaseTimelineProps) {
  const current = phaseIndex(phase);

  const lastChance = measures.filter((m) => isLastChance(m, phase) && !selected.has(m.id) && !decidedIds.has(m.id));
  const expiredOpen = measures.filter((m) => isExpired(m, phase) && m.status === "verplicht" && !selected.has(m.id) && !decidedIds.has(m.id));

  return (
    <section id="traject" className={styles.timeline}>
      <div className="section-heading">
        <span className="step">T</span>
        <div>
          <h2>Fasetraject</h2>
          <p>Klik op een fase om vooruit of terug te kijken. De assistent toont per fase wat nog open staat.</p>
        </div>
      </div>

      <ol className={styles.track}>
        {phases.map((item, index) => {
          const inPhase = measures.filter((m) => m.phases.includes(item));
          const required = inPhase.filter((m) => m.status === "verplicht");
          const handled = inPhase.filter((m) => selected.has(m.id) || decidedIds.has(m.id)).length;
          const stateClass = index < current ? styles.past : index === current ? styles.current : styles.future;
          return (
            <li key={item} className={`${styles.node} ${stateClass}`}>
              <button type="button" onClick={() => onSelectPhase(item)} aria-current={index === current ? "step" : undefined}>
                <span className={styles.dot}>{index + 1}</span>
                <strong>{item}</strong>
                <span className={styles.count}>
                  {handled}/{inPhase.length} behandeld
                  {required.length ? ` · ${required.length} verplicht` : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.alerts}>
        <article className={`${styles.alert} ${lastChance.length ? styles.warn : styles.ok}`}>
          <strong>Laatste kans in {phase}</strong>
          {lastChance.length ? (
            <ul>
              {lastChance.map((m) => (
                <li key={m.id}>{m.title}</li>
              ))}
            </ul>
          ) : (
            <p>Geen open maatregelen die na deze fase vervallen.</p>
          )}
        </article>
        <article className={`${styles.alert} ${expiredOpen.length ? styles.danger : styles.ok}`}>
          <strong>Verplicht, maar niet besloten in eerdere fase</strong>
          {expiredOpen.length ? (
            <ul>
              {expiredOpen.map((m) => (
                <li key={m.id}>{m.title}</li>
              ))}
            </ul>
          ) : (
            <p>Alle verplichte maatregelen uit eerdere fasen zijn geselecteerd of vastgelegd in het besluitenlog.</p>
          )}
        </article>
      </div>
    </section>
  );
}
