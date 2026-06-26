import type { Student } from "@/lib/data";
import { initials } from "@/lib/utils";

function esc(v: unknown): string {
  return String(v ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!
  );
}

function dobStr(s: Student): string {
  return s.dateOfBirth ? s.dateOfBirth.split("-").reverse().join(".") : "—";
}

/** Plain-text summary used for sharing / e-mailing a candidate shortlist. */
export function candidateSummaryText(students: Student[]): string {
  return [
    `Casting — vybraní uchádzači (${students.length})`,
    "",
    ...students.map((s, i) =>
      [
        `${i + 1}. ${s.lastName} ${s.firstName} (${s.id})`,
        `   - Vek: ${s.age} r. (${dobStr(s)}), ${s.gender}`,
        `   - Výška: ${s.heightCm || "—"} cm, Hmotnosť: ${s.weightKg || "—"} kg`,
        `   - Oči: ${s.eyeColor}, Vlasy: ${s.hairColor}`,
        `   - Zručnosti: ${s.skills.join(", ") || "—"}`,
        `   - Jazyky: ${s.languages.join(", ") || "—"}`,
        `   - Kontakt (rodič): ${s.guardianName || "—"} · ${s.guardianPhone || "—"} · ${s.guardianEmail || "—"}`,
        "",
      ].join("\n")
    ),
  ].join("\n");
}

/** Share the shortlist via the native share sheet, falling back to e-mail. */
export async function shareCandidates(students: Student[]): Promise<void> {
  if (students.length === 0) return;
  const title = `Casting — ${students.length} uchádzačov`;
  const text = candidateSummaryText(students);
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled or unsupported — fall through to mailto
    }
  }
  const to = students
    .map((s) => s.guardianEmail)
    .filter(Boolean)
    .join(",");
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(text)}`;
}

/** Open a print-ready window with the shortlist; the user saves it as PDF. */
export function printCandidatesPdf(students: Student[], heading = "Casting — uchádzači") {
  if (students.length === 0) return;
  const win = window.open("", "_blank");
  if (!win) {
    alert("Povoľte vyskakovacie okná, aby sa dal vytvoriť PDF export.");
    return;
  }

  const today = new Date().toLocaleDateString("sk-SK");
  const cards = students
    .map(
      (s) => `
    <div class="card">
      ${
        s.photoUrl
          ? `<img class="photo" src="${esc(s.photoUrl)}" alt="" />`
          : `<div class="photo ph">${esc(initials(s.firstName, s.lastName))}</div>`
      }
      <div class="info">
        <h2>${esc(s.lastName)} ${esc(s.firstName)} <span class="id">${esc(s.id)}</span></h2>
        <div class="grid">
          <span><b>Vek:</b> ${s.age} r. (${esc(dobStr(s))})</span>
          <span><b>Pohlavie:</b> ${esc(s.gender)}</span>
          <span><b>Výška:</b> ${s.heightCm || "—"} cm</span>
          <span><b>Hmotnosť:</b> ${s.weightKg || "—"} kg</span>
          <span><b>Oči:</b> ${esc(s.eyeColor)}</span>
          <span><b>Vlasy:</b> ${esc(s.hairColor)}</span>
          <span><b>Mesto:</b> ${esc(s.city || "—")}</span>
          <span><b>Oblečenie:</b> ${esc(s.clothingSize)} · obuv ${s.shoeEu || "—"}</span>
        </div>
        <p><b>Zručnosti:</b> ${esc(s.skills.join(", ") || "—")}</p>
        <p><b>Jazyky:</b> ${esc(s.languages.join(", ") || "—")}</p>
        <p class="contact"><b>Kontakt (rodič):</b> ${esc(s.guardianName || "—")} · ${esc(s.guardianPhone || "—")} · ${esc(s.guardianEmail || "—")}</p>
      </div>
    </div>`
    )
    .join("");

  win.document.write(`<!doctype html>
<html lang="sk"><head><meta charset="utf-8" />
<title>${esc(heading)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1a1a1a; margin: 24px; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  .meta { color: #666; font-size: 12px; margin: 0 0 16px; }
  .card { display: flex; gap: 14px; padding: 12px; border: 1px solid #e2e2e2; border-radius: 10px; margin-bottom: 10px; page-break-inside: avoid; }
  .photo { width: 96px; height: 96px; object-fit: cover; border-radius: 8px; flex: none; }
  .photo.ph { display: flex; align-items: center; justify-content: center; background: #6d4ea8; color: #fff; font-size: 28px; font-weight: 600; }
  .info { min-width: 0; }
  h2 { font-size: 15px; margin: 0 0 6px; }
  .id { color: #888; font-weight: 400; font-size: 12px; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 2px 18px; font-size: 12.5px; margin-bottom: 6px; }
  p { font-size: 12.5px; margin: 2px 0; }
  .contact { margin-top: 4px; }
  @media print { body { margin: 12mm; } }
</style></head>
<body>
  <h1>${esc(heading)}</h1>
  <p class="meta">${students.length} uchádzačov · ${esc(today)}</p>
  ${cards}
  <script>window.onload = function () { window.print(); };</script>
</body></html>`);
  win.document.close();
}
