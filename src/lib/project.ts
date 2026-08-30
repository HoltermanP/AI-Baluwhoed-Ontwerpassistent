import { useEffect, useState } from "react";
import { AppState } from "./types";

export type EvidenceStatus = "todo" | "busy" | "done";

export type DecisionOutcome = "aangenomen" | "afgewezen" | "uitgesteld";

export interface Decision {
  id: string;
  measureId: string;
  measureTitle: string;
  phase: string;
  outcome: DecisionOutcome;
  reason: string;
  date: string; // ISO datum
}

export interface Variant {
  id: string;
  name: string;
  co2: number; // kg CO2/m2 BVO
  extraCost: number; // euro per m2 BVO t.o.v. referentie
  risk: number; // 1 (laag) - 5 (hoog)
  weeks: number; // bouwtijdverschil in weken t.o.v. referentie
  note: string;
}

export interface TeamMember {
  role: string;
  name: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: string;
  /** Tekstinhoud (alleen voor tekstbestanden, afgekapt) zodat de assistent signalen kan herkennen. */
  text?: string;
  note?: string;
}

export interface ProjectProfile {
  name: string;
  location: string;
  homes: number;
  description: string;
  ambitions: string;
  client: string;
  team: TeamMember[];
  documents: ProjectDocument[];
}

export interface ProjectData {
  id: string;
  profile: ProjectProfile;
  state: AppState;
  selected: string[];
  evidence: Record<string, EvidenceStatus>; // key: `${measureId}::${index}`
  decisions: Decision[];
  variants: Variant[];
  updatedAt: string;
}

export interface Workspace {
  activeId: string;
  projects: ProjectData[];
}

const STORAGE_KEY = "blauwhoed-ontwerpassistent-workspace-v2";

export const defaultState: AppState = {
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

export const defaultVariants: Variant[] = [
  { id: "v-beton", name: "Referentie: betoncasco", co2: 184, extraCost: 0, risk: 1, weeks: 0, note: "Huidig ontwerp / benchmark" },
  { id: "v-hybride", name: "Houthybride (betonkern, houten vloeren)", co2: 138, extraCost: 45, risk: 3, weeks: -3, note: "Brand en akoestiek uitwerken" },
  { id: "v-clt", name: "Volledig hout (CLT/HSB)", co2: 112, extraCost: 85, risk: 4, weeks: -6, note: "Alleen bij max. 4-6 lagen zonder extra maatregelen" }
];

export const emptyProfile: ProjectProfile = {
  name: "Nieuw project",
  location: "",
  homes: 0,
  description: "",
  ambitions: "",
  client: "Blauwhoed",
  team: [
    { role: "Ontwikkelmanager", name: "" },
    { role: "Architect", name: "" },
    { role: "Constructeur", name: "" },
    { role: "Duurzaamheidsadviseur", name: "" }
  ],
  documents: []
};

export function evidenceKey(measureId: string, index: number): string {
  return `${measureId}::${index}`;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createProject(partial: Partial<ProjectData> = {}): ProjectData {
  return {
    id: newId("p"),
    profile: { ...emptyProfile, team: emptyProfile.team.map((t) => ({ ...t })), documents: [] },
    state: { ...defaultState },
    selected: [],
    evidence: {},
    decisions: [],
    variants: defaultVariants.map((v) => ({ ...v })),
    updatedAt: new Date().toISOString(),
    ...partial
  };
}

/**
 * Score een variant integraal: lage CO2 weegt het zwaarst, daarna kosten, risico en bouwtijd.
 * Hogere score is beter. Genormaliseerd binnen de set varianten zodat de ranking stabiel blijft.
 */
export function scoreVariant(variant: Variant, all: Variant[], budget: number): number {
  const co2s = all.map((v) => v.co2);
  const costs = all.map((v) => v.extraCost);
  const span = (values: number[]) => Math.max(1, Math.max(...values) - Math.min(...values));
  const co2Norm = 1 - (variant.co2 - Math.min(...co2s)) / span(co2s);
  const costNorm = 1 - (variant.extraCost - Math.min(...costs)) / span(costs);
  const riskNorm = 1 - (variant.risk - 1) / 4;
  const timeNorm = variant.weeks <= 0 ? 1 : Math.max(0, 1 - variant.weeks / 12);
  const budgetBonus = variant.co2 <= budget ? 0.5 : 0;
  return Math.round((co2Norm * 4 + costNorm * 2.5 + riskNorm * 2 + timeNorm * 1.5 + budgetBonus) * 10);
}

export function loadWorkspace(): Workspace | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Workspace;
    if (!parsed.projects?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkspace(workspace: Workspace): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  } catch {
    /* opslag niet beschikbaar of vol; stil doorgaan */
  }
}

export function clearWorkspace(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* negeren */
  }
}

