import styles from "./Metrics.module.css";

interface MetricsProps {
  budgetValue: number;
  gap: number;
  totalTonnes: number;
  focusLayer: string;
  focusLabel: string;
}

export default function Metrics({ budgetValue, gap, totalTonnes, focusLayer, focusLabel }: MetricsProps) {
  const gapLabel = gap > 0 ? "boven richtwaarde" : "onder richtwaarde";
  const gapColor = gap > 0 ? "var(--red)" : "var(--green)";

  return (
    <section className={styles.dashboard}>
      <article className={styles.metric}>
        <span className={styles.metricLabel}>Paris Proof budget 2026</span>
        <strong>{budgetValue}</strong>
        <span>kg CO2/m2 BVO</span>
      </article>
      <article className={styles.metric}>
        <span className={styles.metricLabel}>Afstand tot budget</span>
        <strong style={{ color: gapColor }}>{gap > 0 ? `+${gap}` : `${gap}`}</strong>
        <span>{gapLabel}</span>
      </article>
      <article className={styles.metric}>
        <span className={styles.metricLabel}>Aanbevolen focus</span>
        <strong>{focusLayer}</strong>
        <span>{focusLabel}</span>
      </article>
      <article className={styles.metric}>
        <span className={styles.metricLabel}>Benodigde reductie totaal</span>
        <strong>{totalTonnes}t</strong>
        <span>CO2-eq indicatief</span>
      </article>
    </section>
  );
}
