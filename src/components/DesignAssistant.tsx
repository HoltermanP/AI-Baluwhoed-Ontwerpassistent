"use client";

import { useEffect, useMemo, useState } from "react";
import { budgets, measures as allMeasures, Phase } from "@/lib/data";
import { downloadAdvice, buildAdviceText } from "@/lib/exportAdvice";
import { FilterState, getFilteredMeasures, getFocus, relevantStandards, scoreTotal } from "@/lib/measures";
import {
  Decision,
  EvidenceStatus,
  ProjectData,
  Variant,
  clearProject,
  defaultVariants,
  loadProject,
  useAutosave
} from "@/lib/project";
import { AppState, UpdateField } from "@/lib/types";
import Approach from "./Approach";
import DecisionLog from "./DecisionLog";
import DecisionTree from "./DecisionTree";
import EvidenceDossier, { dossierProgress } from "./EvidenceDossier";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import ImpactByLayer from "./ImpactByLayer";
import MeasuresSection from "./MeasuresSection";
import Metrics from "./Metrics";
import PhaseTimeline from "./PhaseTimeline";
import Principles from "./Principles";
import ProcessMap from "./ProcessMap";
import ReductionPath from "./ReductionPath";
import shellStyles from "./Shell.module.css";
import Sidebar from "./Sidebar";
import SourceLayerSection from "./SourceLayerSection";
import Topbar from "./Topbar";
import VariantCompare from "./VariantCompare";

const initialState: AppState = {
  phase: "Haalbaarheid",
  projectType: "mgw",
  co2: 184,
  bvo: 5200,
  dataQuality: "mpg",
  impactPart: "Structure",
  existingStructure: false,
  tenderMode: true,
  highRise: false,
  waterReady: false,
  contextNotes: "",
  theme: "Alle thema's",
  layer: "Alle lagen",
  status: "all"
};

export default function DesignAssistant() {
  const [state, setState] = useState<AppState>(initialState);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [evidence, setEvidence] = useState<Record<string, EvidenceStatus>>({});
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [variants, setVariants] = useState<Variant[]>(defaultVariants);
  const [hydrated, setHydrated] = useState(false);

  // Eerder opgeslagen project terughalen (alleen in de browser).
  useEffect(() => {
    // Na de eerste render (buiten de effect-body) zodat SSR en client dezelfde eerste markup delen.
    const timer = window.setTimeout(() => {
      const saved = loadProject();
      if (saved) {
        if (saved.state) setState({ ...initialState, ...saved.state });
        if (saved.selected) setSelected(new Set(saved.selected));
        if (saved.evidence) setEvidence(saved.evidence);
        if (saved.decisions) setDecisions(saved.decisions);
        if (saved.variants?.length) setVariants(saved.variants);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const projectData: ProjectData = useMemo(
    () => ({ state, selected: [...selected], evidence, decisions, variants }),
    [state, selected, evidence, decisions, variants]
  );
  const savedAt = useAutosave(projectData, hydrated);

  const updateField: UpdateField = (key, value) => {
    setState((previous) => ({ ...previous, [key]: value }));
  };

  const toggleMeasure = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setEvidenceStatus = (key: string, status: EvidenceStatus) =>
    setEvidence((previous) => ({ ...previous, [key]: status }));

  const resetProject = () => {
    if (!window.confirm("Project leegmaken? Selecties, dossier, besluiten en varianten worden gewist.")) return;
    clearProject();
    setState(initialState);
    setSelected(new Set());
    setEvidence({});
    setDecisions([]);
    setVariants(defaultVariants);
  };

  const filters: FilterState = {
    phase: state.phase,
    theme: state.theme,
    layer: state.layer,
    status: state.status,
    tenderMode: state.tenderMode,
    impactPart: state.impactPart,
    existingStructure: state.existingStructure,
    highRise: state.highRise,
    waterReady: state.waterReady
  };

  const filteredMeasures = getFilteredMeasures(allMeasures, filters);
  const selectedMeasures = allMeasures.filter((measure) => selected.has(measure.id));
  const decidedIds = new Set(decisions.map((d) => d.measureId));

  const scores = new Map<string, number>();
  filteredMeasures.forEach((measure) => scores.set(measure.id, scoreTotal(measure, filters)));

  const focus = getFocus(filteredMeasures, filters);
  const standards = relevantStandards(state.theme);

  const project = budgets[state.projectType];
  const gap = Math.round(state.co2 - project.value);
  const totalTonnes = Math.max(0, Math.round((gap * state.bvo) / 1000));

  const focusLabel = {
    mpg: "MPG als basis voor besluit",
    benchmark: "benchmark eerst aanscherpen",
    unknown: "start met CO2-indicatie"
  }[state.dataQuality];

  const dossier = dossierProgress(selectedMeasures, evidence);

  const handleExport = () => {
    const text = buildAdviceText(state, selectedMeasures, filteredMeasures, { evidence, decisions, variants });
    downloadAdvice(text);
  };

  return (
    <>
      <Header />
      <Hero phase={state.phase} />
      <main className={shellStyles.shell}>
        <Sidebar state={state} onChange={updateField} />
        <section id="dashboard" className={shellStyles.workspace}>
          <Topbar
            phase={state.phase}
            selectedCount={selected.size}
            savedAt={savedAt}
            onExport={handleExport}
            onReset={resetProject}
          />
          <HowItWorks
            phase={state.phase}
            gap={gap}
            focusLayer={focus.layer}
            selectedCount={selected.size}
            dossierDone={dossier.done}
            dossierTotal={dossier.total}
          />
          <Metrics
            budgetValue={project.value}
            gap={gap}
            totalTonnes={totalTonnes}
            focusLayer={focus.layer}
            focusLabel={focusLabel}
          />
          <PhaseTimeline
            phase={state.phase}
            measures={allMeasures}
            selected={selected}
            decidedIds={decidedIds}
            onSelectPhase={(phase: Phase) => updateField("phase", phase)}
          />
          <ImpactByLayer
            phase={state.phase}
            measures={allMeasures}
            selected={selected}
            activeLayer={state.layer}
            teamGuess={state.impactPart}
            onSelectLayer={(layer) => updateField("layer", layer)}
          />
          <ReductionPath
            co2={state.co2}
            budget={project.value}
            bvo={state.bvo}
            selectedMeasures={selectedMeasures}
            candidates={filteredMeasures}
            onToggle={toggleMeasure}
          />
          <ProcessMap phase={state.phase} standards={standards} />
          <MeasuresSection
            measures={filteredMeasures}
            phase={state.phase}
            selected={selected}
            scores={scores}
            onToggle={toggleMeasure}
          />
          <VariantCompare
            variants={variants}
            budget={project.value}
            bvo={state.bvo}
            onChange={setVariants}
            onUseAsCurrent={(co2) => updateField("co2", co2)}
          />
          <EvidenceDossier
            phase={state.phase}
            selectedMeasures={selectedMeasures}
            evidence={evidence}
            onSetStatus={setEvidenceStatus}
          />
          <DecisionLog phase={state.phase} measures={allMeasures} decisions={decisions} onChange={setDecisions} />
          <Approach />
          <Principles />
          <DecisionTree />
          <SourceLayerSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
