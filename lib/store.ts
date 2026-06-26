"use client";

import { useSyncExternalStore } from "react";
import {
  type Student,
  type MediaItem,
  type MediaKind,
  type StudentDocument,
  type DocumentKind,
} from "@/lib/data";
import { type Project } from "@/lib/projects";
import { supabase } from "@/lib/supabase/client";
import { signPaths, uploadFile, sanitizeName, randomId } from "@/lib/storage";
import { computeAge } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase-backed store. Same hook/function API as before, but data now lives in
// the ludus_* tables (shared project). Reads require an authenticated session
// (RLS), so the store (re)loads whenever auth state changes. Mutations update the
// local snapshot optimistically and persist in the background.
// ─────────────────────────────────────────────────────────────────────────────

type Row = Record<string, any>;

const EMPTY_STUDENTS: Student[] = [];
const EMPTY_PROJECTS: Project[] = [];

let studentsSnapshot: Student[] = EMPTY_STUDENTS;
let projectsSnapshot: Project[] = EMPTY_PROJECTS;
let loaded = false;

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function groupBy<T extends Row>(rows: T[], key: string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const r of rows) {
    (out[r[key]] ??= []).push(r);
  }
  return out;
}

// ── Mapping (DB snake_case ↔ app camelCase) ──────────────────────────────────

// Scalar/array student columns, keyed by the app field name.
const STUDENT_COLS: Record<string, string> = {
  firstName: "first_name",
  lastName: "last_name",
  preferredName: "preferred_name",
  pronouns: "pronouns",
  gender: "gender",
  dateOfBirth: "date_of_birth",
  city: "city",
  status: "status",
  program: "program",
  cohort: "cohort",
  teacher: "teacher",
  enrolledOn: "enrolled_on",
  heightCm: "height_cm",
  weightKg: "weight_kg",
  eyeColor: "eye_color",
  hairColor: "hair_color",
  shoeEu: "shoe_eu",
  clothingSize: "clothing_size",
  voiceType: "voice_type",
  skills: "skills",
  languages: "languages",
  castingReadiness: "casting_readiness",
  phone: "phone",
  email: "email",
  guardianName: "guardian_name",
  guardianRelation: "guardian_relation",
  guardianPhone: "guardian_phone",
  guardianEmail: "guardian_email",
  emergencyContact: "emergency_contact",
  bio: "bio",
  tutorNote: "tutor_note",
  school: "school",
  guardianEmail2: "guardian_email2",
  apparentAge: "apparent_age",
  ethnicity: "ethnicity",
  bodyType: "body_type",
  hairLength: "hair_length",
  hairType: "hair_type",
  beard: "beard",
  suitSize: "suit_size",
  chestCircumference: "chest_circumference",
  waistCircumference: "waist_circumference",
  hipsCircumference: "hips_circumference",
  headCircumference: "head_circumference",
  neckCircumference: "neck_circumference",
  voiceSpeak: "voice_speak",
  distinctiveFeatures: "distinctive_features",
  handicaps: "handicaps",
  instruments: "instruments",
  danceStyles: "dance_styles",
  sports: "sports",
  drivingLicences: "driving_licences",
  otherSkills: "other_skills",
  otherTalents: "other_talents",
  accent: "accent",
  igFollowers: "ig_followers",
  ttFollowers: "tt_followers",
  ytFollowers: "yt_followers",
  fbFollowers: "fb_followers",
  urlWeb: "url_web",
  urlIg: "url_ig",
  urlTt: "url_tt",
  urlYt: "url_yt",
  urlFb: "url_fb",
  urlLi: "url_li",
  urlImdb: "url_imdb",
  urlCsfd: "url_csfd",
  urlIdiv: "url_idiv",
};

