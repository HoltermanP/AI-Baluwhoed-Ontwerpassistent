import styles from "./Hero.module.css";

interface HeroProps {
  phase: string;
}

export default function Hero({ phase }: HeroProps) {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>Duurzaam ontwerp</p>
          <h1>Ontwerpassistent</h1>
        </div>
        <div className={styles.phase}>
          <span>Huidige fase</span>
          <strong>{phase}</strong>
        </div>
      </div>
    </section>
  );
}
