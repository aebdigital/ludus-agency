// ─────────────────────────────────────────────────────────────────────────────
// Pevne zadané ukážkové dáta pre databázu študentov divadelnej školy Ludus.
// V produkčnej verzii by tieto dáta prichádzali z API / databázy.
// ─────────────────────────────────────────────────────────────────────────────

import { computeAge } from "./utils";

export type Program = "Reklama" | "Film/seriál" | "Iné";

export type Status = "Aktívny" | "Konkurz" | "Neaktívny";

export type DocumentKind =
  | "Súhlas rodiča"
  | "Lekárske tlačivo"
  | "Súhlas s fotami a videom"
  | "Zmluva o štúdiu"
  | "Vysvedčenie"
  | "Štipendium";

export type DocStatus = "Podpísané" | "Čaká sa" | "Vypršané";

export interface StudentDocument {
  id: string;
  name: string;
  kind: DocumentKind;
  status: DocStatus;
  uploadedAt: string;
  sizeKb: number;
  addedBy: string;
}

export type MediaKind =
  | "Portrét"
  | "Foto z predstavenia"
  | "Konkurzné video"
  | "Video z predstavenia";

export interface MediaItem {
  id: string;
  title: string;
  kind: MediaKind;
  capturedAt: string;
  durationSec?: number; // iba videá
  tag: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  pronouns: string;
  gender: "Chlapec" | "Dievča" | "Iné";
  dateOfBirth: string;
  age: number;
  city: string;
  status: Status;
  program: Program;
  cohort: string;
  teacher: string;
  enrolledOn: string;
  // Atribúty pre obsadenie / fyzické
  heightCm: number;
  weightKg: number;
  eyeColor: "Hnedá" | "Modrá" | "Zelená" | "Liesková" | "Jantárová" | "Sivá";
  hairColor: "Čierna" | "Hnedá" | "Blond" | "Ryšavá" | "Gaštanová" | "Sivá";
  shoeEu: number;
  clothingSize: "XS" | "S" | "M" | "L" | "XL";
  voiceType?: "Soprán" | "Mezzosoprán" | "Alt" | "Tenor" | "Barytón" | "Bas";
  // Zručnosti a obsadzovanie
  skills: string[];
  languages: string[];
  castingReadiness: number; // 0-100
  // Vlastný kontakt dieťaťa (nepovinné)
  phone?: string;
  email?: string;
  // Rodič / kontakt
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
  // Voľný text
  bio: string;
  tutorNote: string;
  // Prílohy
  documents: StudentDocument[];
  media: MediaItem[];
}

function doc(
  id: string,
  name: string,
  kind: DocumentKind,
  status: DocStatus,
  uploadedAt: string,
  sizeKb: number,
  addedBy: string
): StudentDocument {
  return { id, name, kind, status, uploadedAt, sizeKb, addedBy };
}

function media(
  id: string,
  title: string,
  kind: MediaKind,
  capturedAt: string,
  tag: string,
  durationSec?: number
): MediaItem {
  return { id, title, kind, capturedAt, tag, durationSec };
}

