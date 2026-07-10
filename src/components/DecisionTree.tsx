import { questions } from "@/lib/data";
import styles from "./DecisionTree.module.css";

export default function DecisionTree() {
  return (
    <section className={styles.decisionTree}>
      <div className="section-heading">
        <span className="step">4</span>
        <div>
          <h2>Keuzeboom</h2>
          <p>Vraagvolgorde voor het ontwerpteam.</p>
        </div>
      </div>
      <div className={styles.flow}>
        {questions.map(([title, body], index) => (
          <article key={title} className={styles.flowItem}>
            <strong>
              {index + 1}. {title}
            </strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