function rowToStudent(
  r: Row,
  docs: Row[],
  media: Row[],
  signMap: Map<string, string>
): Student {
  return {
    id: r.id,
    firstName: r.first_name ?? "",
    lastName: r.last_name ?? "",
    preferredName: r.preferred_name ?? undefined,
    pronouns: r.pronouns ?? "",
    gender: r.gender ?? "Iné",
    dateOfBirth: r.date_of_birth ?? "",
    age: r.date_of_birth ? computeAge(r.date_of_birth) : 0,
    city: r.city ?? "",
    status: r.status,
    program: r.program,
    cohort: r.cohort ?? "",
    teacher: r.teacher ?? "",
    enrolledOn: r.enrolled_on ?? "",
    heightCm: r.height_cm ?? 0,
    weightKg: r.weight_kg ?? 0,
    eyeColor: r.eye_color ?? "Hnedá",
    hairColor: r.hair_color ?? "Hnedá",
    shoeEu: r.shoe_eu ?? 0,
    clothingSize: r.clothing_size ?? "M",
    voiceType: r.voice_type ?? undefined,
    skills: r.skills ?? [],
    languages: r.languages ?? [],
    castingReadiness: r.casting_readiness ?? 0,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    guardianName: r.guardian_name ?? "",
    guardianRelation: r.guardian_relation ?? "",
    guardianPhone: r.guardian_phone ?? "",
    guardianEmail: r.guardian_email ?? "",
    emergencyContact: r.emergency_contact ?? "",
    bio: r.bio ?? "",
    tutorNote: r.tutor_note ?? "",
    school: r.school ?? undefined,
    guardianEmail2: r.guardian_email2 ?? undefined,
    apparentAge: r.apparent_age ?? undefined,
    ethnicity: r.ethnicity ?? undefined,
    bodyType: r.body_type ?? undefined,
    hairLength: r.hair_length ?? undefined,
    hairType: r.hair_type ?? undefined,
    beard: r.beard ?? undefined,
    suitSize: r.suit_size ?? undefined,
    chestCircumference: r.chest_circumference ?? undefined,
    waistCircumference: r.waist_circumference ?? undefined,
    hipsCircumference: r.hips_circumference ?? undefined,
    headCircumference: r.head_circumference ?? undefined,
    neckCircumference: r.neck_circumference ?? undefined,
    voiceSpeak: r.voice_speak ?? undefined,
    distinctiveFeatures: r.distinctive_features ?? undefined,
    handicaps: r.handicaps ?? undefined,
    instruments: r.instruments ?? undefined,
    danceStyles: r.dance_styles ?? undefined,
    sports: r.sports ?? undefined,
    drivingLicences: r.driving_licences ?? undefined,
    otherSkills: r.other_skills ?? undefined,
    otherTalents: r.other_talents ?? undefined,
    accent: r.accent ?? undefined,
    igFollowers: r.ig_followers ?? undefined,
    ttFollowers: r.tt_followers ?? undefined,
    ytFollowers: r.yt_followers ?? undefined,
    fbFollowers: r.fb_followers ?? undefined,
    urlWeb: r.url_web ?? undefined,
    urlIg: r.url_ig ?? undefined,
    urlTt: r.url_tt ?? undefined,
    urlYt: r.url_yt ?? undefined,
    urlFb: r.url_fb ?? undefined,
    urlLi: r.url_li ?? undefined,
    urlImdb: r.url_imdb ?? undefined,
    urlCsfd: r.url_csfd ?? undefined,
    urlIdiv: r.url_idiv ?? undefined,
    photoPath: r.photo_path ?? undefined,
    photoUrl: r.photo_path ? signMap.get(r.photo_path) : undefined,
    documents: docs.map((d) => ({
      id: d.id,
      name: d.name,
      kind: d.kind,
      status: d.status,
      uploadedAt: d.uploaded_at ?? "",
      sizeKb: d.size_kb ?? 0,
      addedBy: d.added_by ?? "",
      url: d.storage_path ? signMap.get(d.storage_path) : undefined,
    })),
    media: media.map((m) => ({
      id: m.id,
      title: m.title,
      kind: m.kind,
      capturedAt: m.captured_at ?? "",
      durationSec: m.duration_sec ?? undefined,
      tag: m.tag ?? "",
      url: m.storage_path ? signMap.get(m.storage_path) : undefined,
    })),
  };
}

// Maps a partial Student (camelCase) to a DB row, coercing "" → null.
function studentPatchToRow(patch: Partial<Student>): Row {
  const row: Row = {};
  for (const [field, col] of Object.entries(STUDENT_COLS)) {
    if (field in patch) {
      const v = (patch as Row)[field];
      row[col] = v === undefined || v === "" ? null : v;
    }
  }
  return row;
}

function rowToProject(r: Row, studentIds: string[]): Project {
  return {
    id: r.id,
    title: r.title,
    phase: r.phase,
    program: r.program ?? "",
    venue: r.venue ?? "",
    dates: r.dates ?? "",
    director: r.director ?? "",
    studentIds,
    mainStudentId: r.main_student_id ?? undefined,
    custom: r.custom ?? false,
    castFilled: r.cast_filled ?? undefined,
    castTotal: r.cast_total ?? undefined,
  };
}

// ── Loading ──────────────────────────────────────────────────────────────────

let inFlight = false;

