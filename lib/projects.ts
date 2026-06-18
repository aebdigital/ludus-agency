// ─────────────────────────────────────────────────────────────────────────────
// Projekty (inscenácie). Základné sú pevne zadané; používateľské sa pridávajú
// cez dialóg a ukladajú do localStorage (viď lib/store.ts).
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectPhase =
  | "Konkurz"
  | "Na skúškach"
  | "Technický týždeň"
  | "Hrá sa"
  | "Archív";

export const PROJECT_PHASES: ProjectPhase[] = [
  "Konkurz",
  "Na skúškach",
  "Technický týždeň",
  "Hrá sa",
  "Archív",
];

export interface Project {
  id: string;
  title: string;
  phase: ProjectPhase;
  program: string;
  venue: string;
  dates: string;
  director: string;
  studentIds: string[];
  custom?: boolean;
  castFilled?: number;
  castTotal?: number;
}

export const baseProjects: Project[] = [
  { id: "P-01", title: "Bedári", phase: "Hrá sa", venue: "Hlavná scéna", dates: "12. – 28. jún 2026", director: "Katarína Baranová", program: "Muzikál", studentIds: [], castFilled: 32, castTotal: 32 },
  { id: "P-02", title: "Sen noci svätojánskej", phase: "Technický týždeň", venue: "Štúdiová scéna", dates: "3. – 11. júl 2026", director: "Tomáš Vavrinec", program: "Herectvo", studentIds: [], castFilled: 18, castTotal: 20 },
  { id: "P-03", title: "Jarná tanečná prehliadka", phase: "Na skúškach", venue: "Tanečná sála A", dates: "18. – 20. júl 2026", director: "Elena Hudecová", program: "Tanec", studentIds: [], castFilled: 24, castTotal: 24 },
  { id: "P-04", title: "Kabaret", phase: "Konkurz", venue: "Hlavná scéna", dates: "26. sep – 12. okt 2026", director: "Katarína Baranová", program: "Muzikál", studentIds: [], castFilled: 9, castTotal: 22 },
  { id: "P-05", title: "Sondheim revue", phase: "Konkurz", venue: "Štúdiová scéna", dates: "24. – 30. okt 2026", director: "Adam Tóth (študentské vedenie)", program: "Spev", studentIds: [], castFilled: 4, castTotal: 12 },
  { id: "P-06", title: "Macbeth", phase: "Archív", venue: "Hlavná scéna", dates: "14. – 23. nov 2025", director: "Tomáš Vavrinec", program: "Herectvo", studentIds: [], castFilled: 16, castTotal: 16 },
];

export const phaseVariant: Record<
  ProjectPhase,
  "default" | "gold" | "warning" | "success" | "secondary"
> = {
  Konkurz: "default",
  "Na skúškach": "gold",
  "Technický týždeň": "warning",
  "Hrá sa": "success",
  Archív: "secondary",
};
