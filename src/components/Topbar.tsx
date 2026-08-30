import buttonStyles from "./shared/Button.module.css";
import styles from "./Topbar.module.css";

interface TopbarProps {
  phase: string;
  selectedCount: number;
  savedAt: string | null;
  onExport: () => void;
  onReset: () => void;
}

export default function Topbar({ phase, selectedCount, savedAt, onExport, onReset }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div>
        <p className="eyebrow">Beslisoverzicht</p>
        <h2>{phase}</h2>
        <p className={styles.status}>
          {selectedCount} maatregel{selectedCount === 1 ? "" : "en"} geselecteerd
          {savedAt ? ` · automatisch opgeslagen ${savedAt}` : " · wordt lokaal opgeslagen"}
        </p>
      </div>
      <div className={styles.actions}>
        <button className={`${buttonStyles.button} ${buttonStyles.dark}`} type="button" title="Project leegmaken" onClick={onReset}>
          Nieuw project
        </button>
        <button className={buttonStyles.button} type="button" title="Exporteer besluitmemo" onClick={onExport}>
          <span aria-hidden="true">v</span>
          <span>Besluitmemo exporteren</span>
        </button>
      </div>
    </header>
  );
}
