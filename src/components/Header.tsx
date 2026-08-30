import Image from "next/image";
import styles from "./Header.module.css";

const navItems = [
  { href: "#project", label: "Project" },
  { href: "#traject", label: "Traject" },
  { href: "#winst", label: "Winst" },
  { href: "#reductiepad", label: "Reductiepad" },
  { href: "#measures", label: "Maatregelen" },
  { href: "#varianten", label: "Varianten" },
  { href: "#dossier", label: "Dossier" },
  { href: "#besluiten", label: "Besluiten" }
];

interface HeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  initials: string;
}

export default function Header({ query, onQueryChange, initials }: HeaderProps) {
  return (
    <header className={styles.platformBar}>
      <div className={styles.platformLeft}>
        <a className={styles.platformBrand} href="#top" aria-label="Blauwhoed Ontwerpassistent">
          <Image src="/bg/logo.png" alt="Logo Blauwhoed" width={188} height={20} priority />
          <span>Ontwerpassistent</span>
        </a>
        <nav className={styles.platformNav} aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <a key={item.href} className={styles.navItem} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.platformActions}>
        <label className={styles.searchPill}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Zoek maatregel, thema, bron..."
            aria-label="Zoek in maatregelen"
          />
        </label>
        <div className={styles.avatar} title="Ingelogd als ontwikkelmanager">
          {initials}
        </div>
      </div>
    </header>
  );
}
