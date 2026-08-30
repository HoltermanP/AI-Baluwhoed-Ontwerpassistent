import { neon } from "@neondatabase/serverless";
import type { ProjectData } from "./project";

/** Neon Postgres via HTTP; alleen server-side gebruiken. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL ontbreekt");
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

/** Maakt de tabel aan als die nog niet bestaat (zie ook db/schema.sql). */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const q = sql();
      await q`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL DEFAULT '',
          data JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

export async function listProjects(): Promise<ProjectData[]> {
  await ensureSchema();
  const rows = await sql()`SELECT data FROM projects ORDER BY updated_at DESC`;
  return rows.map((row) => row.data as ProjectData);
}

export async function upsertProject(project: ProjectData): Promise<void> {
  await ensureSchema();
  await sql()`
    INSERT INTO projects (id, name, data, updated_at)
    VALUES (${project.id}, ${project.profile.name}, ${JSON.stringify(project)}::jsonb, ${project.updatedAt})
    ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name, data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
  `;
}

export async function deleteProjectRow(id: string): Promise<ProjectData | null> {
  await ensureSchema();
  const rows = await sql()`DELETE FROM projects WHERE id = ${id} RETURNING data`;
  return rows.length ? (rows[0].data as ProjectData) : null;
}