async function loadAll() {
  if (inFlight) return;
  inFlight = true;
  try {
    const [stu, docs, media, proj, cast] = await Promise.all([
      supabase.from("ludus_students").select("*").order("id"),
      supabase.from("ludus_documents").select("*"),
      supabase.from("ludus_media").select("*"),
      supabase
        .from("ludus_projects")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("ludus_project_cast").select("*"),
    ]);

    if (stu.error) console.error("load students:", stu.error.message);
    if (proj.error) console.error("load projects:", proj.error.message);

    const docsBy = groupBy(docs.data ?? [], "student_id");
    const medBy = groupBy(media.data ?? [], "student_id");

    // Sign all storage paths in one batch for display/download.
    const paths: string[] = [];
    for (const r of stu.data ?? []) if (r.photo_path) paths.push(r.photo_path);
    for (const d of docs.data ?? []) if (d.storage_path) paths.push(d.storage_path);
    for (const m of media.data ?? []) if (m.storage_path) paths.push(m.storage_path);
    const signMap = await signPaths(paths);

    studentsSnapshot = (stu.data ?? []).map((r) =>
      rowToStudent(r, docsBy[r.id] ?? [], medBy[r.id] ?? [], signMap)
    );

    const castBy = groupBy(cast.data ?? [], "project_id");
    projectsSnapshot = (proj.data ?? []).map((r) =>
      rowToProject(r, (castBy[r.id] ?? []).map((c) => c.student_id))
    );

    loaded = true;
    emit();
  } finally {
    inFlight = false;
  }
}

let wired = false;
function wireAuthAndLoad() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  // Fires INITIAL_SESSION immediately, then on SIGNED_IN / SIGNED_OUT.
  // Defer supabase calls out of the callback (recommended) to avoid deadlocks.
  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      studentsSnapshot = EMPTY_STUDENTS;
      projectsSnapshot = EMPTY_PROJECTS;
      loaded = false;
      emit();
      return;
    }
    setTimeout(() => loadAll(), 0);
  });
}

function subscribe(cb: () => void) {
  wireAuthAndLoad();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function addStudent(s: Student) {
  studentsSnapshot = [s, ...studentsSnapshot];
  emit();
  supabase
    .from("ludus_students")
    .insert({ id: s.id, ...studentPatchToRow(s) })
    .then(({ error }) => {
      if (error) {
        console.error("addStudent:", error.message);
        studentsSnapshot = studentsSnapshot.filter((x) => x.id !== s.id);
        emit();
      }
    });
}

export function updateStudent(id: string, patch: Partial<Student>) {
  studentsSnapshot = studentsSnapshot.map((s) =>
    s.id === id ? { ...s, ...patch } : s
  );
  emit();
  const row = studentPatchToRow(patch);
  if (Object.keys(row).length) {
    supabase
      .from("ludus_students")
      .update(row)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("updateStudent:", error.message);
      });
  }
}

export function addProject(p: Project) {
  projectsSnapshot = [p, ...projectsSnapshot];
  emit();
  supabase
    .from("ludus_projects")
    .insert({
      id: p.id,
      title: p.title,
      phase: p.phase,
      program: p.program,
      venue: p.venue,
      dates: p.dates,
      director: p.director,
      main_student_id: p.mainStudentId ?? null,
      cast_filled: p.castFilled ?? null,
      cast_total: p.castTotal ?? null,
      custom: p.custom ?? true,
    })
    .then(async ({ error }) => {
      if (error) {
        console.error("addProject:", error.message);
        projectsSnapshot = projectsSnapshot.filter((x) => x.id !== p.id);
        emit();
        return;
      }
      if (p.studentIds.length) {
        const { error: castErr } = await supabase
          .from("ludus_project_cast")
          .insert(p.studentIds.map((sid) => ({ project_id: p.id, student_id: sid })));
        if (castErr) console.error("addProject cast:", castErr.message);
      }
    });
}

export function updateProject(id: string, patch: Partial<Project>) {
  projectsSnapshot = projectsSnapshot.map((p) =>
    p.id === id ? { ...p, ...patch } : p
  );
  emit();

  const row: Row = {};
  if ("title" in patch) row.title = patch.title;
  if ("phase" in patch) row.phase = patch.phase;
  if ("program" in patch) row.program = patch.program;
  if ("venue" in patch) row.venue = patch.venue;
  if ("dates" in patch) row.dates = patch.dates;
  if ("director" in patch) row.director = patch.director;
  if ("mainStudentId" in patch) row.main_student_id = patch.mainStudentId ?? null;
  if ("castFilled" in patch) row.cast_filled = patch.castFilled ?? null;
  if ("castTotal" in patch) row.cast_total = patch.castTotal ?? null;
  if (Object.keys(row).length) {
    supabase
      .from("ludus_projects")
      .update(row)
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("updateProject:", error.message);
      });
  }

  if ("studentIds" in patch && patch.studentIds) {
    syncCast(id, patch.studentIds);
  }
}