export const students: Student[] = [
  {
    id: "STU-1042",
    teacher: "Mgr. art Katarína Baranová ArtD.",
    firstName: "Amélia",
    lastName: "Nováková",
    preferredName: "Amka",
    pronouns: "ona",
    gender: "Dievča",
    dateOfBirth: "2008-03-14",
    age: 18,
    city: "Bratislava",
    status: "Aktívny",
    program: "Reklama",
    cohort: "3. ročník · Súbor A",
    enrolledOn: "2022-09-01",
    heightCm: 168,
    weightKg: 56,
    eyeColor: "Zelená",
    hairColor: "Gaštanová",
    shoeEu: 39,
    clothingSize: "S",
    voiceType: "Soprán",
    skills: ["Belt spev", "Balet", "Javiskový súboj", "Improvizácia"],
    languages: ["Slovenčina", "Angličtina", "Nemčina"],
    castingReadiness: 92,
    guardianName: "Jana Nováková",
    guardianRelation: "Matka",
    guardianPhone: "+421 905 112 334",
    guardianEmail: "jana.novakova@email.sk",
    emergencyContact: "Peter Novák · +421 905 998 221",
    bio: "Všestranná predstaviteľka hlavných úloh s jasným sopránom. Amélia exceluje v muzikálových číslach a odniesla tri inscenácie na hlavnej scéne.",
    tutorNote:
      "Pripravená na konkurzy na hlavné úlohy. Pokračovať v práci na výslovnosti pri anglickom repertoári.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-02", 184, "Kancelária"),
      doc("D-2", "Lekárske potvrdenie.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-04", 256, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-09-02", 142, "Kancelária"),
      doc("D-4", "Zmluva o štúdiu 3.r.pdf", "Zmluva o štúdiu", "Podpísané", "2025-08-28", 320, "Študijné"),
      doc("D-5", "Vysvedčenie - jar.pdf", "Vysvedčenie", "Podpísané", "2026-02-12", 96, "M. Kováč"),
    ],
    media: [
      media("M-1", "Portrét — jeseň 2025", "Portrét", "2025-10-01", "Promo"),
      media("M-2", "Bedári — 2. dejstvo", "Foto z predstavenia", "2025-12-14", "Hlavná scéna"),
      media("M-3", "Konkurzné video — Sondheim", "Konkurzné video", "2026-01-20", "Konkurz", 142),
      media("M-4", "Kabaret — sólo", "Video z predstavenia", "2025-12-15", "Hlavná scéna", 215),
      media("M-5", "Tanečný intenzív", "Foto z predstavenia", "2026-03-02", "Štúdio"),
    ],
  },
  {
    id: "STU-1043",
    teacher: "Mgr. art Michal Rovňák",
    firstName: "Lukáš",
    lastName: "Polák",
    pronouns: "on",
    gender: "Chlapec",
    dateOfBirth: "2009-07-22",
    age: 16,
    city: "Trenčín",
    status: "Aktívny",
    program: "Film/seriál",
    cohort: "2. ročník · Súbor B",
    enrolledOn: "2023-09-01",
    heightCm: 179,
    weightKg: 68,
    eyeColor: "Modrá",
    hairColor: "Blond",
    shoeEu: 43,
    clothingSize: "M",
    voiceType: "Barytón",
    skills: ["Klasický text", "Javiskový súboj", "Práca s maskou"],
    languages: ["Slovenčina", "Angličtina", "Nemčina"],
    castingReadiness: 74,
    guardianName: "Marek Polák",
    guardianRelation: "Otec",
    guardianPhone: "+421 905 412 778",
    guardianEmail: "marek.polak@email.sk",
    emergencyContact: "Eva Poláková · +421 905 771 020",
    bio: "Silný dramatický herec s prirodzeným zvládnutím klasického textu. Vyniká v súborových a záporných úlohách.",
    tutorNote:
      "Pracovať na hlasovej projekcii vo väčších priestoroch. Treba obnoviť súhlas s fotením.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-05", 180, "Kancelária"),
      doc("D-2", "Lekárske tlačivo.pdf", "Lekárske tlačivo", "Čaká sa", "2025-09-10", 240, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Vypršané", "2024-09-01", 138, "Kancelária"),
      doc("D-4", "Zmluva o štúdiu 2.r.pdf", "Zmluva o štúdiu", "Podpísané", "2025-08-30", 312, "Študijné"),
    ],
    media: [
      media("M-1", "Portrét — jar 2026", "Portrét", "2026-03-10", "Promo"),
      media("M-2", "Macbeth — hostina", "Foto z predstavenia", "2025-11-22", "Hlavná scéna"),
      media("M-3", "Monológ (video)", "Konkurzné video", "2026-02-05", "Konkurz", 98),
    ],
  },
  {
    id: "STU-1044",
    teacher: "Mgr. art Mirka Durná ArtD.",
    firstName: "Žofia",
    lastName: "Rišková",
    pronouns: "ona",
    gender: "Dievča",
    dateOfBirth: "2010-11-03",
    age: 15,
    city: "Nitra",
    status: "Aktívny",
    program: "Reklama",
    cohort: "1. ročník · Základy",
    enrolledOn: "2024-09-01",
    heightCm: 162,
    weightKg: 49,
    eyeColor: "Hnedá",
    hairColor: "Čierna",
    shoeEu: 38,
    clothingSize: "XS",
    skills: ["Súčasný tanec", "Jazz", "Tanec na špičkách", "Choreografia"],
    languages: ["Slovenčina", "Angličtina"],
    castingReadiness: 81,
    guardianName: "Gabriela Rišková",
    guardianRelation: "Matka",
    guardianPhone: "+421 903 884 221",
    guardianEmail: "gabriela.riskova@email.sk",
    emergencyContact: "Marek Riško · +421 903 119 552",
    bio: "Talentovaná tanečnica súčasného tanca s výnimočnou flexibilitou a javiskovým prejavom nad jej vek.",
    tutorNote:
      "Vynikajúca technika. Podporiť účasť na choreografii jarnej prehliadky.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-01", 176, "Kancelária"),
      doc("D-2", "Lekárske potvrdenie.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-03", 248, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-09-01", 140, "Kancelária"),
      doc("D-4", "Rozhodnutie o štipendiu.pdf", "Štipendium", "Podpísané", "2025-07-15", 88, "Riaditeľka"),
    ],
    media: [
      media("M-1", "Portrét — jeseň 2025", "Portrét", "2025-09-28", "Promo"),
      media("M-2", "Súčasné sólo", "Video z predstavenia", "2026-01-30", "Prehliadka", 184),
      media("M-3", "Štúdiová skúška", "Foto z predstavenia", "2026-02-18", "Štúdio"),
      media("M-4", "Jarná prehliadka", "Foto z predstavenia", "2026-04-05", "Hlavná scéna"),
    ],
  },
  {
    id: "STU-1045",
    teacher: "Mgr. art Soňa Borušovičová",
    firstName: "Saša",
    lastName: "Lukáč",
    pronouns: "oni",
    gender: "Iné",
    dateOfBirth: "2007-05-19",
    age: 19,
    city: "Trnava",
    status: "Aktívny",
    program: "Film/seriál",
    cohort: "4. ročník · Maturitný",
    enrolledOn: "2021-09-01",
    heightCm: 174,
    weightKg: 63,
    eyeColor: "Liesková",
    hairColor: "Hnedá",
    shoeEu: 42,
    clothingSize: "M",
    voiceType: "Tenor",
    skills: ["Autorské divadlo", "Verbatim", "Prízvuky a dialekty", "Bábkoherectvo"],
    languages: ["Slovenčina", "Angličtina", "Francúzština"],
    castingReadiness: 88,
    guardianName: "Plnoletý",
    guardianRelation: "—",
    guardianPhone: "+421 944 900 145",
    guardianEmail: "sasa.lukac@email.sk",
    emergencyContact: "Klára Lukáčová · +421 944 900 980",
    bio: "Vynaliezavý, fyzicky expresívny performer so zameraním na autorskú a experimentálnu tvorbu. Prirodzený tímový hráč.",
    tutorNote:
      "Pripravuje absolventské portfólio. Silný kandidát na agentúrnu prehliadku.",
    documents: [
      doc("D-1", "Zmluva o štúdiu 4.r.pdf", "Zmluva o štúdiu", "Podpísané", "2025-08-25", 330, "Študijné"),
      doc("D-2", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-09-02", 144, "Kancelária"),
      doc("D-3", "Lekárske tlačivo.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-06", 252, "Kancelária"),
      doc("D-4", "Záverečné hodnotenie.pdf", "Vysvedčenie", "Podpísané", "2026-05-01", 104, "Pedagóg"),
    ],
    media: [
      media("M-1", "Portrét — promócia", "Portrét", "2026-04-20", "Promo"),
      media("M-2", "Autorská inscenácia — 'Nite'", "Video z predstavenia", "2026-03-12", "Štúdio", 320),
      media("M-3", "Prezentačné video", "Konkurzné video", "2026-05-08", "Konkurz", 165),
      media("M-4", "Foto súboru", "Foto z predstavenia", "2026-02-28", "Hlavná scéna"),
    ],
  },
  {
    id: "STU-1046",
    teacher: "Mgr. art Lenka Libjaková",
    firstName: "Mia",
    lastName: "Tomková",
    pronouns: "ona",
    gender: "Dievča",
    dateOfBirth: "2011-01-27",
    age: 15,
    city: "Komárno",
    status: "Konkurz",
    program: "Reklama",
    cohort: "Uchádzači",
    enrolledOn: "2026-05-20",
    heightCm: 158,
    weightKg: 47,
    eyeColor: "Modrá",
    hairColor: "Blond",
    shoeEu: 37,
    clothingSize: "XS",
    voiceType: "Mezzosoprán",
    skills: ["Stepovanie", "Klavír", "Spev z listu"],
    languages: ["Slovenčina", "Maďarčina", "Angličtina"],
    castingReadiness: 58,
    guardianName: "Eva Tomková",
    guardianRelation: "Matka",
    guardianPhone: "+421 911 884 110",
    guardianEmail: "eva.tomkova@email.sk",
    emergencyContact: "Tomáš Tomka · +421 911 552 901",
    bio: "Sľubná uchádzačka so silnou muzikalitou a teplým mezzosopránom. Aktuálne v konkurznom procese.",
    tutorNote:
      "Naplánované druhé kolo. Pred skúšobným týždňom čakáme na súhlas rodiča.",
    documents: [
      doc("D-1", "Prihláška na konkurz.pdf", "Zmluva o štúdiu", "Podpísané", "2026-05-20", 210, "Študijné"),
      doc("D-2", "Súhlas rodiča (skúšobné).pdf", "Súhlas rodiča", "Čaká sa", "2026-05-22", 0, "Kancelária"),
    ],
    media: [
      media("M-1", "Konkurzné video — jarný nábor", "Konkurzné video", "2026-05-18", "Konkurz", 121),
      media("M-2", "Domáce video", "Konkurzné video", "2026-05-10", "Konkurz", 90),
    ],
  },
  {
    id: "STU-1047",
    teacher: "Bc. Daniel Zwach",
    firstName: "Eliáš",
    lastName: "Hrebík",
    pronouns: "on",
    gender: "Chlapec",
    dateOfBirth: "2008-09-30",
    age: 17,
    city: "Žilina",
    status: "Neaktívny",
    program: "Iné",
    cohort: "2. ročník · Produkčný tím",
    enrolledOn: "2023-09-01",
    heightCm: 182,
    weightKg: 74,
    eyeColor: "Sivá",
    hairColor: "Hnedá",
    shoeEu: 44,
    clothingSize: "L",
    skills: ["Svetelný dizajn", "Stavba scény", "Závesná technika", "Zvukový mix"],
    languages: ["Slovenčina", "Angličtina", "Nemčina"],
    castingReadiness: 40,
    guardianName: "Andrej Hrebík",
    guardianRelation: "Otec",
    guardianPhone: "+421 907 445 110",
    guardianEmail: "andrej.hrebik@email.sk",
    emergencyContact: "Lenka Hrebíková · +421 907 778 332",
    bio: "Precízny technik s citom pre atmosférické svetlo. Aktuálne na zdravotnom voľne počas jarného semestra.",
    tutorNote:
      "Na voľne do jesene. Podržať miesto v produkčnom tíme; skontrolovať obnovu lekárskeho tlačiva.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-04", 178, "Kancelária"),
      doc("D-2", "Potvrdenie o prerušení.pdf", "Lekárske tlačivo", "Podpísané", "2026-02-01", 132, "Kancelária"),
      doc("D-3", "Zmluva o štúdiu 2.r.pdf", "Zmluva o štúdiu", "Podpísané", "2025-08-29", 308, "Študijné"),
    ],
    media: [
      media("M-1", "Svetelný plán — 'Macbeth'", "Foto z predstavenia", "2025-11-20", "Produkcia"),
      media("M-2", "Stavba scény (timelapse)", "Video z predstavenia", "2025-11-18", "Produkcia", 142),
    ],
  },
  {
    id: "STU-1048",
    teacher: "Mgr. art Katarína Gurová",
    firstName: "Izabela",
    lastName: "Murínová",
    pronouns: "ona",
    gender: "Dievča",
    dateOfBirth: "2006-12-08",
    age: 19,
    city: "Banská Bystrica",
    status: "Neaktívny",
    program: "Film/seriál",
    cohort: "Ročník 2025",
    enrolledOn: "2020-09-01",
    heightCm: 165,
    weightKg: 58,
    eyeColor: "Jantárová",
    hairColor: "Čierna",
    shoeEu: 39,
    clothingSize: "S",
    voiceType: "Alt",
    skills: ["Jazzový spev", "Hudobná teória", "Tvorba piesní", "Klavír"],
    languages: ["Slovenčina", "Angličtina", "Francúzština"],
    castingReadiness: 95,
    guardianName: "Absolventka",
    guardianRelation: "—",
    guardianPhone: "+421 902 448 821",
    guardianEmail: "izabela.murinova@email.sk",
    emergencyContact: "Žofia Murínová · +421 902 210 911",
    bio: "Absolvovala s vyznamenaním. Momentálne profesionálne účinkuje; zostáva v sieti absolventov pre majstrovské kurzy.",
    tutorNote:
      "Absolventka. Pozvaná späť na jesennú sériu vokálnych majstrovských kurzov.",
    documents: [
      doc("D-1", "Diplom o absolvovaní.pdf", "Vysvedčenie", "Podpísané", "2025-06-20", 120, "Riaditeľka"),
      doc("D-2", "Súhlas absolventa.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-06-22", 140, "Kancelária"),
    ],
    media: [
      media("M-1", "Absolventský koncert", "Video z predstavenia", "2025-06-15", "Hlavná scéna", 410),
      media("M-2", "Portrét — profesionálny", "Portrét", "2025-08-01", "Promo"),
      media("M-3", "Jazzový set — finále", "Foto z predstavenia", "2025-05-30", "Hlavná scéna"),
    ],
  },
  {
    id: "STU-1049",
    teacher: "Mgr. art Jakub Rek",
    firstName: "Daniel",
    lastName: "Horváth",
    pronouns: "on",
    gender: "Chlapec",
    dateOfBirth: "2009-04-11",
    age: 17,
    city: "Košice",
    status: "Aktívny",
    program: "Reklama",
    cohort: "2. ročník · Súbor B",
    enrolledOn: "2023-09-01",
    heightCm: 176,
    weightKg: 66,
    eyeColor: "Hnedá",
    hairColor: "Čierna",
    shoeEu: 42,
    clothingSize: "M",
    voiceType: "Tenor",
    skills: ["Stepovanie", "Belt spev", "Akrobacia", "Beatbox"],
    languages: ["Slovenčina", "Angličtina", "Maďarčina"],
    castingReadiness: 79,
    guardianName: "Zuzana Horváthová",
    guardianRelation: "Matka",
    guardianPhone: "+421 908 221 554",
    guardianEmail: "z.horvathova@email.sk",
    emergencyContact: "Ján Horváth · +421 908 110 442",
    bio: "Energický „triple-threat“ s výborným stepom a charizmatickým javiskovým prejavom.",
    tutorNote:
      "Výrazný pokrok v hlasovom rozsahu. Odporúčaný na vedúcu súborovú úlohu v jesennej revue.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-03", 182, "Kancelária"),
      doc("D-2", "Lekárske tlačivo.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-05", 244, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-09-03", 141, "Kancelária"),
      doc("D-4", "Zmluva o štúdiu 2.r.pdf", "Zmluva o štúdiu", "Podpísané", "2025-08-30", 310, "Študijné"),
    ],
    media: [
      media("M-1", "Portrét — jeseň 2025", "Portrét", "2025-10-02", "Promo"),
      media("M-2", "42. ulica — step", "Video z predstavenia", "2025-12-12", "Hlavná scéna", 240),
      media("M-3", "Zo skúšky", "Foto z predstavenia", "2026-01-15", "Štúdio"),
    ],
  },
  {
    id: "STU-1050",
    teacher: "Mgr. art Janko Mikuš",
    firstName: "Karolína",
    lastName: "Bednárová",
    pronouns: "ona",
    gender: "Dievča",
    dateOfBirth: "2010-08-16",
    age: 15,
    city: "Poprad",
    status: "Aktívny",
    program: "Film/seriál",
    cohort: "1. ročník · Základy",
    enrolledOn: "2024-09-01",
    heightCm: 160,
    weightKg: 50,
    eyeColor: "Zelená",
    hairColor: "Ryšavá",
    shoeEu: 38,
    clothingSize: "S",
    skills: ["Improvizácia", "Klauniáda", "Rozprávačstvo"],
    languages: ["Slovenčina", "Angličtina", "Nemčina"],
    castingReadiness: 64,
    guardianName: "Nina Bednárová",
    guardianRelation: "Matka",
    guardianPhone: "+421 910 221 884",
    guardianEmail: "nina.bednarova@email.sk",
    emergencyContact: "Urban Bednár · +421 910 110 552",
    bio: "Pohotová komická herečka s darom pre improvizáciu a fyzickú komédiu.",
    tutorNote:
      "Rozkvitá v komediálnej tvorbe. Budúci semester podporiť prácu na napísaných scénach.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-02", 179, "Kancelária"),
      doc("D-2", "Lekárske potvrdenie.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-04", 250, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Čaká sa", "2025-09-09", 0, "Kancelária"),
    ],
    media: [
      media("M-1", "Portrét — jeseň 2025", "Portrét", "2025-10-05", "Promo"),
      media("M-2", "Improvizačná prehliadka", "Video z predstavenia", "2026-02-22", "Štúdio", 200),
    ],
  },
  {
    id: "STU-1051",
    teacher: "Mgr. art Noro Šáro",
    firstName: "Adam",
    lastName: "Tóth",
    pronouns: "on",
    gender: "Chlapec",
    dateOfBirth: "2008-02-05",
    age: 18,
    city: "Bratislava",
    status: "Aktívny",
    program: "Film/seriál",
    cohort: "3. ročník · Súbor A",
    enrolledOn: "2022-09-01",
    heightCm: 181,
    weightKg: 72,
    eyeColor: "Hnedá",
    hairColor: "Hnedá",
    shoeEu: 44,
    clothingSize: "L",
    voiceType: "Bas",
    skills: ["Operná technika", "Zborové dirigovanie", "Hudobná teória"],
    languages: ["Slovenčina", "Taliančina", "Angličtina"],
    castingReadiness: 86,
    guardianName: "Katarína Tóthová",
    guardianRelation: "Matka",
    guardianPhone: "+421 911 332 778",
    guardianEmail: "k.tothova@email.sk",
    emergencyContact: "Michal Tóth · +421 911 221 009",
    bio: "Rezonujúci basový hlas s vážnym operným potenciálom. Premýšľavý a disciplinovaný hudobník.",
    tutorNote:
      "Pripravuje sa na celoštátnu vokálnu súťaž. Vynikajúca práca s dychom.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-01", 181, "Kancelária"),
      doc("D-2", "Lekárske tlačivo.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-03", 246, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-09-01", 143, "Kancelária"),
      doc("D-4", "Prihláška na súťaž.pdf", "Zmluva o štúdiu", "Podpísané", "2026-03-10", 90, "Pedagóg"),
    ],
    media: [
      media("M-1", "Portrét — jeseň 2025", "Portrét", "2025-10-01", "Promo"),
      media("M-2", "Áriový koncert", "Video z predstavenia", "2026-03-18", "Hlavná scéna", 280),
      media("M-3", "Majstrovský kurz", "Foto z predstavenia", "2026-01-25", "Štúdio"),
    ],
  },
  {
    id: "STU-1052",
    teacher: "Mgr. art Ria Benkovská",
    firstName: "Ema",
    lastName: "Lišková",
    pronouns: "ona",
    gender: "Dievča",
    dateOfBirth: "2009-10-21",
    age: 16,
    city: "Zvolen",
    status: "Aktívny",
    program: "Reklama",
    cohort: "2. ročník · Súbor B",
    enrolledOn: "2023-09-01",
    heightCm: 170,
    weightKg: 55,
    eyeColor: "Modrá",
    hairColor: "Blond",
    shoeEu: 40,
    clothingSize: "S",
    skills: ["Balet", "Súčasný tanec", "Párový tanec", "Choreografia"],
    languages: ["Slovenčina", "Angličtina"],
    castingReadiness: 83,
    guardianName: "Andrea Lišková",
    guardianRelation: "Matka",
    guardianPhone: "+421 948 884 221",
    guardianEmail: "andrea.liskova@email.sk",
    emergencyContact: "Erik Liška · +421 948 552 118",
    bio: "Elegantná klasická tanečnica, ktorá krásne prechádza do súčasného repertoáru.",
    tutorNote:
      "Pekná línia a muzikalita. Zvážiť párové číslo na zimnej gala.",
    documents: [
      doc("D-1", "Súhlas rodiča 2025-26.pdf", "Súhlas rodiča", "Podpísané", "2025-09-02", 180, "Kancelária"),
      doc("D-2", "Lekárske potvrdenie.pdf", "Lekárske tlačivo", "Podpísané", "2025-09-04", 252, "Kancelária"),
      doc("D-3", "Súhlas s fotami a videom.pdf", "Súhlas s fotami a videom", "Podpísané", "2025-09-02", 142, "Kancelária"),
      doc("D-4", "Zmluva o štúdiu 2.r.pdf", "Zmluva o štúdiu", "Podpísané", "2025-08-31", 309, "Študijné"),
    ],
    media: [
      media("M-1", "Portrét — jeseň 2025", "Portrét", "2025-10-03", "Promo"),
      media("M-2", "Zimná gala — pas de deux", "Video z predstavenia", "2025-12-20", "Hlavná scéna", 260),
      media("M-3", "Pri tyči", "Foto z predstavenia", "2026-02-10", "Štúdio"),
    ],
  },
  {
    id: "STU-1053",
    teacher: "Bc. Simon Fico",
    firstName: "Jakub",
    lastName: "Šimko",
    pronouns: "on",
    gender: "Chlapec",
    dateOfBirth: "2010-06-12",
    age: 15,
    city: "Prešov",
    status: "Konkurz",
    program: "Iné",
    cohort: "Uchádzači",
    enrolledOn: "2026-05-25",
    heightCm: 172,
    weightKg: 60,
    eyeColor: "Liesková",
    hairColor: "Hnedá",
    shoeEu: 41,
    clothingSize: "M",
    skills: ["Videoprojekcia", "Programovanie", "Zvukový dizajn"],
    languages: ["Slovenčina", "Angličtina"],
    castingReadiness: 52,
    guardianName: "Petra Šimková",
    guardianRelation: "Matka",
    guardianPhone: "+421 950 221 884",
    guardianEmail: "petra.simkova@email.sk",
    emergencyContact: "Tomáš Šimko · +421 950 110 332",
    bio: "Technicky zdatný uchádzač so záujmom o projekciu a imerzívne médiá pre živé predstavenie.",
    tutorNote:
      "Čaká sa na posúdenie portfólia. Silné technické predpoklady pre digitálnu javiskovú techniku.",
    documents: [
      doc("D-1", "Prihláška na konkurz.pdf", "Zmluva o štúdiu", "Podpísané", "2026-05-25", 205, "Študijné"),
      doc("D-2", "Odkaz na portfólio.pdf", "Vysvedčenie", "Čaká sa", "2026-05-26", 64, "Kancelária"),
    ],
    media: [
      media("M-1", "Ukážka projekcie", "Video z predstavenia", "2026-05-22", "Konkurz", 150),
    ],
  },
];

