import type { Student } from "@/lib/data";
import { initials } from "@/lib/utils";

export type CandidateShareField =
  | "photo"
  | "basic"
  | "program"
  | "physical"
  | "skills"
  | "languages"
  | "studentContact"
  | "guardianContact"
  | "bio"
  | "notes"
  | "social";

export type CandidateFieldLine = {
  label: string;
  value: string;
};

export type CandidateFieldSection = {
  id: CandidateShareField;
  title: string;
  lines?: CandidateFieldLine[];
  text?: string;
  items?: string[];
};

export type CandidateShareOptions = {
  fields?: CandidateShareField[];
  heading?: string;
};

export type CandidateShareResult =
  | "shared"
  | "copied"
  | "cancelled"
  | "unavailable";

export const CANDIDATE_SHARE_FIELDS: {
  id: CandidateShareField;
  label: string;
  description: string;
}[] = [
  {
    id: "photo",
    label: "Fotka",
    description: "Hlavný portrét alebo iniciály v PDF náhľade.",
  },
  {
    id: "basic",
    label: "Základné údaje",
    description: "Vek, dátum narodenia, pohlavie a mesto.",
  },
  {
    id: "program",
    label: "Štúdium",
    description: "Program, stav, ročník a pedagóg.",
  },
  {
    id: "physical",
    label: "Castingové miery",
    description: "Výška, hmotnosť, oči, vlasy, oblečenie a hlas.",
  },
  {
    id: "skills",
    label: "Zručnosti",
    description: "Herecké, tanečné, športové a iné schopnosti.",
  },
  {
    id: "languages",
    label: "Jazyky a prízvuk",
    description: "Jazyky, akcent a hlasový prejav.",
  },
  {
    id: "studentContact",
    label: "Kontakt dieťaťa",
    description: "Telefón, e-mail a škola študenta.",
  },
  {
    id: "guardianContact",
    label: "Kontakt rodiča",
    description: "Rodič, telefón, e-mail a núdzový kontakt.",
  },
  {
    id: "bio",
    label: "Bio",
    description: "Krátky profil študenta.",
  },
  {
    id: "notes",
    label: "Poznámky pedagóga",
    description: "Interná poznámka k pripravenosti a rozvoju.",
  },
  {
    id: "social",
    label: "Siete a odkazy",
    description: "Follower counts a profilové odkazy.",
  },
];

export const DEFAULT_CANDIDATE_SHARE_FIELDS: CandidateShareField[] = [
  "photo",
  "basic",
  "program",
  "physical",
  "skills",
  "languages",
  "guardianContact",
];

function esc(v: unknown): string {
  return String(v ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!
  );
}

function dobStr(s: Student): string {
  return s.dateOfBirth ? s.dateOfBirth.split("-").reverse().join(".") : "—";
}

