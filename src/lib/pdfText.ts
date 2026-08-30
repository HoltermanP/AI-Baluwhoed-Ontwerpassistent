/**
 * Leest de tekst uit een PDF in de browser met pdf.js.
 * De worker staat in /public zodat hij zonder bundler-configuratie geladen kan worden.
 */
export async function extractPdfText(file: File, maxChars: number, maxPages = 40): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = Math.min(pdf.numPages, maxPages);
  const parts: string[] = [];
  let length = 0;

  for (let i = 1; i <= pages && length < maxChars; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) {
      parts.push(text);
      length += text.length;
    }
  }
  await pdf.destroy();
  return parts.join("\n").slice(0, maxChars);
}
