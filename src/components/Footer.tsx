import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <Image src="/bg/logo.png" alt="Logo Blauwhoed" width={188} height={20} className={styles.logo} />
          <p className={styles.tagline}>Waardevol verbindend sinds 1616</p>
        </div>
        <nav className={styles.links} aria-label="Footer">
          <a href="https://www.blauwhoed.nl/werkwijze">Werkwijze</a>
          <a href="https://www.blauwhoed.nl/projecten">Projecten</a>
          <a href="https://www.blauwhoed.nl/kennis">Kennis</a>
          <a href="https://www.blauwhoed.nl/contact">Contact</a>
        </nav>
        <p className={styles.copy}>&copy; {new Date().getFullYear()} Blauwhoed &middot; Ontwerpassistent</p>
      </div>
    </footer>
  );
}
