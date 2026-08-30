import { phases, themes, layers, Layer, Phase, ProjectTypeKey, DataQuality } from "@/lib/data";
import { AppState, UpdateField } from "@/lib/types";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  state: AppState;
  onChange: UpdateField;
}

export default function Sidebar({ state, onChange }: SidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Projectcontext">
      <section className={styles.panel}>
        <div className="section-heading">
          <span className="step">1</span>
          <div>
            <h2>Projectcontext</h2>
            <p>Welke keuzes moeten nu op tafel?</p>
          </div>
        </div>

        <label>
          Ontwikkelfase
          <select value={state.phase} onChange={(event) => onChange("phase", event.target.value as Phase)}>
            {phases.map((phase) => (
              <option key={phase} value={phase}>
                {phase}
              </option>
            ))}
          </select>
        </label>

        <label>
          Projecttype
          <select
            value={state.projectType}
            onChange={(event) => onChange("projectType", event.target.value as ProjectTypeKey)}
          >
            <option value="mgw">Meergezinswoning</option>
            <option value="egw">Eengezinswoning</option>
            <option value="renovatie">Renovatie/transformatie</option>
          </select>
        </label>

        <label>
          Huidige CO2-prestatie
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              min={0}
              value={state.co2}
              onChange={(event) => onChange("co2", Number(event.target.value))}
            />
            <span>kg CO2/m2 BVO</span>
          </div>
        </label>

        <label>
          BVO
          <div className={styles.inputWithUnit}>
            <input
              type="number"
              min={0}
              value={state.bvo}
              onChange={(event) => onChange("bvo", Number(event.target.value))}
            />
            <span>m2</span>
          </div>
        </label>

        <label>
          Onderbouwing CO2-score
          <select
            value={state.dataQuality}
            onChange={(event) => onChange("dataQuality", event.target.value as DataQuality)}
          >
            <option value="mpg">MPG-berekening beschikbaar</option>
            <option value="benchmark">Benchmark of vergelijkbaar project</option>
            <option value="unknown">Nog geen betrouwbare score</option>
          </select>
        </label>

        <label>
          Grootste impact volgens projectteam
          <select value={state.impactPart} onChange={(event) => onChange("impactPart", event.target.value as Layer)}>
            <option value="Structure">Constructie en vloeren</option>
            <option value="Services">Installaties en PV</option>
            <option value="Skin">Gevel, dak en glas</option>
            <option value="Site">Gebied en openbare ruimte</option>
            <option value="Space plan">Afbouw en indeling</option>
          </select>
        </label>

        <fieldset>
          <legend>Situationele randvoorwaarden</legend>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={state.existingStructure}
              onChange={(event) => onChange("existingStructure", event.target.checked)}
            />
            Bestaande constructie aanwezig
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={state.tenderMode}
              onChange={(event) => onChange("tenderMode", event.target.checked)}
            />
            Tender of kansrijke acquisitie
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={state.highRise}
              onChange={(event) => onChange("highRise", event.target.checked)}
            />
            Gebouw hoger dan 4 lagen
          </label>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={state.waterReady}
              onChange={(event) => onChange("waterReady", event.target.checked)}
            />
            Waterbespaarklaar relevant
          </label>
        </fieldset>
      </section>

      <section className={styles.panel}>
        <div className="section-heading compact">
          <span className="step">AI</span>
          <div>
            <h2>Projectdocumenten</h2>
            <p>Context voor plankaarten, PvE of MPG.</p>
          </div>
        </div>
        <label>
          Contextnotitie
          <textarea
            rows={5}
            placeholder="Bijv. hoogbouw, houten gevel gewenst, MPG uit SO ontbreekt, waterberging op dak beperkt..."
            value={state.contextNotes}
            onChange={(event) => onChange("contextNotes", event.target.value)}
          />
        </label>
        <a className={styles.dropzone} href="#project">
          <strong>Documenten toevoegen</strong>
          <span>Upload plankaarten, PvE of MPG-rapport bij het projectprofiel; de assistent leest tekstbestanden op signalen.</span>
        </a>
      </section>

      <section className={styles.panel}>
        <div className="section-heading compact">
          <span className="step">2</span>
          <div>
            <h2>Filters</h2>
            <p>Van algemeen naar specifiek.</p>
          </div>
        </div>
        <div className={styles.filterGrid}>
          <label>
            Thema
            <select value={state.theme} onChange={(event) => onChange("theme", event.target.value)}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>
          <label>
            6S-laag
            <select value={state.layer} onChange={(event) => onChange("layer", event.target.value)}>
              {layers.map((layer) => (
                <option key={layer} value={layer}>
                  {layer}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={state.status} onChange={(event) => onChange("status", event.target.value)}>
              <option value="all">Alle maatregelen</option>
              <option value="verplicht">Verplicht indien van toepassing</option>
              <option value="sterk">Sterk aanbevolen</option>
              <option value="suggestie">Suggestie</option>
            </select>
          </label>
        </div>
      </section>
    </aside>
  );
}
