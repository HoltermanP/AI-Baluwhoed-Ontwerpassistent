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

export interface ProjectData {
  state: AppState;
  selected: string[];
  evidence: Record<string, EvidenceStatus>; // key: `${measureId}::${index}`
  decisions: Decision[];
  variants: Variant[];
}

const STORAGE_KEY = "blauwhoed-ontwerpassistent-project-v1";

export const defaultVariants: Variant[] = [
  { id: "v-beton", name: "Referentie: betoncasco", co2: 184, extraCost: 0, risk: 1, weeks: 0, note: "Huidig ontwerp / benchmark" },
  { id: "v-hybride", name: "Houthybride (betonkern, houten vloeren)", co2: 138, extraCost: 45, risk: 3, weeks: -3, note: "Brand en akoestiek uitwerken" },
  { id: "v-clt", name: "Volledig hout (CLT/HSB)", co2: 112, extraCost: 85, risk: 4, weeks: -6, note: "Alleen bij max. 4-6 lagen zonder extra maatregelen" }
];

export function evidenceKey(measureId: string, index: number): string {
  return `${measureId}::${index}`;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
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

export function loadProject(): Partial<ProjectData> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<ProjectData>) : null;
  } catch {
    return null;
  }
}

export function saveProject(data: ProjectData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* opslag niet beschikbaar; stil doorgaan */
  }
}

export function clearProject(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* negeren */
  }
}

/** Slaat projectdata automatisch op (met kleine vertraging) en meldt het laatste opslagmoment. */
export function useAutosave(data: ProjectData, enabled: boolean): string | null {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      saveProject(data);
      setSavedAt(new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [data, enabled]);
  return savedAt;
}
