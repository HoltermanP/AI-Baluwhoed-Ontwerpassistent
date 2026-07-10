import { principles } from "@/lib/data";
import styles from "./Principles.module.css";

export default function Principles() {
  return (
    <section className={styles.principles}>
      <div className="section-heading">
        <span className="step">3</span>
        <div>
          <h2>Ontwerpprincipes</h2>
          <p>Vast fundament voor projectkeuzes.</p>
        </div>
      </div>
      <div className={styles.principleList}>
        {principles.map((principle, index) => (
          <article key={principle.title} className={styles.principle}>
            <span>Principe {index + 1}</span>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
