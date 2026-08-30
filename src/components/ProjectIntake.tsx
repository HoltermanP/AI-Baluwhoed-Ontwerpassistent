"use client";

import { useMemo, useRef, useState } from "react";
import { measures as allMeasures } from "@/lib/data";
import { DocumentSignal, ProjectDocument, ProjectProfile, analyseText, formatSize } from "@/lib/project";
import { AppState } from "@/lib/types";
import buttonStyles from "./shared/Button.module.css";
import styles from "./ProjectIntake.module.css";

interface ProjectIntakeProps {
  profile: ProjectProfile;
  state: AppState;
  selected: Set<string>;
  onProfileChange: (patch: Partial<ProjectProfile>) => void;
  onFiles: (files: FileList | File[]) => Promise<void> | void;
  onRemoveDocument: (id: string) => void;
  onApplySignal: (signal: DocumentSignal) => void;
}

export default function ProjectIntake({
  profile,
  state,
  selected,
  onProfileChange,
  onFiles,
  onRemoveDocument,
  onApplySignal
}: ProjectIntakeProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const signals = useMemo(() => {
    const corpus = [profile.description, profile.ambitions, state.contextNotes, ...profile.documents.map((d) => d.text ?? "")].join("\n");
    return analyseText(corpus);
  }, [profile.description, profile.ambitions, profile.documents, state.contextNotes]);

  const isApplied = (signal: DocumentSignal): boolean => {
    const applied = signal.apply ? Object.entries(signal.apply).every(([k, v]) => state[k as keyof AppState] === v) : true;
    const measureApplied = signal.suggestMeasure ? selected.has(signal.suggestMeasure) : true;
    return applied && measureApplied;
  };

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    await onFiles(files);
    setBusy(false);
    if (fileInput.current) fileInput.current.value = "";
  };

  const updateTeam = (index: number, name: string) =>
    onProfileChange({ team: profile.team.map((t, i) => (i === index ? { ...t, name } : t)) });

  const updateDocNote = (doc: ProjectDocument, note: string) =>
    onProfileChange({ documents: profile.documents.map((d) => (d.id === doc.id ? { ...d, note } : d)) });

  return (
    <section id="project" className={styles.intake}>
      <div className="section-heading">
        <span className="step">1</span>
        <div>
          <h2>Vertel iets over je project</h2>
          <p>Projectprofiel, team en documenten. De assistent haalt hier signalen uit en stelt instellingen voor.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.column}>
          <label>
            Projectnaam
            <input value={profile.name} onChange={(e) => onProfileChange({ name: e.target.value })} placeholder="Bijv. Havenkwartier Zaandam" />
          </label>
          <div className={styles.two}>
            <label>
              Locatie
              <input value={profile.location} onChange={(e) => onProfileChange({ location: e.target.value })} placeholder="Plaats en situatie" />
            </label>
            <label>
              Aantal woningen
              <input type="number" min={0} value={profile.homes} onChange={(e) => onProfileChange({ homes: Number(e.target.value) })} />
            </label>
          </div>
          <label>
            Opdrachtgever / samenwerking
            <input value={profile.client} onChange={(e) => onProfileChange({ client: e.target.value })} />
          </label>
          <label>
            Projectomschrijving
            <textarea
              rows={4}
              value={profile.description}
              onChange={(e) => onProfileChange({ description: e.target.value })}
              placeholder="Wat wordt er ontwikkeld, voor wie, in welke context? Bijv. 84 appartementen in 8 woonlagen, tender gemeente, bestaand pand op locatie..."
            />
          </label>
          <label>
            Duurzaamheidsambities
            <textarea
              rows={3}
              value={profile.ambitions}
              onChange={(e) => onProfileChange({ ambitions: e.target.value })}
              placeholder="Bijv. Paris Proof, houthybride, NL Greenlabel A, 90 liter drinkwater p.p.p.d."
            />
          </label>
        </div>

        <div className={styles.column}>
          <fieldset className={styles.team}>
            <legend>Projectteam</legend>
            {profile.team.map((member, index) => (
              <label key={member.role} className={styles.teamRow}>
                <span>{member.role}</span>
                <input value={member.name} onChange={(e) => updateTeam(index, e.target.value)} placeholder="Naam of bureau" />
              </label>
            ))}
          </fieldset>

          <div
            className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <strong>{busy ? "Documenten worden gelezen..." : "Projectdocumenten toevoegen"}</strong>
            <span>
              Sleep plankaarten, PvE, MPG-rapport, opnames of notities hierheen. Tekstbestanden (.txt, .md, .csv) worden
              gelezen op duurzaamheidssignalen; van andere bestanden wordt alleen de naam bewaard.
            </span>
            <button type="button" className={`${buttonStyles.button} ${buttonStyles.dark}`} onClick={() => fileInput.current?.click()}>
              Bestanden kiezen
            </button>
            <input ref={fileInput} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {profile.documents.length > 0 && (
            <ul className={styles.docs}>
              {profile.documents.map((doc) => (
                <li key={doc.id}>
                  <div className={styles.docHead}>
                    <strong>{doc.name}</strong>
                    <button type="button" onClick={() => onRemoveDocument(doc.id)} title="Document verwijderen">
                      ×
                    </button>
                  </div>
                  <small>
                    {formatSize(doc.size)} · toegevoegd {doc.addedAt}
                    {doc.text ? " · gelezen op signalen" : " · alleen metadata"}
                  </small>
                  <input
                    value={doc.note ?? ""}
                    placeholder="Korte notitie: wat staat erin en waarom is het relevant?"
                    onChange={(e) => updateDocNote(doc, e.target.value)}
                    className={styles.docNote}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.signals}>
        <h3>Signalen uit projectinformatie</h3>
        {signals.length === 0 ? (
          <p className={styles.empty}>
            Nog geen signalen herkend. Vul de omschrijving of ambities in, of voeg een tekstdocument toe (bijv. een
            MPG-samenvatting of bouwkundige opname).
          </p>
        ) : (
          <ul>
            {signals.map((signal) => {
              const applied = isApplied(signal);
              const measure = signal.suggestMeasure ? allMeasures.find((m) => m.id === signal.suggestMeasure) : null;
              return (
                <li key={signal.id} className={applied ? styles.applied : ""}>
                  <div>
                    <strong>{signal.label}</strong>
                    <p>
                      {signal.detail}
                      {measure ? ` Maatregel: ${measure.title}.` : ""}
                    </p>
                  </div>
                  <button type="button" disabled={applied} onClick={() => onApplySignal(signal)}>
                    {applied ? "Verwerkt" : "Toepassen"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
