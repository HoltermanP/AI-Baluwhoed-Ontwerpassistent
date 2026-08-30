import styles from "./HowItWorks.module.css";

interface HowItWorksProps {
  phase: string;
  gap: number;
  focusLayer: string;
  selectedCount: number;
  dossierDone: number;
  dossierTotal: number;
}

/**
 * De drie stappen uit de uitleg in lekentaal, gekoppeld aan de werkelijke projectstatus,
 * zodat een nieuwe gebruiker direct ziet waar hij staat en wat de volgende stap is.
 */
export default function HowItWorks({ phase, gap, focusLayer, selectedCount, dossierDone, dossierTotal }: HowItWorksProps) {
  const steps = [
    {
      title: "Vertel iets over je project",
      body: "Fase, gebouwtype, omvang en huidige CO2-prestatie in het linkerpaneel.",
      status: `Fase: ${phase}`,
      href: "#project",
      done: true
    },
    {
      title: "De assistent rekent het voor je uit",
      body: "Afstand tot het Paris Proof-budget en welk gebouwonderdeel de meeste winst kan opleveren.",
      status: gap > 0 ? `${gap} kg CO2/m2 te reduceren · focus ${focusLayer}` : `Binnen budget · focus ${focusLayer}`,
      href: "#winst",
      done: true
    },
    {
      title: "Bouw je eigen advies op",
      body: "Vink relevante maatregelen aan, onderbouw ze in het dossier en exporteer het besluitmemo voor je team.",
      status:
        selectedCount === 0
          ? "Nog geen maatregelen geselecteerd"
          : `${selectedCount} geselecteerd · dossier ${dossierDone}/${dossierTotal} gereed`,
      href: "#measures",
      done: selectedCount > 0
    }
  ];

  return (
    <section className={styles.how} aria-label="Hoe werkt het">
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className={step.done ? styles.done : ""}>
            <a href={step.href}>
              <span className={styles.num}>{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
                <small>{step.status}</small>
              </div>
            </a>
          </li>
        ))}
      </ol>
      <p className={styles.why}>
        <strong>Waarom:</strong>{" "}kennis over duurzaam bouwen zit verspreid in regelingen, pdf&apos;s en de hoofden van een
        paar experts. De assistent bundelt die kennis in één stappenplan, zodat iedereen in het project — ervaren of
        niet — op het juiste moment de juiste keuze maakt en die kan onderbouwen.
      </p>
    </section>
  );
}
