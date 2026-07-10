"use client";

import { useState } from "react";
import { budgets, measures as allMeasures } from "@/lib/data";
import { downloadAdvice, buildAdviceText } from "@/lib/exportAdvice";
import { FilterState, getFilteredMeasures, getFocus, scoreTotal } from "@/lib/measures";
import { relevantStandards } from "@/lib/measures";
import { AppState, UpdateField } from "@/lib/types";
import DecisionTree from "./DecisionTree";
import GerbenBrief from "./GerbenBrief";
import Header from "./Header";
import MeasuresSection from "./MeasuresSection";
import Metrics from "./Metrics";
import Principles from "./Principles";
import ProcessMap from "./ProcessMap";
import shellStyles from "./Shell.module.css";
import Sidebar from "./Sidebar";
import SourceLayerSection from "./SourceLayerSection";
import Topbar from "./Topbar";

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

  const handleExport = () => {
    const chosen = allMeasures.filter((measure) => selected.has(measure.id));
    const text = buildAdviceText(state, chosen, filteredMeasures);
    downloadAdvice(text);
  };

  return (
    <>
      <Header />
      <main className={shellStyles.shell}>
        <Sidebar state={state} onChange={updateField} />
        <section id="dashboard" className={shellStyles.workspace}>
          <Topbar phase={state.phase} onExport={handleExport} />
          <Metrics
            budgetValue={project.value}
            gap={gap}
            totalTonnes={totalTonnes}
            focusLayer={focus.layer}
            focusLabel={focusLabel}
          />
          <GerbenBrief />
          <ProcessMap phase={state.phase} standards={standards} />
          <Principles />
          <DecisionTree />
          <SourceLayerSection />
          <MeasuresSection
            measures={filteredMeasures}
            phase={state.phase}
            selected={selected}
            scores={scores}
            onToggle={toggleMeasure}
          />
        </section>
      </main>
    </>
  );
}
