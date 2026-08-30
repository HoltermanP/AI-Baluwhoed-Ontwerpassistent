import { Layer, Measure, Phase } from "@/lib/data";
import { detail, reductionMid } from "@/lib/measureDetails";
import styles from "./ImpactByLayer.module.css";

interface ImpactByLayerProps {
  phase: Phase;
  measures: Measure[];
  selected: Set<string>;
  activeLayer: string;
  teamGuess: Layer;
  onSelectLayer: (layer: string) => void;
}

const layerLabels: Record<Layer, string> = {
  Site: "Gebied en openbare ruimte",
  Structure: "Constructie en fundering",
  Skin: "Gevel, dak en glas",
  Services: "Installaties en PV",
  "Space plan": "Afbouw en indeling",
  Stuff: "Losse producten"
};

const layerOrder: Layer[] = ["Structure", "Skin", "Services", "Space plan", "Site", "Stuff"];

export default function ImpactByLayer({ phase, measures, selected, activeLayer, teamGuess, onSelectLayer }: ImpactByLayerProps) {
  const rows = layerOrder.map((layer) => {
    const inLayer = measures.filter((m) => m.layer === layer && m.phases.includes(phase));
    const potential = inLayer.reduce((sum, m) => sum + reductionMid(m), 0);
    const chosen = inLayer.filter((m) => selected.has(m.id)).reduce((sum, m) => sum + reductionMid(m), 0);
    const maxSingle = inLayer.reduce((max, m) => Math.max(max, detail(m).reduction[1]), 0);
    return { layer, inLayer, potential, chosen, maxSingle };
  });
  const scale = Math.max(1, ...rows.map((r) => r.potential));
  const top = [...rows].sort((a, b) => b.potential - a.potential)[0];

  return (
    <section id="winst" className={styles.impact}>
      <div className="section-heading">
        <span className="step">W</span>
        <div>
          <h2>Waar zit de meeste winst?</h2>
          <p>
            Indicatief reductiepotentieel per gebouwonderdeel in fase {phase}. Klik op een onderdeel om de maatregelen te
            filteren.
          </p>
        </div>
      </div>

      <ul className={styles.rows}>
        {rows.map((row) => {
          const isActive = activeLayer === row.layer;
          const isTop = top?.layer === row.layer && row.potential > 0;
          return (
            <li key={row.layer} className={`${isActive ? styles.active : ""}`}>
              <button
                type="button"
                disabled={row.inLayer.length === 0}
                onClick={() => onSelectLayer(isActive ? "Alle lagen" : row.layer)}
              >
                <div className={styles.label}>
                  <strong>{layerLabels[row.layer]}</strong>
                  <span>
                    {row.inLayer.length} maatregel{row.inLayer.length === 1 ? "" : "en"} in deze fase
                    {isTop ? " · grootste potentieel" : ""}
                    {teamGuess === row.layer ? " · inschatting projectteam" : ""}
                  </span>
                </div>
                <div className={styles.bar}>
                  <i className={styles.potential} style={{ width: `${(row.potential / scale) * 100}%` }} />
                  <i className={styles.chosen} style={{ width: `${(row.chosen / scale) * 100}%` }} />
                </div>
                <b>
                  {row.inLayer.length === 0
                    ? "niet in deze fase"
                    : row.potential > 0
                      ? `~${Math.round(row.potential)} kg/m2`
                      : "geen direct CO2-effect"}
                </b>
              </button>
            </li>
          );
        })}
      </ul>

      {top && top.layer !== teamGuess && top.potential > 0 && (
        <p className={styles.hint}>
          Het projectteam schat <strong>{layerLabels[teamGuess]}</strong> in als grootste impact, maar in deze fase zit het
          grootste indicatieve reductiepotentieel in <strong>{layerLabels[top.layer]}</strong>. Check of de MPG-uitsplitsing
          dit bevestigt.
        </p>
      )}
      <p className={styles.legend}>
        <i className={styles.potential} /> potentieel van alle maatregelen in deze fase &nbsp;
        <i className={styles.chosen} /> al geselecteerd
      </p>
    </section>
  );
}
