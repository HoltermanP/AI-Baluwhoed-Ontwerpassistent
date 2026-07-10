import buttonStyles from "./shared/Button.module.css";
import styles from "./Topbar.module.css";

interface TopbarProps {
  phase: string;
  onExport: () => void;
}

export default function Topbar({ phase, onExport }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div>
        <p className="eyebrow">Beslisoverzicht</p>
        <h2>{phase}</h2>
      </div>
      <button
        className={buttonStyles.button}
        type="button"
        title="Exporteer advies"
        onClick={onExport}
      >
        <span aria-hidden="true">v</span>
        <span>Advies exporteren</span>
      </button>
    </header>
  );
}
