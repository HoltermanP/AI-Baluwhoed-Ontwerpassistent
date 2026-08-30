import Image from "next/image";
import styles from "./Header.module.css";

const navItems = [
  { href: "#dashboard", label: "Dashboard", active: true },
  { href: "#traject", label: "Traject", active: false },
  { href: "#winst", label: "Winst", active: false },
  { href: "#reductiepad", label: "Reductiepad", active: false },
  { href: "#measures", label: "Maatregelen", active: false },
  { href: "#varianten", label: "Varianten", active: false },
  { href: "#dossier", label: "Dossier", active: false },
  { href: "#besluiten", label: "Besluiten", active: false }
];

export default function Header() {
  return (
    <header className={styles.platformBar}>
      <div className={styles.platformLeft}>
        <a className={styles.platformBrand} href="#top" aria-label="Blauwhoed Ontwerpassistent">
          <Image src="/bg/logo.png" alt="Logo Blauwhoed" width={188} height={20} priority />
          <span>Ontwerpassistent</span>
        </a>
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
        <div className={styles.lang}>
          <strong>NL</strong>
          <span>EN</span>
        </div>
        <div className={styles.searchPill}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span>Zoek project, maatregel...</span>
        </div>
        <div className={styles.avatar}>PH</div>
      </div>
    </header>
  );
}
