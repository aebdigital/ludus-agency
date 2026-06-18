// ─────────────────────────────────────────────────────────────────────────────
// Honoráre žiakov — pevne zadané ukážkové dáta.
// Jednorazový = jedna platba (checkbox). Mesačný = opakujúci sa honorár,
// kde sa pridávajú jednotlivé mesiace a každý sa potvrdzuje cez checkbox.
// ─────────────────────────────────────────────────────────────────────────────

export type FeeType = "Jednorazový" | "Mesačný";

export interface FeeMonth {
  label: string; // napr. "jan '26"
  paid: boolean;
}

export interface Fee {
  id: string;
  project: string;
  type: FeeType;
  amount: number; // € za platbu / za mesiac
  paid?: boolean; // pre jednorazový
  months?: FeeMonth[]; // pre mesačný
}

const m = (label: string, paid: boolean): FeeMonth => ({ label, paid });

export const feesByStudent: Record<string, Fee[]> = {
  "STU-1042": [
    {
      id: "h1",
      project: "Bedári",
      type: "Mesačný",
      amount: 180,
      months: [m("sep '25", true), m("okt '25", true), m("nov '25", true), m("dec '25", true), m("jan '26", false)],
    },
    { id: "h2", project: "Kabaret", type: "Jednorazový", amount: 250, paid: false },
  ],
  "STU-1043": [
    {
      id: "h1",
      project: "Sen noci svätojánskej",
      type: "Mesačný",
      amount: 150,
      months: [m("okt '25", true), m("nov '25", true), m("dec '25", false)],
    },
    { id: "h2", project: "Macbeth", type: "Jednorazový", amount: 200, paid: true },
  ],
  "STU-1044": [
    {
      id: "h1",
      project: "Jarná tanečná prehliadka",
      type: "Mesačný",
      amount: 120,
      months: [m("jan '26", true), m("feb '26", true), m("mar '26", false)],
    },
  ],
  "STU-1045": [
    {
      id: "h1",
      project: "Sen noci svätojánskej",
      type: "Mesačný",
      amount: 140,
      months: [m("nov '25", true), m("dec '25", true), m("jan '26", false)],
    },
  ],
  "STU-1046": [
    {
      id: "h1",
      project: "Kabaret",
      type: "Mesačný",
      amount: 100,
      months: [m("sep '25", true), m("okt '25", false)],
    },
  ],
  "STU-1047": [
    { id: "h1", project: "Macbeth", type: "Jednorazový", amount: 220, paid: true },
    { id: "h2", project: "Bedári", type: "Jednorazový", amount: 180, paid: false },
  ],
  "STU-1048": [
    {
      id: "h1",
      project: "Sondheim revue",
      type: "Mesačný",
      amount: 160,
      months: [m("feb '26", true), m("mar '26", true), m("apr '26", true)],
    },
  ],
  "STU-1049": [
    {
      id: "h1",
      project: "Bedári",
      type: "Mesačný",
      amount: 170,
      months: [m("okt '25", true), m("nov '25", true), m("dec '25", true), m("jan '26", false)],
    },
    { id: "h2", project: "Jarná tanečná prehliadka", type: "Jednorazový", amount: 150, paid: false },
  ],
  "STU-1050": [
    {
      id: "h1",
      project: "Sen noci svätojánskej",
      type: "Mesačný",
      amount: 110,
      months: [m("dec '25", true), m("jan '26", false)],
    },
  ],
  "STU-1051": [
    {
      id: "h1",
      project: "Sondheim revue",
      type: "Mesačný",
      amount: 170,
      months: [m("jan '26", true), m("feb '26", true), m("mar '26", true), m("apr '26", false)],
    },
  ],
  "STU-1052": [
    {
      id: "h1",
      project: "Jarná tanečná prehliadka",
      type: "Mesačný",
      amount: 130,
      months: [m("feb '26", true), m("mar '26", false)],
    },
  ],
  "STU-1053": [
    { id: "h1", project: "Kabaret", type: "Jednorazový", amount: 160, paid: false },
  ],
};

export function getFees(studentId: string): Fee[] {
  return feesByStudent[studentId] ?? [];
}

// Skratky mesiacov pre generovanie ďalšieho mesiaca cez tlačidlo „+".
export const MONTHS_SK = [
  "jan", "feb", "mar", "apr", "máj", "jún",
  "júl", "aug", "sep", "okt", "nov", "dec",
];

export function nextMonthLabel(last?: string): string {
  if (!last) return "jan '26";
  const [mon, yr] = last.split(" '");
  let mi = MONTHS_SK.indexOf(mon);
  let y = parseInt(yr, 10);
  mi += 1;
  if (mi > 11) {
    mi = 0;
    y += 1;
  }
  return `${MONTHS_SK[mi]} '${String(y).padStart(2, "0")}`;
}
