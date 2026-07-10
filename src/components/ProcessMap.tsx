import { phaseDecisions, Phase } from "@/lib/data";
import { standardHint } from "@/lib/measures";
import styles from "./ProcessMap.module.css";

interface ProcessMapProps {
  phase: Phase;
  standards: string[];
}

export default function ProcessMap({ phase, standards }: ProcessMapProps) {
  const decisions = phaseDecisions[phase] || [];

  return (
    <section id="phaseDecision" className={styles.processMap}>
      <div className="section-heading">
        <span className="step">P</span>
        <div>
          <h2>Fasebesluit</h2>
          <p>Wat moet nu besloten of uitgezet worden?</p>
        </div>
      </div>
      <div className={styles.phaseDecision}>
        {decisions.map(([title, body]) => (
          <article key={title} className={styles.decisionItem}>
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
      </div>
      <div className={styles.standardsList}>
        {standards.map((standard) => (
          <article key={standard} className={styles.standard}>
            <strong>{standard}</strong>
            <span>{standardHint(standard)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
