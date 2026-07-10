import styles from "./Header.module.css";

const navItems = [
  { href: "#dashboard", label: "Dashboard", active: true },
  { href: "#phaseDecision", label: "Fasebesluit", active: false },
  { href: "#measures", label: "Maatregelen", active: false },
  { href: "#sourceLayer", label: "Databronnen", active: false }
];

export default function Header() {
  return (
    <header className={styles.platformBar}>
      <div className={styles.platformLeft}>
        <div className={styles.platformBrand}>
          <div className={styles.platformMark} aria-hidden="true">
            B
          </div>
          <strong>Blauwhoed</strong>
          <span>Ontwerpassistent</span>
        </div>
        <nav className={styles.platformNav} aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={`${styles.navItem} ${item.active ? styles.navOn : ""}`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.platformActions}>
        <div className={styles.searchPill}>Zoek project, maatregel...</div>
        <div className={styles.avatar}>PH</div>
      </div>
    </header>
  );
}