/** Slaat de werkruimte automatisch op (met kleine vertraging) en meldt het laatste opslagmoment. */
export function useAutosave(workspace: Workspace, enabled: boolean): string | null {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      saveWorkspace(workspace);
      setSavedAt(new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [workspace, enabled]);
  return savedAt;
}

/* ---------- Documentanalyse ---------- */

export interface DocumentSignal {
  id: string;
  label: string;
  detail: string;
  apply?: Partial<AppState>;
  suggestMeasure?: string;
}

const TEXT_TYPES = ["text/", "application/json", "text/csv"];
export const MAX_DOC_TEXT = 40000;

export function isTextLike(file: File): boolean {
  return TEXT_TYPES.some((t) => file.type.startsWith(t)) || /\.(txt|md|csv|json)$/i.test(file.name);
}

/** Herkent duurzaamheidssignalen in vrije tekst (contextnotitie, documenten). */
export function analyseText(text: string): DocumentSignal[] {
  const t = text.toLowerCase();
  const signals: DocumentSignal[] = [];
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  const mpg = t.match(/mpg[^0-9]{0,40}?(\d+[.,]\d+)/);
  if (mpg) signals.push({ id: "mpg", label: `MPG-score gevonden: ${mpg[1]}`, detail: "Gebruik de MPG-berekening als onderbouwing van de CO2-score.", apply: { dataQuality: "mpg" } });

  const co2 = t.match(/(\d{2,3})\s*kg\s*co2(?:-eq)?\s*(?:\/|per)\s*m2/);
  if (co2) signals.push({ id: "co2", label: `CO2-prestatie gevonden: ${co2[1]} kg CO2/m2`, detail: "Neem over als huidige projectprestatie.", apply: { co2: Number(co2[1]) } });

  const bvo = t.match(/(\d[\d.]{2,})\s*m2\s*bvo/);
  if (bvo) signals.push({ id: "bvo", label: `BVO gevonden: ${bvo[1]} m2`, detail: "Neem over als bruto vloeroppervlak.", apply: { bvo: Number(bvo[1].replace(/\./g, "")) } });

  if (has("bestaand", "transformatie", "renovatie", "hergebruik casco", "optoppen"))
    signals.push({ id: "existing", label: "Bestaande bebouwing of transformatie genoemd", detail: "Zet 'bestaande constructie aanwezig' aan en onderzoek transformatie eerst.", apply: { existingStructure: true }, suggestMeasure: "transformeren" });

  if (has("hout", "clt", "hsb", "biobased", "houtbouw"))
    signals.push({ id: "wood", label: "Hout of biobased bouwen genoemd", detail: "Neem houthybride/biobased constructie mee in de variantvergelijking.", suggestMeasure: "houthybride" });

  if (has("hoogbouw", "toren", "woonlagen", "lagen") && /(\d{1,2})\s*(woon)?lagen/.test(t)) {
    const layers = Number(t.match(/(\d{1,2})\s*(woon)?lagen/)![1]);
    if (layers > 4) signals.push({ id: "highrise", label: `${layers} bouwlagen genoemd`, detail: "Gebouw is hoger dan 4 lagen; dit beinvloedt hout- en brandveiligheidskeuzes.", apply: { highRise: true } });
  }

  if (has("hemelwater", "grijswater", "waterberging", "drinkwater", "wadi"))
    signals.push({ id: "water", label: "Wateropgave genoemd", detail: "Waterbespaarklaar ontwerpen is relevant voor dit project.", apply: { waterReady: true }, suggestMeasure: "water" });

  if (has("tender", "aanbesteding", "selectie", "prijsvraag"))
    signals.push({ id: "tender", label: "Tender of selectie genoemd", detail: "Kansrijkheid weegt zwaarder in de prioritering.", apply: { tenderMode: true } });

  if (has("greenlabel", "biodiversiteit", "natuurinclusief"))
    signals.push({ id: "green", label: "Biodiversiteit of NL Greenlabel genoemd", detail: "Stuur het gebied op NL Greenlabel A of B.", suggestMeasure: "greenlabel" });

  if (has("beng", "energieneutraal", "warmtepomp") || /\bpv\b|zonnepanelen/.test(t))
    signals.push({ id: "energy", label: "Energieconcept genoemd", detail: "Beperk installatiemateriaal en verlaag BENG1 voordat PV wordt gedimensioneerd.", suggestMeasure: "installatielast" });

  return signals;
}

export function readDocument(file: File): Promise<ProjectDocument> {
  const base: ProjectDocument = {
    id: newId("doc"),
    name: file.name,
    size: file.size,
    type: file.type || "onbekend",
    addedAt: new Date().toISOString().slice(0, 10)
  };
  if (!isTextLike(file)) return Promise.resolve(base);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ ...base, text: String(reader.result ?? "").slice(0, MAX_DOC_TEXT) });
    reader.onerror = () => resolve(base);
    reader.readAsText(file);
  });
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
