import { Measure, Phase } from "@/lib/data";
import { detail, isLastChance, lastPhase } from "@/lib/measureDetails";
import {
  capitalize,
  databaseInstruction,
  evidenceNeed,
  freshnessRisk,
  nextAction,
  statusLabel
} from "@/lib/measures";
import buttonStyles from "./shared/Button.module.css";
import styles from "./MeasureCard.module.css";

interface MeasureCardProps {
  measure: Measure;
  phase: Phase;
  selected: boolean;
  score: number;
  onToggle: () => void;
}

export default function MeasureCard({ measure, phase, selected, score, onToggle }: MeasureCardProps) {
  const [low, high] = detail(measure).reduction;
  const lastChance = isLastChance(measure, phase);
  const meta: [string, string][] = [
    ["CO2-effect", high > 0 ? `${low}–${high} kg/m2 BVO` : "geen direct CO2-effect"],
    ["Uiterlijk besluiten", lastPhase(measure)],
    ["Thema", measure.theme],
    ["6S", measure.layer],
    ["Fases", measure.phases.join(", ")],
    ["Bron", measure.source],
    ["Prioriteit", `${Math.round(score)} punten`],
    ["Actualiteit", freshnessRisk(measure)]
  ];

  const actions = [nextAction(phase), evidenceNeed(measure), databaseInstruction(measure)];

  return (
    <article className={`${styles.measureCard} ${selected ? styles.selected : ""}`}>
      <div className={styles.measureTop}>
        <div>
          <span className={`${styles.badge} ${styles[measure.status]}`}>{statusLabel(measure.status)}</span>
          {lastChance && <span className={`${styles.badge} ${styles.lastChance}`}>Laatste kans</span>}
          <h3>{measure.title}</h3>
        </div>
        <button
          className={`${buttonStyles.button} ${styles.selectButton} ${
            selected ? buttonStyles.selected : buttonStyles.dark
          }`}
          type="button"
          onClick={onToggle}
        >
          {selected ? "Geselecteerd" : "Selecteer"}
        </button>
      </div>
      <p className={styles.measureDescription}>{measure.description}</p>
      <dl className={styles.measureMeta}>
        {meta.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <ul className={styles.measureActions}>
        {actions.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <div className={styles.scoreRow}>
        {Object.entries(measure.scores).map(([name, value]) => (
          <div key={name} className={styles.score}>
            <span>
              {capitalize(name)} {value}/5
            </span>
            <meter min={0} max={5} value={value}></meter>
          </div>
        ))}
      </div>
    </article>
  );
}
