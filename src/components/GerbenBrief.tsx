import { gerbenNeeds } from "@/lib/data";
import styles from "./GerbenBrief.module.css";

export default function GerbenBrief() {
  return (
    <section className={styles.gerbenBrief}>
      <div>
        <p className="eyebrow">Vraag van Gerben vertaald</p>
        <h2>Van richtlijn naar ontwerpbeslis-tool</h2>
        <p>
          De assistent voorkomt een verouderende productcatalogus door vaste principes te scheiden van actuele
          brondata, en voorkomt open deuren door per fase concrete maatregelen, criteria en besluitvragen te tonen.
        </p>
      </div>
      <div className={styles.needList}>
        {gerbenNeeds.map(([title, body]) => (
          <article key={title} className={styles.need}>
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
