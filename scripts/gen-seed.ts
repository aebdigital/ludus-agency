// Generates supabase/migrations/0002_ludus_seed.sql from the hardcoded demo data
// in lib/data.ts + lib/projects.ts. Run: npx --yes tsx scripts/gen-seed.ts
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { students } from "../lib/data";
import { baseProjects } from "../lib/projects";

const __dirname = dirname(fileURLToPath(import.meta.url));

function q(v: unknown): string {
  if (v === null || v === undefined || v === "") return "null";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function arr(a?: string[]): string {
  if (!a || a.length === 0) return "'{}'";
  const inner = a
    .map((s) => '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"')
    .join(",");
  return `'{${inner}}'`;
}

function detUuid(seed: string): string {
  const h = createHash("md5").update(seed).digest("hex");
  return `'${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(
    16,
    20
  )}-${h.slice(20, 32)}'`;
}

function insert(table: string, row: Record<string, string>, conflict: string) {
  const cols = Object.keys(row);
  return (
    `insert into public.${table} (${cols.join(", ")})\n` +
    `values (${cols.map((c) => row[c]).join(", ")})\n` +
    `on conflict ${conflict} do nothing;`
  );
}

const out: string[] = [];
out.push(
  "-- ============================================================================",
  "-- Ludus demo seed — generated from lib/data.ts + lib/projects.ts.",
  "-- Idempotent (on conflict do nothing). Run AFTER 0001_ludus_schema.sql.",
  "-- Apply in the Supabase SQL editor for project ngifengeshwvyzhqvprn.",
  "-- ============================================================================",
  "",
  "begin;",
  ""
);

// ── Students ────────────────────────────────────────────────────────────────
out.push("-- Students");
for (const s of students) {
  const row: Record<string, string> = {
    id: q(s.id),
    first_name: q(s.firstName),
    last_name: q(s.lastName),
    preferred_name: q(s.preferredName),
    pronouns: q(s.pronouns),
    gender: q(s.gender),
    date_of_birth: q(s.dateOfBirth),
    city: q(s.city),
    status: q(s.status),
    program: q(s.program),
    cohort: q(s.cohort),
    teacher: q(s.teacher),
    enrolled_on: q(s.enrolledOn),
    height_cm: q(s.heightCm),
    weight_kg: q(s.weightKg),
    eye_color: q(s.eyeColor),
    hair_color: q(s.hairColor),
    shoe_eu: q(s.shoeEu),
    clothing_size: q(s.clothingSize),
    voice_type: q(s.voiceType),
    skills: arr(s.skills),
    languages: arr(s.languages),
    casting_readiness: q(s.castingReadiness),
    phone: q(s.phone),
    email: q(s.email),
    guardian_name: q(s.guardianName),
    guardian_relation: q(s.guardianRelation),
    guardian_phone: q(s.guardianPhone),
    guardian_email: q(s.guardianEmail),
    emergency_contact: q(s.emergencyContact),
    bio: q(s.bio),
    tutor_note: q(s.tutorNote),
    school: q(s.school),
    guardian_email2: q(s.guardianEmail2),
    apparent_age: q(s.apparentAge),
    ethnicity: q(s.ethnicity),
    body_type: q(s.bodyType),
    hair_length: q(s.hairLength),
    hair_type: q(s.hairType),
    beard: q(s.beard),
    suit_size: q(s.suitSize),
    chest_circumference: q(s.chestCircumference),
    waist_circumference: q(s.waistCircumference),
    hips_circumference: q(s.hipsCircumference),
    head_circumference: q(s.headCircumference),
    neck_circumference: q(s.neckCircumference),
    voice_speak: q(s.voiceSpeak),
    distinctive_features: arr(s.distinctiveFeatures),
    handicaps: q(s.handicaps),
    instruments: arr(s.instruments),
    dance_styles: arr(s.danceStyles),
    sports: arr(s.sports),
    driving_licences: arr(s.drivingLicences),
    other_skills: q(s.otherSkills),
    other_talents: q(s.otherTalents),
    accent: q(s.accent),
    ig_followers: q(s.igFollowers),
    tt_followers: q(s.ttFollowers),
    yt_followers: q(s.ytFollowers),
    fb_followers: q(s.fbFollowers),
    url_web: q(s.urlWeb),
    url_ig: q(s.urlIg),
    url_tt: q(s.urlTt),
    url_yt: q(s.urlYt),
    url_fb: q(s.urlFb),
    url_li: q(s.urlLi),
    url_imdb: q(s.urlImdb),
    url_csfd: q(s.urlCsfd),
    url_idiv: q(s.urlIdiv),
  };
  out.push(insert("ludus_students", row, "(id)"), "");
}

// ── Documents ───────────────────────────────────────────────────────────────
out.push("-- Documents");
for (const s of students) {
  for (const d of s.documents) {
    out.push(
      insert(
        "ludus_documents",
        {
          id: detUuid(`${s.id}|doc|${d.id}`),
          student_id: q(s.id),
          name: q(d.name),
          kind: q(d.kind),
          status: q(d.status),
          uploaded_at: q(d.uploadedAt),
          size_kb: q(d.sizeKb),
          added_by: q(d.addedBy),
        },
        "(id)"
      )
    );
  }
}
out.push("");

// ── Media ───────────────────────────────────────────────────────────────────
out.push("-- Media");
for (const s of students) {
  for (const m of s.media) {
    out.push(
      insert(
        "ludus_media",
        {
          id: detUuid(`${s.id}|media|${m.id}`),
          student_id: q(s.id),
          title: q(m.title),
          kind: q(m.kind),
          captured_at: q(m.capturedAt),
          duration_sec: q(m.durationSec),
          tag: q(m.tag),
        },
        "(id)"
      )
    );
  }
}
out.push("");

// ── Projects ────────────────────────────────────────────────────────────────
out.push("-- Projects");
for (const p of baseProjects) {
  out.push(
    insert(
      "ludus_projects",
      {
        id: q(p.id),
        title: q(p.title),
        phase: q(p.phase),
        program: q(p.program),
        venue: q(p.venue),
        dates: q(p.dates),
        director: q(p.director),
        cast_filled: q(p.castFilled),
        cast_total: q(p.castTotal),
        custom: "false",
      },
      "(id)"
    )
  );
  // project cast links (base projects ship with empty studentIds, but handle it)
  for (const sid of p.studentIds) {
    out.push(
      insert(
        "ludus_project_cast",
        { project_id: q(p.id), student_id: q(sid) },
        "(project_id, student_id)"
      )
    );
  }
}

out.push("", "commit;", "");

const dest = join(__dirname, "..", "supabase", "migrations", "0002_ludus_seed.sql");
writeFileSync(dest, out.join("\n"));

const docCount = students.reduce((n, s) => n + s.documents.length, 0);
const mediaCount = students.reduce((n, s) => n + s.media.length, 0);
console.log(
  `Wrote ${dest}\n  students=${students.length} documents=${docCount} media=${mediaCount} projects=${baseProjects.length}`
);