async function syncCast(projectId: string, studentIds: string[]) {
  const del = await supabase
    .from("ludus_project_cast")
    .delete()
    .eq("project_id", projectId);
  if (del.error) {
    console.error("syncCast delete:", del.error.message);
    return;
  }
  if (studentIds.length) {
    const ins = await supabase
      .from("ludus_project_cast")
      .insert(studentIds.map((sid) => ({ project_id: projectId, student_id: sid })));
    if (ins.error) console.error("syncCast insert:", ins.error.message);
  }
}

// ── Uploads (Supabase Storage) ───────────────────────────────────────────────

async function sessionEmail(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? "—";
}

export async function setStudentPhoto(
  studentId: string,
  file: File
): Promise<{ error?: string }> {
  const path = `students/${studentId}/photo-${Date.now()}-${sanitizeName(file.name)}`;
  const up = await uploadFile(path, file);
  if (up.error) return { error: up.error };

  const { error } = await supabase
    .from("ludus_students")
    .update({ photo_path: path })
    .eq("id", studentId);
  if (error) {
    console.error("setStudentPhoto:", error.message);
    return { error: error.message };
  }

  const url = (await signPaths([path])).get(path);
  studentsSnapshot = studentsSnapshot.map((s) =>
    s.id === studentId ? { ...s, photoPath: path, photoUrl: url } : s
  );
  emit();
  return {};
}

export async function addStudentMedia(
  studentId: string,
  file: File
): Promise<{ error?: string }> {
  const kind: MediaKind = file.type.startsWith("image/")
    ? "Foto z predstavenia"
    : "Konkurzné video";
  const path = `students/${studentId}/media/${randomId()}-${sanitizeName(file.name)}`;
  const up = await uploadFile(path, file);
  if (up.error) return { error: up.error };

  const capturedAt = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("ludus_media")
    .insert({
      student_id: studentId,
      title: file.name,
      kind,
      captured_at: capturedAt,
      tag: "Nahrané",
      storage_path: path,
    })
    .select()
    .single();
  if (error) {
    console.error("addStudentMedia:", error.message);
    return { error: error.message };
  }

  const url = (await signPaths([path])).get(path);
  const item: MediaItem = { id: data.id, title: file.name, kind, capturedAt, tag: "Nahrané", url };
  studentsSnapshot = studentsSnapshot.map((s) =>
    s.id === studentId ? { ...s, media: [item, ...s.media] } : s
  );
  emit();
  return {};
}

export async function addStudentDocument(
  studentId: string,
  file: File,
  kind: DocumentKind
): Promise<{ error?: string }> {
  const path = `students/${studentId}/docs/${randomId()}-${sanitizeName(file.name)}`;
  const up = await uploadFile(path, file);
  if (up.error) return { error: up.error };

  const uploadedAt = new Date().toISOString().slice(0, 10);
  const sizeKb = Math.max(1, Math.round(file.size / 1024));
  const addedBy = await sessionEmail();
  const { data, error } = await supabase
    .from("ludus_documents")
    .insert({
      student_id: studentId,
      name: file.name,
      kind,
      status: "Podpísané",
      uploaded_at: uploadedAt,
      size_kb: sizeKb,
      added_by: addedBy,
      storage_path: path,
    })
    .select()
    .single();
  if (error) {
    console.error("addStudentDocument:", error.message);
    return { error: error.message };
  }

  const url = (await signPaths([path])).get(path);
  const item: StudentDocument = {
    id: data.id,
    name: file.name,
    kind,
    status: "Podpísané",
    uploadedAt,
    sizeKb,
    addedBy,
    url,
  };
  studentsSnapshot = studentsSnapshot.map((s) =>
    s.id === studentId ? { ...s, documents: [item, ...s.documents] } : s
  );
  emit();
  return {};
}

export function nextStudentId(): string {
  let max = 1041;
  for (const s of studentsSnapshot) {
    const n = parseInt(s.id.replace(/\D/g, ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `STU-${max + 1}`;
}

export function nextProjectId(): string {
  return `P-${Date.now().toString().slice(-6)}`;
}

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useStudents(): Student[] {
  return useSyncExternalStore(
    subscribe,
    () => studentsSnapshot,
    () => EMPTY_STUDENTS
  );
}

export function useProjects(): Project[] {
  return useSyncExternalStore(
    subscribe,
    () => projectsSnapshot,
    () => EMPTY_PROJECTS
  );
}

export function useStudent(id: string): Student | undefined {
  return useStudents().find((s) => s.id === id);
}

export function useStudentProjects(id: string): Project[] {
  return useProjects().filter((p) => p.studentIds.includes(id));
}

// True once the first load from Supabase has completed (used to distinguish
// "still loading" from "not found").
export function useStoreLoaded(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => loaded,
    () => false
  );
}
