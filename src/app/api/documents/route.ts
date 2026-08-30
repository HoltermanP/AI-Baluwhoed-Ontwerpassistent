import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import { isBlobConfigured } from "@/lib/db";

export const runtime = "nodejs";

const MAX_UPLOAD = 25 * 1024 * 1024; // 25 MB

/** POST multipart: bestand opslaan in Vercel Blob onder projects/<projectId>/. */
export async function POST(request: Request) {
  if (!isBlobConfigured()) {
    return NextResponse.json({ error: "Vercel Blob niet geconfigureerd", configured: false }, { status: 503 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    const projectId = String(form.get("projectId") ?? "algemeen");
    if (!(file instanceof File)) return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 });
    if (file.size > MAX_UPLOAD) return NextResponse.json({ error: "Bestand groter dan 25 MB" }, { status: 413 });

    const safeName = file.name.replace(/[^\w.\-()\s]/g, "_");
    const blob = await put(`projects/${projectId}/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || "application/octet-stream"
    });
    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/** DELETE ?url=: bestand uit Vercel Blob verwijderen. */
export async function DELETE(request: Request) {
  if (!isBlobConfigured()) {
    return NextResponse.json({ error: "Vercel Blob niet geconfigureerd" }, { status: 503 });
  }
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url ontbreekt" }, { status: 400 });
  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
