import { sourceLayer } from "@/lib/data";
import styles from "./SourceLayerSection.module.css";

export default function SourceLayerSection() {
  return (
    <section id="sourceLayer" className={styles.sourceLayer}>
      <div className="section-heading">
        <span className="step">D</span>
        <div>
          <h2>Dynamische databronnen</h2>
          <p>Beheerlaag tegen veroudering van product- en leveranciersinformatie.</p>
        </div>
      </div>
      <div className={styles.sourceGrid}>
        {sourceLayer.map(([title, body, freshness]) => (
          <article key={title} className={styles.sourceItem}>
            <strong>{title}</strong>
            <span>{body}</span>
            <small>{freshness}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
