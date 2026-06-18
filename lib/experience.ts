// ─────────────────────────────────────────────────────────────────────────────
// Predchádzajúce projekty žiakov (timeline „Skúsenosti") — pevne zadané dáta.
// Zoradené od najnovších po najstaršie.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExperienceItem {
  year: string;
  title: string;
  role: string;
  org?: string;
}

export const experienceByStudent: Record<string, ExperienceItem[]> = {
  "STU-1042": [
    { year: "2025", title: "Bedári", role: "Fantine (alternácia)", org: "Hlavná scéna" },
    { year: "2024", title: "Kabaret", role: "Sally Bowles", org: "Štúdiová scéna" },
    { year: "2023", title: "Mačky", role: "Ansámbel", org: "Hlavná scéna" },
  ],
  "STU-1043": [
    { year: "2025", title: "Macbeth", role: "Macduff", org: "Hlavná scéna" },
    { year: "2024", title: "Naše mestečko", role: "George Gibbs", org: "Štúdiová scéna" },
  ],
  "STU-1044": [
    { year: "2026", title: "Jarná tanečná prehliadka", role: "Sólo", org: "Tanečná sála A" },
    { year: "2025", title: "Luskáčik", role: "Snehová víla", org: "Hlavná scéna" },
  ],
  "STU-1045": [
    { year: "2026", title: "Sen noci svätojánskej", role: "Puk", org: "Štúdiová scéna" },
    { year: "2025", title: "Autorská inscenácia „Nite“", role: "Devising / účinkujúci", org: "Štúdio" },
  ],
  "STU-1046": [
    { year: "2025", title: "Školský muzikál", role: "Ansámbel", org: "ZUŠ" },
  ],
  "STU-1047": [
    { year: "2025", title: "Macbeth", role: "Svetelný dizajn", org: "Hlavná scéna" },
    { year: "2024", title: "Bedári", role: "Asistent osvetľovača", org: "Hlavná scéna" },
  ],
  "STU-1048": [
    { year: "2025", title: "Absolventský koncert", role: "Sólistka", org: "Hlavná scéna" },
    { year: "2024", title: "Jazzový večer", role: "Speváčka", org: "Klub" },
    { year: "2023", title: "Carmen (výber)", role: "Zbor", org: "Hlavná scéna" },
  ],
  "STU-1049": [
    { year: "2025", title: "42. ulica", role: "Billy Lawlor", org: "Hlavná scéna" },
    { year: "2024", title: "Bedári", role: "Gavroche", org: "Hlavná scéna" },
  ],
  "STU-1050": [
    { year: "2026", title: "Sen noci svätojánskej", role: "Hermia", org: "Štúdiová scéna" },
    { year: "2025", title: "Improšou", role: "Účinkujúca", org: "Štúdio" },
  ],
  "STU-1051": [
    { year: "2026", title: "Áriový koncert", role: "Sólista", org: "Hlavná scéna" },
    { year: "2025", title: "Sondheim revue", role: "Sólista", org: "Štúdiová scéna" },
  ],
  "STU-1052": [
    { year: "2025", title: "Zimná gala", role: "Pas de deux", org: "Hlavná scéna" },
    { year: "2024", title: "Labutie jazero (výber)", role: "Zbor", org: "Hlavná scéna" },
  ],
  "STU-1053": [
    { year: "2025", title: "Videoprojekcie pre ZUŠ", role: "Projekcia", org: "ZUŠ" },
  ],
};

export function getExperience(studentId: string): ExperienceItem[] {
  return experienceByStudent[studentId] ?? [];
}
