import { Measure, budgets, phaseDecisions } from "./data";
import { AppState } from "./types";
import { dataQualityLabel, evidenceNeed, nextAction, relevantStandards, standardHint, statusLabel } from "./measures";

export function buildAdviceText(
  state: AppState,
  chosen: Measure[],
  filteredFallback: Measure[]
): string {
  const project = budgets[state.projectType];
  const gap = Math.max(0, Math.round(state.co2 - project.value));
  const tonnes = Math.round((gap * state.bvo) / 1000);
  const phaseItems = phaseDecisions[state.phase] || [];
  const standards = relevantStandards(state.theme);
  const measuresToList = chosen.length ? chosen : filteredFallback.slice(0, 5);

  const lines = [
    "Blauwhoed Ontwerpassistent - besluitmemo",
    "",
    "Vraagvertaling",
    "- Handvat voor juiste duurzame ontwerpkeuzes per fase.",
    "- Concreet op maatregelniveau, zonder verouderende productcatalogus.",
    "- Beheer via dynamische bronlaag: NMD, EPD/NIBE, projectdata en lessons learned.",
    "",
    "Projectcontext",
    `Fase: ${state.phase}`,
    `Projecttype: ${project.label}`,
    `BVO: ${state.bvo} m2`,
    `CO2-prestatie: ${state.co2} kg CO2/m2 BVO`,
    `Paris Proof budget 2026: ${project.value} kg CO2/m2 BVO`,
    `Benodigde reductie: ${gap} kg CO2/m2 BVO, indicatief ${tonnes} ton CO2-eq totaal`,
    `Onderbouwing: ${dataQualityLabel(state.dataQuality)}`,
    `Grootste impact: ${state.impactPart}`,
    `Contextnotitie: ${state.contextNotes || "niet ingevuld"}`,
    "",
    "Fasebesluit:",
    ...phaseItems.map(([title, body]) => `- ${title}: ${body}`),
    "",
    "Relevante standaarden:",
    ...standards.map((standard) => `- ${standard}: ${standardHint(standard)}`),
    "",
    "Geselecteerde maatregelen:",
    ...measuresToList.map(
      (measure) =>
        `- ${measure.title} (${statusLabel(measure.status)}, ${measure.layer}): ${measure.description} ${nextAction(
          state.phase
        )} ${evidenceNeed(measure)}`
    )
  ];

  return lines.join("\n");
}

export function downloadAdvice(text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "blauwhoed-ontwerpassistent-advies.txt";
  link.click();
  URL.revokeObjectURL(url);
}
