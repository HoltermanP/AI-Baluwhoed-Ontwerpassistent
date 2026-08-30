import { ProjectData, Workspace, loadWorkspace, saveWorkspace, clearWorkspace } from "./project";

/**
 * Opslaglaag voor de client.
 * - "remote": projectdata in Neon (via /api/projects), documenten in Vercel Blob (via /api/documents).
 * - "local": terugval op localStorage wanneer de server geen database heeft geconfigureerd.
 */
export type StorageMode = "remote" | "local";

export interface StorageStatus {
  mode: StorageMode;
  blob: boolean;
}

const ACTIVE_KEY = "blauwhoed-ontwerpassistent-active-project";

export function loadActiveId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveId(id: string): void {
  try {
    window.localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* negeren */
  }
}

/** Haalt alle projecten op. Geeft null terug als de database niet is geconfigureerd. */
export async function fetchRemoteProjects(): Promise<{ projects: ProjectData[]; blob: boolean } | null> {
  try {
    const response = await fetch("/api/projects", { cache: "no-store" });
    if (response.status === 503) return null;
    if (!response.ok) throw new Error(await response.text());
    return (await response.json()) as { projects: ProjectData[]; blob: boolean };
  } catch (error) {
    console.warn("Projecten ophalen mislukt, terugval op lokale opslag", error);
    return null;
  }
}

export async function seedRemoteProjects(projects: ProjectData[]): Promise<boolean> {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects })
  });
  return response.ok;
}

export async function saveRemoteProject(project: ProjectData): Promise<boolean> {
  const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project)
  });
  return response.ok;
}

export async function deleteRemoteProject(id: string): Promise<boolean> {
  const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
  return response.ok;
}

/** Upload naar Vercel Blob; geeft de publieke URL terug of null wanneer Blob niet is geconfigureerd. */
export async function uploadToBlob(file: File, projectId: string): Promise<string | null> {
  const form = new FormData();
  form.append("file", file);
  form.append("projectId", projectId);
  const response = await fetch("/api/documents", { method: "POST", body: form });
  if (response.status === 503) return null;
  if (!response.ok) throw new Error((await response.json().catch(() => ({ error: response.statusText }))).error);
  return ((await response.json()) as { url: string }).url;
}

export async function deleteFromBlob(url: string): Promise<void> {
  await fetch(`/api/documents?url=${encodeURIComponent(url)}`, { method: "DELETE" }).catch(() => undefined);
}

/* ---- lokale terugval ---- */

export function loadLocalWorkspace(): Workspace | null {
  return loadWorkspace();
}

export function saveLocalWorkspace(workspace: Workspace): void {
  saveWorkspace(workspace);
}

export function clearLocalWorkspace(): void {
  clearWorkspace();
}
