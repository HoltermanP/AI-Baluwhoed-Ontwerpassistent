import { ProjectData } from "@/lib/project";
import buttonStyles from "./shared/Button.module.css";
import styles from "./Topbar.module.css";

interface TopbarProps {
  phase: string;
  project: ProjectData;
  projects: ProjectData[];
  selectedCount: number;
  savedAt: string | null;
  onSwitch: (id: string) => void;
  onNew: () => void;
  onDelete: () => void;
  onRestoreDemo: () => void;
  onExport: () => void;
}

export default function Topbar({
  phase,
  project,
  projects,
  selectedCount,
  savedAt,
  onSwitch,
  onNew,
  onDelete,
  onRestoreDemo,
  onExport
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div>
        <p className="eyebrow">Beslisoverzicht · {phase}</p>
        <h2>{project.profile.name || "Naamloos project"}</h2>
        <p className={styles.status}>
          {project.profile.location ? `${project.profile.location} · ` : ""}
          {project.profile.homes ? `${project.profile.homes} woningen · ` : ""}
          {selectedCount} maatregel{selectedCount === 1 ? "" : "en"} geselecteerd
          {savedAt ? ` · automatisch opgeslagen ${savedAt}` : " · wordt lokaal opgeslagen"}
        </p>
      </div>
      <div className={styles.actions}>
        <label className={styles.switcher}>
          <span>Project</span>
          <select value={project.id} onChange={(e) => onSwitch(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.profile.name || "Naamloos project"} · {p.state.phase}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.buttons}>
          <button className={`${buttonStyles.button} ${buttonStyles.dark}`} type="button" onClick={onNew}>
            + Nieuw project
          </button>
          <button className={`${buttonStyles.button} ${styles.subtle}`} type="button" onClick={onDelete} title="Dit project verwijderen">
            Verwijderen
          </button>
          <button className={`${buttonStyles.button} ${styles.subtle}`} type="button" onClick={onRestoreDemo} title="Demoprojecten opnieuw laden">
            Demo herstellen
          </button>
          <button className={buttonStyles.button} type="button" title="Exporteer besluitmemo" onClick={onExport}>
            <span aria-hidden="true">v</span>
            <span>Besluitmemo exporteren</span>
          </button>
        </div>
      </div>
    </header>
  );
}
