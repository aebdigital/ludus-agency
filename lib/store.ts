"use client";

import { useSyncExternalStore } from "react";
import { students as baseStudents, type Student } from "@/lib/data";
import type { Project } from "@/lib/projects";

const SKEY = "ludus.students.v1";
const PKEY = "ludus.projects.v1";

const EMPTY_PROJECTS: Project[] = [];

let customStudents: Student[] = [];
let customProjects: Project[] = [];
let loaded = false;

let studentsSnapshot: Student[] = baseStudents;
let projectsSnapshot: Project[] = EMPTY_PROJECTS;

const listeners = new Set<() => void>();

function recompute() {
  studentsSnapshot = customStudents.length
    ? [...customStudents, ...baseStudents]
    : baseStudents;
  projectsSnapshot = customProjects.length ? customProjects : EMPTY_PROJECTS;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  try {
    customStudents = JSON.parse(localStorage.getItem(SKEY) || "[]");
  } catch {
    customStudents = [];
  }
  try {
    customProjects = JSON.parse(localStorage.getItem(PKEY) || "[]");
  } catch {
    customProjects = [];
  }
  loaded = true;
  recompute();
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  if (!loaded) {
    load();
    // notify in case data was loaded from storage on first subscribe
    queueMicrotask(emit);
  }
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === SKEY || e.key === PKEY) {
      loaded = false;
      load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function addStudent(s: Student) {
  load();
  customStudents = [s, ...customStudents];
  if (typeof window !== "undefined") {
    localStorage.setItem(SKEY, JSON.stringify(customStudents));
  }
  recompute();
  emit();
}

export function addProject(p: Project) {
  load();
  customProjects = [p, ...customProjects];
  if (typeof window !== "undefined") {
    localStorage.setItem(PKEY, JSON.stringify(customProjects));
  }
  recompute();
  emit();
}

export function nextStudentId(): string {
  load();
  const all = [...baseStudents, ...customStudents];
  let max = 1041;
  for (const s of all) {
    const n = parseInt(s.id.replace(/\D/g, ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `STU-${max + 1}`;
}

export function nextProjectId(): string {
  load();
  return `P-${Date.now().toString().slice(-6)}`;
}

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useStudents(): Student[] {
  return useSyncExternalStore(
    subscribe,
    () => studentsSnapshot,
    () => baseStudents
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
