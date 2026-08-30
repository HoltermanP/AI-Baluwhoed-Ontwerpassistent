import { approachPillars } from "@/lib/data";
import styles from "./Approach.module.css";

export default function Approach() {
  return (
    <section className={styles.approach}>
      <div>
        <p className="eyebrow">Onze werkwijze</p>
        <h2>Van duurzaamheidsambitie naar ontwerpbeslissing</h2>
        <p>
          De Ontwerpassistent scheidt vaste ontwerpprincipes van actuele brondata en vertaalt ze per projectfase naar
          concrete maatregelen, criteria en besluitvragen voor het ontwikkelteam.
        </p>
      </div>
      <div className={styles.pillarList}>
        {approachPillars.map(([title, body]) => (
          <article key={title} className={styles.pillar}>
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