function nonEmpty(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function joinList(values: (string | number | undefined | null)[] | undefined) {
  const clean = (values ?? [])
    .map((v) => nonEmpty(v))
    .filter((v) => v !== "—");
  return clean.length ? clean.join(", ") : "—";
}

function enabled(fields: CandidateShareField[], id: CandidateShareField) {
  return fields.includes(id);
}

function compactLines(lines: CandidateFieldLine[]): CandidateFieldLine[] {
  return lines.map((line) => ({ ...line, value: nonEmpty(line.value) }));
}

function socialItems(s: Student): string[] {
  return [
    s.igFollowers ? `Instagram: ${s.igFollowers}` : "",
    s.ttFollowers ? `TikTok: ${s.ttFollowers}` : "",
    s.ytFollowers ? `YouTube: ${s.ytFollowers}` : "",
    s.fbFollowers ? `Facebook: ${s.fbFollowers}` : "",
    s.urlWeb ? `Web: ${s.urlWeb}` : "",
    s.urlIg ? `Instagram profil: ${s.urlIg}` : "",
    s.urlTt ? `TikTok profil: ${s.urlTt}` : "",
    s.urlYt ? `YouTube profil: ${s.urlYt}` : "",
    s.urlFb ? `Facebook profil: ${s.urlFb}` : "",
    s.urlLi ? `LinkedIn: ${s.urlLi}` : "",
    s.urlImdb ? `IMDb: ${s.urlImdb}` : "",
    s.urlCsfd ? `ČSFD: ${s.urlCsfd}` : "",
    s.urlIdiv ? `iDiv: ${s.urlIdiv}` : "",
  ].filter(Boolean);
}

export function candidateFieldSections(
  s: Student,
  fields: CandidateShareField[] = DEFAULT_CANDIDATE_SHARE_FIELDS
): CandidateFieldSection[] {
  const sections: CandidateFieldSection[] = [];

  if (enabled(fields, "basic")) {
    sections.push({
      id: "basic",
      title: "Základné údaje",
      lines: compactLines([
        { label: "Vek", value: `${s.age} r. (${dobStr(s)})` },
        { label: "Pohlavie", value: s.gender },
        { label: "Mesto", value: s.city },
        { label: "Preferované meno", value: s.preferredName ?? "" },
        { label: "Zámená", value: s.pronouns },
      ]),
    });
  }

  if (enabled(fields, "program")) {
    sections.push({
      id: "program",
      title: "Štúdium",
      lines: compactLines([
        { label: "Program", value: s.program },
        { label: "Stav", value: s.status },
        { label: "Ročník", value: s.cohort },
        { label: "Pedagóg", value: s.teacher },
      ]),
    });
  }

  if (enabled(fields, "physical")) {
    sections.push({
      id: "physical",
      title: "Castingové miery",
      lines: compactLines([
        { label: "Výška", value: s.heightCm ? `${s.heightCm} cm` : "" },
        { label: "Hmotnosť", value: s.weightKg ? `${s.weightKg} kg` : "" },
        { label: "Oči", value: s.eyeColor },
        { label: "Vlasy", value: s.hairColor },
        { label: "Obuv", value: s.shoeEu ? `${s.shoeEu} EU` : "" },
        { label: "Oblečenie", value: s.clothingSize },
        { label: "Hlas", value: s.voiceType ?? "" },
        { label: "Zdanlivý vek", value: s.apparentAge ?? "" },
        { label: "Typ postavy", value: s.bodyType ?? "" },
        { label: "Dĺžka vlasov", value: s.hairLength ?? "" },
        { label: "Typ vlasov", value: s.hairType ?? "" },
        { label: "Brada", value: s.beard ?? "" },
        { label: "Oblek", value: s.suitSize ?? "" },
      ]),
    });
  }

  if (enabled(fields, "skills")) {
    sections.push({
      id: "skills",
      title: "Zručnosti",
      lines: compactLines([
        { label: "Zručnosti", value: joinList(s.skills) },
        { label: "Nástroje", value: joinList(s.instruments) },
        { label: "Tanec", value: joinList(s.danceStyles) },
        { label: "Športy", value: joinList(s.sports) },
        { label: "Vodičské oprávnenia", value: joinList(s.drivingLicences) },
        { label: "Ďalšie zručnosti", value: s.otherSkills ?? "" },
        { label: "Ďalšie talenty", value: s.otherTalents ?? "" },
      ]),
    });
  }

  if (enabled(fields, "languages")) {
    sections.push({
      id: "languages",
      title: "Jazyky a prízvuk",
      lines: compactLines([
        { label: "Jazyky", value: joinList(s.languages) },
        { label: "Prízvuk", value: s.accent ?? "" },
        { label: "Hlasový prejav", value: s.voiceSpeak ?? "" },
      ]),
    });
  }

  if (enabled(fields, "studentContact")) {
    sections.push({
      id: "studentContact",
      title: "Kontakt dieťaťa",
      lines: compactLines([
        { label: "Telefón", value: s.phone ?? "" },
        { label: "E-mail", value: s.email ?? "" },
        { label: "Škola", value: s.school ?? "" },
      ]),
    });
  }

  if (enabled(fields, "guardianContact")) {
    sections.push({
      id: "guardianContact",
      title: "Kontakt rodiča",
      lines: compactLines([
        {
          label: "Rodič",
          value: [s.guardianName, s.guardianRelation]
            .filter(Boolean)
            .join(" · "),
        },
        { label: "Telefón", value: s.guardianPhone },
        { label: "E-mail", value: s.guardianEmail },
        { label: "Druhý e-mail", value: s.guardianEmail2 ?? "" },
        { label: "Núdzový kontakt", value: s.emergencyContact },
      ]),
    });
  }

  if (enabled(fields, "bio")) {
    sections.push({
      id: "bio",
      title: "Bio",
      text: nonEmpty(s.bio),
    });
  }

  if (enabled(fields, "notes")) {
    sections.push({
      id: "notes",
      title: "Poznámky pedagóga",
      text: nonEmpty(s.tutorNote),
    });
  }

  if (enabled(fields, "social")) {
    sections.push({
      id: "social",
      title: "Siete a odkazy",
      items: socialItems(s).length > 0 ? socialItems(s) : ["—"],
    });
  }

  return sections;
}

/** Plain-text summary used for sharing a candidate shortlist. */
export function candidateSummaryText(
  students: Student[],
  options: CandidateShareOptions = {}
): string {
  const fields = options.fields ?? DEFAULT_CANDIDATE_SHARE_FIELDS;
  const heading = options.heading ?? "Casting — vybraní uchádzači";

  return [
    `${heading} (${students.length})`,
    "",
    ...students.map((s, i) => {
      const photoLine = enabled(fields, "photo")
        ? [`   - Foto: ${s.photoUrl ?? "—"}`]
        : [];
      const sectionLines = candidateFieldSections(s, fields).flatMap((section) => {
        if (section.lines) {
          return section.lines.map(
            (line) => `   - ${line.label}: ${line.value}`
          );
        }
        if (section.text) return [`   - ${section.title}: ${section.text}`];
        if (section.items) {
          return [
            `   - ${section.title}:`,
            ...section.items.map((item) => `      · ${item}`),
          ];
        }
        return [];
      });

      return [
        `${i + 1}. ${s.lastName} ${s.firstName}`,
        ...photoLine,
        ...sectionLines,
        "",
      ].join("\n");
    }),
  ].join("\n");
}

/** Share the shortlist via the native share sheet, falling back to clipboard. */
export async function shareCandidates(
  students: Student[],
  options: CandidateShareOptions = {}
): Promise<CandidateShareResult> {
  if (students.length === 0) return "unavailable";
  const title = options.heading ?? `Casting — ${students.length} uchádzačov`;
  const text = candidateSummaryText(students, {
    ...options,
    heading: options.heading ?? "Casting — vybraní uchádzači",
  });

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(`${title}\n\n${text}`);
    return "copied";
  }

  return "unavailable";
}

