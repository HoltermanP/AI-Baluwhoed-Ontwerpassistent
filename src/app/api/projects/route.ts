import { NextResponse } from "next/server";
import { isBlobConfigured, isDatabaseConfigured, listProjects, upsertProject } from "@/lib/db";
import type { ProjectData } from "@/lib/project";

export const runtime = "nodejs";

/** GET: alle projecten. Geeft 503 wanneer er geen database is geconfigureerd (client valt terug op lokale opslag). */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database niet geconfigureerd", configured: false }, { status: 503 });
  }
  try {
    const projects = await listProjects();
    return NextResponse.json({ projects, blob: isBlobConfigured() });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/** POST: meerdere projecten in één keer opslaan (bijv. demo-seed). */
export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 503 });
  }
  try {
    const body = (await request.json()) as { projects: ProjectData[] };
    await Promise.all(body.projects.map(upsertProject));
    return NextResponse.json({ ok: true, count: body.projects.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
