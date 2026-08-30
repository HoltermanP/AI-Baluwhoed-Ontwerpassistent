import { Measure, Layer, Phase, standardsByTheme } from "./data";

export interface FilterState {
  phase: Phase;
  theme: string;
  layer: string;
  status: string;
  tenderMode: boolean;
  impactPart: Layer;
  existingStructure: boolean;
  highRise: boolean;
  waterReady: boolean;
  query?: string;
}

export function scoreTotal(measure: Measure, filters: FilterState): number {
  const { duurzaamheid, technisch, financieel, kansrijk } = measure.scores;
  const tenderWeight = filters.tenderMode ? 1.4 : 1;
  const impactWeight = measure.layer === filters.impactPart ? 1.35 : 1;
  const statusWeight = measure.status === "verplicht" ? 1.25 : measure.status === "sterk" ? 1.12 : 1;
  return (duurzaamheid * 1.5 + technisch + financieel + kansrijk * tenderWeight) * impactWeight * statusWeight;
}

export function getFilteredMeasures(measures: Measure[], filters: FilterState): Measure[] {
  return measures
    .filter((measure) => measure.phases.includes(filters.phase))
    .filter((measure) => filters.theme === "Alle thema's" || measure.theme === filters.theme)
    .filter((measure) => filters.layer === "Alle lagen" || measure.layer === filters.layer)
    .filter((measure) => filters.status === "all" || measure.status === filters.status)
    .filter((measure) => {
      const q = filters.query?.trim().toLowerCase();
      if (!q) return true;
      return [measure.title, measure.description, measure.theme, measure.layer, measure.source, measure.id]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .filter((measure) => {
      if (measure.id === "transformeren") return filters.existingStructure || filters.phase === "Acquisitie";
      if (measure.id === "houthybride") return filters.highRise || filters.phase !== "DO";
      if (measure.id === "water") return filters.waterReady || measure.theme !== "Water";
      return true;
    })
    .sort((a, b) => scoreTotal(b, filters) - scoreTotal(a, filters));
}

export function getFocus(filtered: Measure[], filters: FilterState): { layer: string; label: string } {
  if (filtered.length === 0) return { layer: "Geen match", label: "verruim de filters" };
  const totals = filtered.reduce<Record<string, number>>((acc, measure) => {
    acc[measure.layer] = (acc[measure.layer] || 0) + scoreTotal(measure, filters);
    return acc;
  }, {});
  const [layer] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
  return { layer, label: "hoogste gecombineerde score" };
}

export function dataQualityLabel(dataQuality: string): string {
  return (
    {
      mpg: "MPG als basis voor besluit",
      benchmark: "benchmark eerst aanscherpen",
      unknown: "start met CO2-indicatie"
    } as Record<string, string>
  )[dataQuality];
}

export function relevantStandards(theme: string): string[] {
  const selectedTheme = theme === "Alle thema's" ? null : theme;
  return selectedTheme
    ? standardsByTheme[selectedTheme as keyof typeof standardsByTheme] || []
    : [...new Set(Object.values(standardsByTheme).flat())].slice(0, 8);
}

export function standardHint(standard: string): string {
  const hints: Record<string, string> = {
    "Paris Proof": "CO2-budget per m2 BVO",
    MPG: "milieuprestatie gebouw",
    BENG: "energiebehoefte en gebruiksfase",
    Betonakkoord: "MKI, CO2 en secundair materiaal",
    "Het Nieuwe Normaal": "herkomst, afval en waardebehoud",
    "Building Balance 30-30-30": "30 procent biobased ambitie",
    NMD: "productkaarten en MKI",
    "R-ladder": "eerst voorkomen, dan reduceren",
    "NL Gebiedslabel": "gebiedsbrede duurzaamheid",
    "NL Terreinlabel": "inrichting en beheer",
    "3/30/300-regel": "groenbeleving in gebied",
    Lichtvervuiling: "biodiversiteit en gezondheid",
    "Gezond Binnen Label": "gezond gebouw",
    "NL Greenlabel Gezondheid": "gezondheid in gebied",
    Groenbeleving: "welzijn en buitenruimte",
    BENG1: "energiebehoefte verlagen"
  };
  return hints[standard] || "toetsingskader";
}

export function statusLabel(status: string): string {
  return (
    {
      verplicht: "Verplicht indien van toepassing",
      sterk: "Sterk aanbevolen",
      suggestie: "Suggestie"
    } as Record<string, string>
  )[status];
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const actionByPhase: Record<string, string> = {
  Acquisitie: "Neem op als ambitie, tendercriterium of go/no-go vraag.",
  Haalbaarheid: "Vraag ontwerpteam om een snelle variantvergelijking met effect op CO2, kosten en risico.",
  Conceptontwikkeling: "Vertaal naar conceptkeuze en leg uitgangspunten vast in het projectdossier.",
  VO: "Laat alternatieven doorrekenen met MPG/NMD/LCA-data en toets technische randvoorwaarden.",
  DO: "Maak de eis productspecifiek zonder onnodig een leverancier vast te zetten.",
  "Bestek/Inkoop": "Neem prestatie-eisen, bewijsstukken en afwijkingsprocedure op in de uitvraag.",
  Realisatie: "Controleer of de gekozen oplossing daadwerkelijk wordt geleverd en toegepast.",
  Beheer: "Leg onderhoud, reparatie en hergebruik vast als beheerafspraak."
};

export function nextAction(phase: string): string {
  return `${phase}: ${actionByPhase[phase] || "Maak een onderbouwd besluit."}`;
}

export function evidenceNeed(measure: Measure): string {
  if (measure.theme === "CO2") return "Bewijs: MPG, NMD cat. 1/2 of EPD vergelijken met huidige ontwerpkeuze.";
  if (measure.theme === "Water") return "Bewijs: waterbalans, dakoppervlak, leidingconcept en ISSO/regelgeving toetsen.";
  if (measure.theme === "Biodiversiteit") return "Bewijs: NL Greenlabel-score en gebiedsmaatregelen opnemen.";
  if (measure.theme === "Gezondheid") return "Bewijs: comfort, daglicht, groenbeleving en Gezond Binnen Label beoordelen.";
  return "Bewijs: losmaakbaarheid, herkomst, afval en hergebruikpotentie onderbouwen.";
}

export function databaseInstruction(measure: Measure): string {
  const source = measure.status === "verplicht" ? "elk kwartaal" : "bij nieuwe projectfase";
  return `Beheer: actualiseer product- en partnerdata ${source}; principe en richtlijn blijven stabiel.`;
}

export function freshnessRisk(measure: Measure): string {
  if (measure.source.includes("PvE")) return "stabiel 2026";
  if (measure.source.includes("NMD") || measure.description.includes("productdata")) return "dynamisch";
  return measure.status === "suggestie" ? "periodiek checken" : "halfjaarlijks checken";
}