export function candidatePdfDocumentHtml(
  students: Student[],
  heading = "Casting — uchádzači",
  fields: CandidateShareField[] = DEFAULT_CANDIDATE_SHARE_FIELDS,
  {
    autoPrint = false,
    showPrintToolbar = false,
  }: { autoPrint?: boolean; showPrintToolbar?: boolean } = {}
): string {
  const today = new Date().toLocaleDateString("sk-SK");
  const showPhoto = enabled(fields, "photo");
  const cards = students
    .map((s) => {
      const sections = candidateFieldSections(s, fields)
        .map(pdfSectionHtml)
        .join("");

      return `
    <article class="card ${showPhoto ? "" : "no-photo"}">
      ${
        showPhoto
          ? s.photoUrl
            ? `<img class="photo" src="${esc(s.photoUrl)}" alt="" />`
            : `<div class="photo ph">${esc(initials(s.firstName, s.lastName))}</div>`
          : ""
      }
      <div class="info">
        <h2>${esc(s.lastName)} ${esc(s.firstName)}</h2>
        ${sections || `<p class="muted">Vybrané sú iba mená študentov.</p>`}
      </div>
    </article>`;
    })
    .join("");

  return `<!doctype html>
<html lang="sk"><head><meta charset="utf-8" />
<title>${esc(heading)}</title>
<style>
  * { box-sizing: border-box; }
  html { background: #f2f2f2; }
  @page { size: A4; margin: 0; }
  body { background: #f2f2f2; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 16px; }
  .print-toolbar { align-items: center; background: rgb(255 255 255 / 96%); border: 1px solid #dedede; border-radius: 10px; box-shadow: 0 8px 24px rgb(20 20 20 / 10%); display: flex; gap: 10px; justify-content: space-between; margin: 0 auto 16px; max-width: 210mm; padding: 10px 12px; position: sticky; top: 8px; z-index: 2; }
  .print-toolbar p { color: #666; font-size: 12px; margin: 0; }
  .print-toolbar button { appearance: none; background: #6d4ea8; border: 0; border-radius: 8px; color: white; cursor: pointer; font: inherit; font-size: 13px; font-weight: 600; padding: 9px 12px; }
  .print-toolbar button:hover { filter: brightness(1.08); }
  #pages { display: block; }
  .page { background: white; break-after: page; display: flex; flex-direction: column; height: 297mm; margin: 0 auto 16px; overflow: hidden; padding: 12mm; page-break-after: always; width: 210mm; }
  .page:last-child { break-after: auto; margin-bottom: 0; page-break-after: auto; }
  .page-overflow { height: auto; min-height: 297mm; overflow: visible; }
  .page-body { display: flex; flex: 1; flex-direction: column; gap: 10px; min-height: 0; overflow: hidden; }
  .page-overflow .page-body { overflow: visible; }
  .doc-header { align-items: flex-start; display: flex; gap: 18px; justify-content: space-between; margin-bottom: 16px; }
  .brand-logo { display: block; height: auto; max-height: 42px; max-width: 132px; object-fit: contain; }
  .doc-title { min-width: 0; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  .meta { color: #666; font-size: 12px; margin: 0; }
  .card { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 14px; padding: 12px; border: 1px solid #e2e2e2; border-radius: 10px; page-break-inside: avoid; }
  .card.no-photo { grid-template-columns: minmax(0, 1fr); }
  .photo { width: 96px; height: 96px; object-fit: cover; border-radius: 8px; flex: none; }
  .photo.ph { display: flex; align-items: center; justify-content: center; background: #6d4ea8; color: #fff; font-size: 28px; font-weight: 600; }
  .info { min-width: 0; }
  h2 { font-size: 15px; margin: 0 0 8px; }
  h3 { color: #4b3b72; font-size: 11px; letter-spacing: .02em; margin: 8px 0 3px; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 2px 18px; font-size: 12.5px; }
  p { font-size: 12.5px; margin: 2px 0; line-height: 1.4; }
  ul { margin: 2px 0 0 16px; padding: 0; font-size: 12.5px; }
  li { margin: 1px 0; }
  .muted { color: #777; }
  @media screen {
    .page { box-shadow: 0 1px 2px -1px rgb(34 32 40 / 8%), 0 1px 3px 0 rgb(34 32 40 / 6%); }
  }
  @media print {
    html, body { background: white; padding: 0; }
    .print-toolbar { display: none; }
    .page { box-shadow: none; margin: 0; height: 297mm; width: 210mm; }
    .page-overflow { height: auto; min-height: 297mm; }
  }
</style></head>
<body>
  ${
    showPrintToolbar
      ? `<div class="print-toolbar">
    <p>Náhľad PDF je pripravený. Použite tlač a zvoľte uložiť ako PDF.</p>
    <button type="button" onclick="window.print()">Uložiť / tlačiť PDF</button>
  </div>`
      : ""
  }
  <template id="page-header-template">
    <header class="doc-header">
      <div class="doc-title">
        <h1>${esc(heading)}</h1>
        <p class="meta">${students.length} uchádzačov · <span data-page-meta></span> · ${esc(today)}</p>
      </div>
      <img class="brand-logo" src="/logo-main.webp" alt="Ludus" />
    </header>
  </template>
  <template id="card-template">${cards}</template>
  <template id="empty-template">
    <p class="muted">Nie sú vybraní žiadni študenti.</p>
  </template>
  <div id="pages" aria-label="PDF strany"></div>
  <script>
    (function () {
      var autoPrint = ${autoPrint ? "true" : "false"};
      var host = document.getElementById("pages");
      var headerTemplate = document.getElementById("page-header-template");
      var cardTemplate = document.getElementById("card-template");
      var emptyTemplate = document.getElementById("empty-template");

      function cloneChildren(template) {
        return Array.prototype.slice
          .call(template.content.children)
          .map(function (node) {
            return node.cloneNode(true);
          });
      }

      function createPage() {
        var page = document.createElement("section");
        var body = document.createElement("div");
        page.className = "page";
        body.className = "page-body";
        page.appendChild(headerTemplate.content.firstElementChild.cloneNode(true));
        page.appendChild(body);
        host.appendChild(page);
        return body;
      }

      function updatePageLabels() {
        var pages = Array.prototype.slice.call(host.querySelectorAll(".page"));
        pages.forEach(function (page, index) {
          var label = page.querySelector("[data-page-meta]");
          if (label) label.textContent = "strana " + (index + 1) + "/" + pages.length;
        });
      }

      function overflows(body) {
        return body.scrollHeight > body.clientHeight + 1;
      }

      function paginate() {
        if (!host || !headerTemplate || !cardTemplate) return;
        host.innerHTML = "";
        var cards = cloneChildren(cardTemplate);
        var body = createPage();

        if (cards.length === 0) {
          body.appendChild(emptyTemplate.content.firstElementChild.cloneNode(true));
          updatePageLabels();
          return;
        }

        cards.forEach(function (card) {
          body.appendChild(card);
          if (!overflows(body)) return;

          if (body.children.length > 1) {
            body.removeChild(card);
            body = createPage();
            body.appendChild(card);
          }

          if (overflows(body)) {
            body.closest(".page").classList.add("page-overflow");
          }
        });

        updatePageLabels();
      }

      paginate();
      window.addEventListener("load", function () {
        paginate();
        window.dispatchEvent(new Event("pdf-pages-ready"));
        if (autoPrint) {
          window.setTimeout(function () {
            window.print();
          }, 120);
        }
      });
    })();
  </script>
</body></html>`;
}

