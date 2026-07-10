import { Phase, ProjectTypeKey, DataQuality, Layer } from "./data";

export interface AppState {
  phase: Phase;
  projectType: ProjectTypeKey;
  co2: number;
  bvo: number;
  dataQuality: DataQuality;
  impactPart: Layer;
  existingStructure: boolean;
  tenderMode: boolean;
  highRise: boolean;
  waterReady: boolean;
  contextNotes: string;
  theme: string;
  layer: string;
  status: string;
}

export type UpdateField = <K extends keyof AppState>(key: K, value: AppState[K]) => void;
