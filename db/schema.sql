-- Schema voor de Blauwhoed Ontwerpassistent in Neon (Postgres).
-- De app maakt deze tabel ook zelf aan bij het eerste API-verzoek (zie src/lib/db.ts).

CREATE TABLE IF NOT EXISTS projects (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL DEFAULT '',
  data       JSONB NOT NULL,            -- volledige ProjectData (profiel, context, selecties, dossier, besluiten, varianten)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON projects (updated_at DESC);