function pdfSectionHtml(section: CandidateFieldSection): string {
  if (section.lines) {
    return `<section class="section"><h3>${esc(section.title)}</h3><div class="grid">${section.lines
      .map(
        (line) =>
          `<span><b>${esc(line.label)}:</b> ${esc(line.value)}</span>`
      )
      .join("")}</div></section>`;
  }

  if (section.text) {
    return `<section class="section"><h3>${esc(section.title)}</h3><p>${esc(section.text)}</p></section>`;
  }

  if (section.items) {
    return `<section class="section"><h3>${esc(section.title)}</h3><ul>${section.items
      .map((item) => `<li>${esc(item)}</li>`)
      .join("")}</ul></section>`;
  }

  return "";
}

/** Open a print-ready window with the shortlist; the user saves it as PDF. */
export function printCandidatesPdf(
  students: Student[],
  heading = "Casting — uchádzači",
  fields: CandidateShareField[] = DEFAULT_CANDIDATE_SHARE_FIELDS
): boolean {
  if (students.length === 0) return false;
  const win = window.open("", "_blank");
  if (!win) {
    return false;
  }

  win.document.write(
    candidatePdfDocumentHtml(students, heading, fields, {
      showPrintToolbar: true,
    })
  );
  win.document.close();
  try {
    win.opener = null;
  } catch {
    // Some browsers do not allow changing opener after the new tab is created.
  }
  return true;
}
