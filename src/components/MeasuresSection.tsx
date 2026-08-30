import { Measure, Phase } from "@/lib/data";
import MeasureCard from "./MeasureCard";
import styles from "./MeasuresSection.module.css";

interface MeasuresSectionProps {
  measures: Measure[];
  phase: Phase;
  selected: Set<string>;
  scores: Map<string, number>;
  onToggle: (id: string) => void;
  query?: string;
  onClearQuery?: () => void;
}

export default function MeasuresSection({ measures, phase, selected, scores, onToggle, query, onClearQuery }: MeasuresSectionProps) {
  return (
    <section id="measures" className={styles.measuresSection}>
      <div className="section-heading">
        <span className="step">5</span>
        <div>
          <h2>Maatregelen</h2>
          <p>
            {measures.length} maatregelen
            {query ? (
              <>
                {" "}
                voor &ldquo;{query}&rdquo;{" "}
                <button type="button" className={styles.clear} onClick={onClearQuery}>
                  wis zoekopdracht
                </button>
              </>
            ) : null}
          </p>
        </div>
      </div>
      {measures.length === 0 && (
        <p className={styles.empty}>Geen maatregelen binnen de huidige filters en fase. Verruim de filters of kies een andere fase.</p>
      )}
      <div className={styles.measures}>
        {measures.map((measure) => (
          <MeasureCard
            key={measure.id}
            measure={measure}
            phase={phase}
            selected={selected.has(measure.id)}
            score={scores.get(measure.id) ?? 0}
            onToggle={() => onToggle(measure.id)}
          />
        ))}
      </div>
    </section>
  );
}