// ── Odvodené pomocné funkcie ────────────────────────────────────────────────

// Vek sa počíta automaticky z dátumu narodenia (aktualizuje sa každým buildom/načítaním).
students.forEach((s) => {
  s.age = computeAge(s.dateOfBirth);
});

export function getStudent(id: string) {
  return students.find((s) => s.id === id);
}

export const PROGRAMS: Program[] = ["Reklama", "Film/seriál", "Iné"];

export const STATUSES: Status[] = ["Aktívny", "Konkurz", "Neaktívny"];

export const EYE_COLORS = [...new Set(students.map((s) => s.eyeColor))].sort();
export const HAIR_COLORS = [...new Set(students.map((s) => s.hairColor))].sort();

export const programAccent: Record<Program, string> = {
  Reklama: "oklch(0.55 0.19 300)",
  "Film/seriál": "oklch(0.55 0.18 25)",
  Iné: "oklch(0.6 0.05 260)",
};

export const TEACHERS: string[] = [
  "Mgr. art Katarína Baranová ArtD.",
  "Mgr. art Katarína Gurová",
  "Mgr. art Mirka Durná ArtD.",
  "Mgr. art Lenka Libjaková",
  "Mgr. art Michal Rovňák",
  "Mgr. art Jakub Rek",
  "Jakub Ružička",
  "Mgr. art Janko Mikuš",
  "Mgr. art Noro Šáro",
  "Mgr. art Kamil Kollárik",
  "Mgr. art Jozef Jurčišin Kukľa",
  "Bc. Rišo Labuda",
  "Bc. Daniel Zwach",
  "Bc. Simon Fico",
  "Mgr. art Ada Juhásová",
  "Bc. Naďa Gášeková",
  "Mgr. art Ria Benkovská",
  "Mgr. art Viktória Šuplatová",
  "Mgr. Art David Kakaš",
  "Mgr. art Soňa Borušovičová",
  "Mgr. art Edita Koprivčevič Borsová",
];
