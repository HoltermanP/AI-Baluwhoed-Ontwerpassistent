"use client";

import { useEffect, useState } from "react";
import { budgets, measures as allMeasures, Phase } from "@/lib/data";
import { buildDemoWorkspace } from "@/lib/demoProjects";
import { downloadAdvice, buildAdviceText } from "@/lib/exportAdvice";
import { FilterState, getFilteredMeasures, getFocus, relevantStandards, scoreTotal } from "@/lib/measures";
import {
  DocumentSignal,
  EvidenceStatus,
  ProjectData,
  ProjectProfile,
  Workspace,
  clearWorkspace,
  createProject,
  loadWorkspace,
  readDocument,
  useAutosave
} from "@/lib/project";
import { UpdateField } from "@/lib/types";
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
import ProjectIntake from "./ProjectIntake";
import ReductionPath from "./ReductionPath";
import shellStyles from "./Shell.module.css";
import Sidebar from "./Sidebar";
import SourceLayerSection from "./SourceLayerSection";
import Topbar from "./Topbar";
import VariantCompare from "./VariantCompare";

export default function DesignAssistant() {
  const [workspace, setWorkspace] = useState<Workspace>(() => buildDemoWorkspace());
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");

  // Eerder opgeslagen werkruimte terughalen (alleen in de browser, na de eerste render).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = loadWorkspace();
      if (saved) setWorkspace(saved);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const savedAt = useAutosave(workspace, hydrated);

  const project = workspace.projects.find((p) => p.id === workspace.activeId) ?? workspace.projects[0];
  const { state, profile } = project;
  const selected = new Set(project.selected);

  /** Past het actieve project aan en zet de wijzigingsdatum. */
  const patchProject = (updater: (current: ProjectData) => Partial<ProjectData>) =>
    setWorkspace((ws) => ({
      ...ws,
      projects: ws.projects.map((p) => (p.id === ws.activeId ? { ...p, ...updater(p), updatedAt: new Date().toISOString() } : p))
    }));

  const updateField: UpdateField = (key, value) => patchProject((p) => ({ state: { ...p.state, [key]: value } }));

  const updateProfile = (patch: Partial<ProjectProfile>) => patchProject((p) => ({ profile: { ...p.profile, ...patch } }));

  const toggleMeasure = (id: string) =>
    patchProject((p) => ({
      selected: p.selected.includes(id) ? p.selected.filter((s) => s !== id) : [...p.selected, id]
    }));

  const setEvidenceStatus = (key: string, status: EvidenceStatus) =>
    patchProject((p) => ({ evidence: { ...p.evidence, [key]: status } }));

  const addFiles = async (files: FileList | File[]) => {
    const docs = await Promise.all(Array.from(files).map(readDocument));
    patchProject((p) => ({ profile: { ...p.profile, documents: [...p.profile.documents, ...docs] } }));
  };

  const removeDocument = (id: string) =>
    patchProject((p) => ({ profile: { ...p.profile, documents: p.profile.documents.filter((d) => d.id !== id) } }));

  const applySignal = (signal: DocumentSignal) =>
    patchProject((p) => ({
      state: { ...p.state, ...(signal.apply ?? {}) },
      selected:
        signal.suggestMeasure && !p.selected.includes(signal.suggestMeasure)
          ? [...p.selected, signal.suggestMeasure]
          : p.selected
    }));

  const switchProject = (id: string) => setWorkspace((ws) => ({ ...ws, activeId: id }));

  const newProject = () => {
    const fresh = createProject();
    setWorkspace((ws) => ({ activeId: fresh.id, projects: [...ws.projects, fresh] }));
    window.setTimeout(() => document.getElementById("project")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const deleteProject = () => {
    if (!window.confirm(`Project "${profile.name}" verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    setWorkspace((ws) => {
      const rest = ws.projects.filter((p) => p.id !== ws.activeId);
      if (rest.length === 0) {
        const fresh = createProject();
        return { activeId: fresh.id, projects: [fresh] };
      }
      return { activeId: rest[0].id, projects: rest };
    });
  };

  const restoreDemo = () => {
    if (!window.confirm("Demoprojecten herstellen? Je eigen projecten en wijzigingen worden overschreven.")) return;
    clearWorkspace();
    setWorkspace(buildDemoWorkspace());
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
    waterReady: state.waterReady,
    query
  };

  const filteredMeasures = getFilteredMeasures(allMeasures, filters);
  const selectedMeasures = allMeasures.filter((measure) => selected.has(measure.id));
  const decidedIds = new Set(project.decisions.map((d) => d.measureId));

  const scores = new Map<string, number>();
  filteredMeasures.forEach((measure) => scores.set(measure.id, scoreTotal(measure, filters)));

  const focus = getFocus(filteredMeasures, filters);
  const standards = relevantStandards(state.theme);

  const budget = budgets[state.projectType];
  const gap = Math.round(state.co2 - budget.value);
  const totalTonnes = Math.max(0, Math.round((gap * state.bvo) / 1000));

  const focusLabel = {
    mpg: "MPG als basis voor besluit",
    benchmark: "benchmark eerst aanscherpen",
    unknown: "start met CO2-indicatie"
  }[state.dataQuality];

  const dossier = dossierProgress(selectedMeasures, project.evidence);

  const manager = profile.team.find((t) => t.role === "Ontwikkelmanager")?.name ?? "";
  const initials =
    manager
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "PH";

  const handleExport = () => {
    const text = buildAdviceText(state, selectedMeasures, filteredMeasures, {
      evidence: project.evidence,
      decisions: project.decisions,
      variants: project.variants,
      profile
    });
    downloadAdvice(text, profile.name);
  };

  return (
    <>
      <Header query={query} onQueryChange={setQuery} initials={initials} />
      <Hero phase={state.phase} />
      <main className={shellStyles.shell}>
        <Sidebar state={state} onChange={updateField} />
        <section id="dashboard" className={shellStyles.workspace}>
          <Topbar
            phase={state.phase}
            project={project}
            projects={workspace.projects}
            selectedCount={selected.size}
            savedAt={savedAt}
            onSwitch={switchProject}
            onNew={newProject}
            onDelete={deleteProject}
            onRestoreDemo={restoreDemo}
            onExport={handleExport}
          />
          <HowItWorks
            phase={state.phase}
            gap={gap}
            focusLayer={focus.layer}
            selectedCount={selected.size}
            dossierDone={dossier.done}
            dossierTotal={dossier.total}
          />
          <ProjectIntake
            profile={profile}
            state={state}
            selected={selected}
            onProfileChange={updateProfile}
            onFiles={addFiles}
            onRemoveDocument={removeDocument}
            onApplySignal={applySignal}
          />
          <Metrics
            budgetValue={budget.value}
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
            budget={budget.value}
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
            query={query}
            onClearQuery={() => setQuery("")}
          />
          <VariantCompare
            variants={project.variants}
            budget={budget.value}
            bvo={state.bvo}
            onChange={(variants) => patchProject(() => ({ variants }))}
            onUseAsCurrent={(co2) => updateField("co2", co2)}
          />
          <EvidenceDossier
            phase={state.phase}
            selectedMeasures={selectedMeasures}
            evidence={project.evidence}
            onSetStatus={setEvidenceStatus}
          />
          <DecisionLog
            phase={state.phase}
            measures={allMeasures}
            decisions={project.decisions}
            onChange={(decisions) => patchProject(() => ({ decisions }))}
          />
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
