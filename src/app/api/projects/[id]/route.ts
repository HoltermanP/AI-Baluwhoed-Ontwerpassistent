import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { deleteProjectRow, isBlobConfigured, isDatabaseConfigured, upsertProject } from "@/lib/db";
import type { ProjectData } from "@/lib/project";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

/** PUT: één project opslaan (upsert). */
export async function PUT(request: Request, { params }: Context) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 503 });
  }
  const { id } = await params;
  try {
    const project = (await request.json()) as ProjectData;
    if (project.id !== id) return NextResponse.json({ error: "id komt niet overeen" }, { status: 400 });
    await upsertProject(project);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/** DELETE: project verwijderen, inclusief bijbehorende documenten in Vercel Blob. */
export async function DELETE(_request: Request, { params }: Context) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database niet geconfigureerd" }, { status: 503 });
  }
  const { id } = await params;
  try {
    const removed = await deleteProjectRow(id);
    const urls = removed?.profile.documents.map((d) => d.url).filter((u): u is string => Boolean(u)) ?? [];
    if (urls.length && isBlobConfigured()) await del(urls).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
