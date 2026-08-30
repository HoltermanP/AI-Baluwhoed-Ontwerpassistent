import { Measure, Phase } from "@/lib/data";
import { detail, isLastChance, lastPhase } from "@/lib/measureDetails";
import { EvidenceStatus, evidenceKey } from "@/lib/project";
import styles from "./EvidenceDossier.module.css";

interface EvidenceDossierProps {
  phase: Phase;
  selectedMeasures: Measure[];
  evidence: Record<string, EvidenceStatus>;
  onSetStatus: (key: string, status: EvidenceStatus) => void;
}

const statusOrder: EvidenceStatus[] = ["todo", "busy", "done"];
const statusLabels: Record<EvidenceStatus, string> = { todo: "Te doen", busy: "In bewerking", done: "Gereed" };

export function dossierProgress(measures: Measure[], evidence: Record<string, EvidenceStatus>): { total: number; done: number } {
  let total = 0;
  let done = 0;
  measures.forEach((m) => {
    detail(m).evidence.forEach((_, i) => {
      total += 1;
      if (evidence[evidenceKey(m.id, i)] === "done") done += 1;
    });
  });
  return { total, done };
}

export default function EvidenceDossier({ phase, selectedMeasures, evidence, onSetStatus }: EvidenceDossierProps) {
  const progress = dossierProgress(selectedMeasures, evidence);
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  const ordered = [...selectedMeasures].sort((a, b) => {
    const aUrgent = isLastChance(a, phase) ? 0 : 1;
    const bUrgent = isLastChance(b, phase) ? 0 : 1;
    return aUrgent - bUrgent;
  });

  return (
    <section id="dossier" className={styles.dossier}>
      <div className="section-heading">
        <span className="step">B</span>
        <div>
          <h2>Bewijsdossier</h2>
          <p>Welke onderbouwing is nodig voor de geselecteerde maatregelen en hoe ver is die?</p>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <span>
          {progress.done} van {progress.total} bewijsstukken gereed ({pct}%)
        </span>
      </div>

      {ordered.length === 0 ? (
        <p className={styles.empty}>Selecteer maatregelen om het bewijsdossier op te bouwen.</p>
      ) : (
        <div className={styles.grid}>
          {ordered.map((m) => {
            const items = detail(m).evidence;
            const doneCount = items.filter((_, i) => evidence[evidenceKey(m.id, i)] === "done").length;
            const urgent = isLastChance(m, phase);
            return (
              <article key={m.id} className={`${styles.card} ${urgent ? styles.urgent : ""}`}>
                <header>
                  <div>
                    <h3>{m.title}</h3>
                    <span>
                      Uiterlijk gereed in <b>{lastPhase(m)}</b>
                      {urgent ? " · nu afronden" : ""}
                    </span>
                  </div>
                  <b className={styles.counter}>
                    {doneCount}/{items.length}
                  </b>
                </header>
                <ul>
                  {items.map((item, i) => {
                    const key = evidenceKey(m.id, i);
                    const status = evidence[key] ?? "todo";
                    const next = statusOrder[(statusOrder.indexOf(status) + 1) % statusOrder.length];
                    return (
                      <li key={key} className={styles[status]}>
                        <button type="button" onClick={() => onSetStatus(key, next)} title={`Status wijzigen naar ${statusLabels[next]}`}>
                          {statusLabels[status]}
                        </button>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
