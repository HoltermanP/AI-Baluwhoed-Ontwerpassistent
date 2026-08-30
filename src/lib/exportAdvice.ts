import { Measure, budgets, phaseDecisions } from "./data";
import { AppState } from "./types";
import { dataQualityLabel, evidenceNeed, nextAction, relevantStandards, standardHint, statusLabel } from "./measures";
import { detail, isLastChance, lastPhase } from "./measureDetails";
import { Decision, EvidenceStatus, Variant, evidenceKey, scoreVariant } from "./project";

interface ProjectExtras {
  evidence: Record<string, EvidenceStatus>;
  decisions: Decision[];
  variants: Variant[];
}

const evidenceLabels: Record<EvidenceStatus, string> = { todo: "te doen", busy: "in bewerking", done: "gereed" };

export function buildAdviceText(
  state: AppState,
  chosen: Measure[],
  filteredFallback: Measure[],
  extras?: ProjectExtras
): string {
  const project = budgets[state.projectType];
  const gap = Math.max(0, Math.round(state.co2 - project.value));
  const tonnes = Math.round((gap * state.bvo) / 1000);
  const phaseItems = phaseDecisions[state.phase] || [];
  const standards = relevantStandards(state.theme);
  const measuresToList = chosen.length ? chosen : filteredFallback.slice(0, 5);

  const reduction = chosen.reduce(
    (acc, m) => {
      const [low, high] = detail(m).reduction;
      return [acc[0] + low, acc[1] + high];
    },
    [0, 0]
  );
  const afterMid = Math.max(0, state.co2 - (reduction[0] + reduction[1]) / 2);

  const lines = [
    "Blauwhoed Ontwerpassistent - besluitmemo",
    `Datum: ${new Date().toLocaleDateString("nl-NL")}`,
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
    "CO2-reductiepad (indicatief)",
    `Geselecteerde reductie: ${Math.round(reduction[0])}-${Math.round(reduction[1])} kg CO2/m2 BVO`,
    `Verwachte prestatie na maatregelen: ~${Math.round(afterMid)} kg CO2/m2 BVO (${afterMid <= project.value ? "binnen budget" : `nog ${Math.round(afterMid - project.value)} kg/m2 boven budget`})`,
    "Let op: bandbreedtes zijn niet zonder meer optelbaar; bevestig met MPG/LCA-variantberekening.",
    "",
    "Fasebesluit:",
    ...phaseItems.map(([title, body]) => `- ${title}: ${body}`),
    "",
    "Relevante standaarden:",
    ...standards.map((standard) => `- ${standard}: ${standardHint(standard)}`),
    "",
    "Geselecteerde maatregelen:",
    ...measuresToList.map((measure) => {
      const [low, high] = detail(measure).reduction;
      const band = high > 0 ? ` CO2-effect ${low}-${high} kg/m2.` : "";
      const urgency = isLastChance(measure, state.phase) ? " LAATSTE KANS: besluit in deze fase." : ` Uiterlijk besluiten in ${lastPhase(measure)}.`;
      return `- ${measure.title} (${statusLabel(measure.status)}, ${measure.layer}): ${measure.description}${band}${urgency} ${nextAction(
        state.phase
      )} ${evidenceNeed(measure)}`;
    })
  ];

  if (extras) {
    if (extras.variants.length) {
      lines.push("", "Variantvergelijking:");
      [...extras.variants]
        .map((v) => ({ v, score: scoreVariant(v, extras.variants, project.value) }))
        .sort((a, b) => b.score - a.score)
        .forEach(({ v, score }) => {
          lines.push(
            `- ${v.name}: ${v.co2} kg CO2/m2 (${v.co2 <= project.value ? "binnen" : "boven"} budget), meerkosten ${v.extraCost} euro/m2, risico ${v.risk}/5, bouwtijd ${v.weeks >= 0 ? "+" : ""}${v.weeks} wk, score ${score}${v.note ? `. ${v.note}` : ""}`
          );
        });
    }

    if (chosen.length) {
      lines.push("", "Bewijsdossier:");
      chosen.forEach((m) => {
        const items = detail(m).evidence;
        if (!items.length) return;
        lines.push(`- ${m.title} (gereed uiterlijk ${lastPhase(m)})`);
        items.forEach((item, i) => {
          const status = extras.evidence[evidenceKey(m.id, i)] ?? "todo";
          lines.push(`    [${evidenceLabels[status]}] ${item}`);
        });
      });
    }

    if (extras.decisions.length) {
      lines.push("", "Besluitenlog:");
      extras.decisions.forEach((d) => {
        lines.push(`- ${d.date} ${d.phase} - ${d.measureTitle}: ${d.outcome.toUpperCase()}. ${d.reason}`);
      });
    }
  }

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
