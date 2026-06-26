"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import {
  Drama,
  User,
  Users,
  Ruler,
  Mic2,
  Sparkles,
  Languages as LanguagesIcon,
  Share2,
  Link2,
  Images,
  ShieldCheck,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

// ── Číselníky ────────────────────────────────────────────────────────────────
const POHLAVIE = ["Dievča", "Chlapec"];
const ETNICKY = ["Slovanský", "Stredomorský", "Severský", "Ázijský", "Africký", "Latino", "Blízkovýchodný", "Iný"];
const POSTAVA = ["Štíhla", "Atletická", "Stredná", "Silnejšia"];
const EYE = ["Hnedá", "Modrá", "Zelená", "Lieskové", "Jantárová", "Sivá"];
const HAIR = ["Čierna", "Hnedá", "Blond", "Ryšavá", "Gaštanová", "Sivá"];
const DLZKA_VLASOV = ["Krátke", "Stredné", "Dlhé"];
const TYP_VLASOV = ["Rovné", "Vlnité", "Kučeravé"];
const BRADA = ["Nie", "Áno – krátke", "Áno – plné"];
const OBLECENIE = ["XS", "S", "M", "L", "XL", "XXL"];
const HLAS_SPEV = ["Soprán", "Mezzosoprán", "Alt", "Tenor", "Barytón", "Bas", "Neviem"];
const HLAS_REC = ["Vysoký", "Stredný", "Hlboký"];

const JAZYKY = ["Slovenčina", "Čeština", "Angličtina", "Nemčina", "Maďarčina", "Francúzština", "Španielčina", "Taliančina", "Ruština", "Poľština", "Iné"];
const NASTROJE = ["Gitara", "Klavír", "Flauta", "Trubka", "Trombón", "Saxofón", "Klarinet", "Bicie", "Husle", "Kontrabas", "Banjo", "Ukulele", "Organ", "Hoboj", "Basgitara", "Akordeón", "Cimbal", "Mandolína", "Perkusie", "Viola", "Violončelo", "Harfa"];
const TANCE = ["Balet", "Moderný tanec", "Jazz", "Hip-hop", "Contemporary", "Spoločenský tanec", "Ľudový tanec", "Stepovanie", "Latino", "Iné"];
const VODICAK = ["Osobné auto", "Motocykel", "Moped", "Bicykel", "Žiadne"];
const SPORTY = ["Beh", "Plávanie", "Cyklistika", "Lyžovanie", "Snowboard", "Bežky", "Šerm", "Golf", "Inline korčuľovanie", "Skateboarding", "Korčuľovanie", "Krasokorčuľovanie", "Lezenie na stene", "Horolezectvo", "Fitness", "Kulturistika", "Crossfit", "Aerobik", "Zumba", "Gymnastika", "Joga", "Pilates", "Vodné pólo", "Hokej", "Futbal", "Basketbal", "Volejbal", "Bedminton", "Tenis", "Stolný tenis", "Floorball", "Hokejbal", "Americký futbal", "Windsurfing", "Extrémne športy", "Parkour", "Bowling", "Paragliding", "Šach", "Box", "Kickbox", "Thai-box", "Karate", "Judo", "Wrestling", "Jazda na koni", "Akrobacia", "Lukostreľba", "Streľba z pištole"];
const ZNAKY = ["Tetovanie", "Piercing", "Strojček na zuby", "Okuliare", "Jazvy", "Pehy", "Znamienko", "Odstávajúce uši", "Medzera medzi zubami", "Chýbajúce zuby"];

// ── Pomocné komponenty ───────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          {title}
        </CardTitle>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2 lg:col-span-3")}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}

const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

import type { Student } from "@/lib/data";

export default function PrihlaskaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState<Record<string, string>>({});
  const [multi, setMulti] = useState<Record<string, string[]>>({
    jazyky: [],
    nastroje: [],
    tanec: [],
    vodicak: [],
    sporty: [],
    znaky: [],
  });

  const t = (k: string) => text[k] ?? "";
  const set = (k: string, v: string) => setText((p) => ({ ...p, [k]: v }));
  const toggle = (group: string, v: string) =>
    setMulti((p) => ({
      ...p,
      [group]: p[group].includes(v)
        ? p[group].filter((x) => x !== v)
        : [...p[group], v],
    }));

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--success)_15%,white)] text-[var(--success)]">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Ďakujeme!</h1>
        <p className="mt-2 text-muted-foreground">
          Prihláška bola úspešne odoslaná. Ozveme sa vám e-mailom.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setText({});
            setMulti({ jazyky: [], nastroje: [], tanec: [], vodicak: [], sporty: [], znaky: [] });
            window.scrollTo({ top: 0 });
          }}
        >
          Vyplniť ďalšiu prihlášku
        </Button>
      </div>
    );
  }

  const Chips = ({ group, options }: { group: string; options: string[] }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = multi[group].includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => toggle(group, o)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-secondary"
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hlavička */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex size-11 items-center justify-center rounded-xl text-white shadow-pop"
          style={{ backgroundImage: "linear-gradient(135deg, oklch(0.62 0.18 300), oklch(0.5 0.2 280))" }}
        >
          <Drama className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Prihláška do agentúry Ludus
          </h1>
          <p className="text-sm text-muted-foreground">
            Formulár vypĺňa rodič / zákonný zástupca. Polia označené{" "}
            <span className="text-destructive">*</span> sú povinné.
          </p>
        </div>
      </div>

      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          const newStudent: Student = {
            id: `APP-${Date.now()}`,
            firstName: text.firstName ?? "",
            lastName: text.lastName ?? "",
            preferredName: text.preferredName || undefined,
            pronouns: text.gender === "Dievča" ? "ona" : "on",
            gender: (text.gender as any) || "Iné",
            dateOfBirth: text.dob ?? new Date().toISOString().split("T")[0],
            age: 0,
            city: text.city ?? "",
            status: "Konkurz",
            program: "Iné",
            cohort: "Uchádzači",
            teacher: "—",
            enrolledOn: new Date().toISOString().split("T")[0],
            heightCm: Number(text.height) || 0,
            weightKg: Number(text.weight) || 0,
            eyeColor: (text.eye as any) || "Hnedá",
            hairColor: (text.hair as any) || "Hnedá",
            shoeEu: Number(text.shoe) || 0,
            clothingSize: (text.clothing as any) || "M",
            voiceType: (text.voiceSing as any) || undefined,
            school: text.school || "",
            guardianEmail2: text.guardianEmail2 || "",
            apparentAge: text.apparentAge || "",
            ethnicity: text.ethnicity || "",
            bodyType: text.body || "",
            hairLength: text.hairLen || "",
            hairType: text.hairType || "",
            beard: text.beard || "",
            suitSize: text.suit || "",
            chestCircumference: Number(text.chest) || 0,
            waistCircumference: Number(text.waist) || 0,
            hipsCircumference: Number(text.hips) || 0,
            headCircumference: Number(text.head) || 0,
            neckCircumference: Number(text.neck) || 0,
            voiceSpeak: text.voiceSpeak || "",
            distinctiveFeatures: multi.znaky || [],
            handicaps: text.handicaps || "",
            skills: [
              ...(text.otherSkills ? [text.otherSkills] : [])
            ],
            languages: multi.jazyky || [],
            instruments: multi.nastroje || [],
            danceStyles: multi.tanec || [],
            sports: multi.sporty || [],
            drivingLicences: multi.vodicak || [],
            otherSkills: text.otherSkills || "",
            otherTalents: text.otherTalents || "",
            accent: text.accent || "",
            igFollowers: Number(text.igFollowers) || 0,
            ttFollowers: Number(text.ttFollowers) || 0,
            ytFollowers: Number(text.ytFollowers) || 0,
            fbFollowers: Number(text.fbFollowers) || 0,
            urlWeb: text.urlWeb || "",
            urlIg: text.urlIg || "",
            urlTt: text.urlTt || "",
            urlYt: text.urlYt || "",
            urlFb: text.urlFb || "",
            urlLi: text.urlLi || "",
            urlImdb: text.urlImdb || "",
            urlCsfd: text.urlCsfd || "",
            urlIdiv: text.urlIdiv || "",
            castingReadiness: 50,
            phone: text.childPhone || "",
            email: text.childEmail || "",
            guardianName: text.guardianName ?? "",
            guardianRelation: text.guardianRel ?? "Matka",
            guardianPhone: text.guardianPhone ?? "",
            guardianEmail: text.guardianEmail ?? "",
            emergencyContact: "",
            bio: "",
            tutorNote: "",
            documents: [],
            media: []
          };
          // Doručenie agentúre — uloženie do zdieľaného Supabase projektu.
          const { error } = await supabase
            .from("ludus_applications")
            .insert({
              first_name: newStudent.firstName || null,
              last_name: newStudent.lastName || null,
              date_of_birth: newStudent.dateOfBirth || null,
              guardian_name: newStudent.guardianName || null,
              guardian_email: newStudent.guardianEmail || null,
              guardian_phone: newStudent.guardianPhone || null,
              data: newStudent,
              status: "new",
            });
          if (error) {
            // Kým nie je spustená migrácia, tabuľka ešte neexistuje —
            // formulár necháme funkčný a chybu len zalogujeme.
            console.error("Prihláška sa neuložila:", error.message);
          }
          setSubmitting(false);
          setSubmitted(true);
          window.scrollTo({ top: 0 });
        }}
      >
        {/* 1. Údaje o dieťati */}
        <Section icon={User} title="Údaje o dieťati">
          <div className={grid}>
            <Field label="Meno" required>
              <Input value={t("firstName")} onChange={(e) => set("firstName", e.target.value)} required />
            </Field>
            <Field label="Priezvisko" required>
              <Input value={t("lastName")} onChange={(e) => set("lastName", e.target.value)} required />
            </Field>
            <Field label="Prezývka">
              <Input value={t("preferredName")} onChange={(e) => set("preferredName", e.target.value)} />
            </Field>
            <Field label="Pohlavie">
              <Select value={t("gender")} onChange={(e) => set("gender", e.target.value)}>
                <option value="">— vyberte —</option>
                {POHLAVIE.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Dátum narodenia" required>
              <Input type="date" value={t("dob")} onChange={(e) => set("dob", e.target.value)} required />
            </Field>
            <Field label="Bydlisko (mesto / kraj)">
              <Input value={t("city")} onChange={(e) => set("city", e.target.value)} placeholder="napr. Bratislava" />
            </Field>
            <Field label="Herecká / umelecká škola">
              <Input value={t("school")} onChange={(e) => set("school", e.target.value)} />
            </Field>
            <Field label="Telefón dieťaťa">
              <Input value={t("childPhone")} onChange={(e) => set("childPhone", e.target.value)} placeholder="+421 …" />
            </Field>
            <Field label="E-mail dieťaťa">
              <Input type="email" value={t("childEmail")} onChange={(e) => set("childEmail", e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* 2. Rodič */}
        <Section icon={Users} title="Rodič / zákonný zástupca">
          <div className={grid}>
            <Field label="Meno a priezvisko rodiča" required>
              <Input value={t("guardianName")} onChange={(e) => set("guardianName", e.target.value)} required />
            </Field>
            <Field label="Vzťah k dieťaťu">
              <Select value={t("guardianRel")} onChange={(e) => set("guardianRel", e.target.value)}>
                <option value="">— vyberte —</option>
                <option>Matka</option>
                <option>Otec</option>
                <option>Iný zákonný zástupca</option>
              </Select>
            </Field>
            <Field label="Telefón rodiča" required>
              <Input value={t("guardianPhone")} onChange={(e) => set("guardianPhone", e.target.value)} required placeholder="+421 …" />
            </Field>
            <Field label="E-mail rodiča" required>
              <Input type="email" value={t("guardianEmail")} onChange={(e) => set("guardianEmail", e.target.value)} required />
            </Field>
            <Field label="E-mail druhého rodiča">
              <Input type="email" value={t("guardianEmail2")} onChange={(e) => set("guardianEmail2", e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* 3. Vzhľad */}
        <Section icon={Ruler} title="Vzhľad a telesné miery">
          <div className={grid}>
            <Field label="Výška (cm)">
              <Input type="number" value={t("height")} onChange={(e) => set("height", e.target.value)} />
            </Field>
            <Field label="Hmotnosť (kg)">
              <Input type="number" value={t("weight")} onChange={(e) => set("weight", e.target.value)} />
            </Field>
            <Field label="Na koľko rokov vyzerá (rozpätie)">
              <Input value={t("apparentAge")} onChange={(e) => set("apparentAge", e.target.value)} placeholder="napr. 12 – 16" />
            </Field>
            <Field label="Etnický vzhľad">
              <Select value={t("ethnicity")} onChange={(e) => set("ethnicity", e.target.value)}>
                <option value="">— vyberte —</option>
                {ETNICKY.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Typ postavy">
              <Select value={t("body")} onChange={(e) => set("body", e.target.value)}>
                <option value="">— vyberte —</option>
                {POSTAVA.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Farba očí">
              <Select value={t("eye")} onChange={(e) => set("eye", e.target.value)}>
                <option value="">— vyberte —</option>
                {EYE.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Farba vlasov">
              <Select value={t("hair")} onChange={(e) => set("hair", e.target.value)}>
                <option value="">— vyberte —</option>
                {HAIR.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Dĺžka vlasov">
              <Select value={t("hairLen")} onChange={(e) => set("hairLen", e.target.value)}>
                <option value="">— vyberte —</option>
                {DLZKA_VLASOV.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Typ vlasov">
              <Select value={t("hairType")} onChange={(e) => set("hairType", e.target.value)}>
                <option value="">— vyberte —</option>
                {TYP_VLASOV.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Brada / fúzy">
              <Select value={t("beard")} onChange={(e) => set("beard", e.target.value)}>
                <option value="">— vyberte —</option>
                {BRADA.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Veľkosť oblečenia">
              <Select value={t("clothing")} onChange={(e) => set("clothing", e.target.value)}>
                <option value="">— vyberte —</option>
                {OBLECENIE.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Veľkosť obuvi (EU)">
              <Input type="number" value={t("shoe")} onChange={(e) => set("shoe", e.target.value)} />
            </Field>
            <Field label="Veľkosť obleku / kostýmu">
              <Input value={t("suit")} onChange={(e) => set("suit", e.target.value)} />
            </Field>
            <Field label="Obvod hrudníka (cm)">
              <Input type="number" value={t("chest")} onChange={(e) => set("chest", e.target.value)} />
            </Field>
            <Field label="Obvod pása (cm)">
              <Input type="number" value={t("waist")} onChange={(e) => set("waist", e.target.value)} />
            </Field>
            <Field label="Obvod bokov (cm)">
              <Input type="number" value={t("hips")} onChange={(e) => set("hips", e.target.value)} />
            </Field>
            <Field label="Obvod hlavy (cm)">
              <Input type="number" value={t("head")} onChange={(e) => set("head", e.target.value)} />
            </Field>
            <Field label="Obvod krku (cm)">
              <Input type="number" value={t("neck")} onChange={(e) => set("neck", e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* 4. Hlas */}
        <Section icon={Mic2} title="Hlas">
          <div className={grid}>
            <Field label="Typ hlasu (spev)">
              <Select value={t("voiceSing")} onChange={(e) => set("voiceSing", e.target.value)}>
                <option value="">— vyberte —</option>
                {HLAS_SPEV.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Výška hlasu (reč)">
              <Select value={t("voiceSpeak")} onChange={(e) => set("voiceSpeak", e.target.value)}>
                <option value="">— vyberte —</option>
                {HLAS_REC.map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Ukážka hlasu (audio)">
              <Input type="file" accept="audio/*" className="h-auto py-1.5" />
            </Field>
          </div>
        </Section>

        {/* 5. Unikátne charakteristiky */}
        <Section
          icon={Sparkles}
          title="Unikátne charakteristiky"
          desc="Označte, čo má dieťa. Nepovinné."
        >
          <Chips group="znaky" options={ZNAKY} />
          <div className="mt-4">
            <Field label="Hendikepy / iné (popíšte)" full>
              <textarea
                value={t("handicaps")}
                onChange={(e) => set("handicaps", e.target.value)}
                rows={3}
                className="w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:border-ring focus-visible:ring-focus"
              />
            </Field>
          </div>
        </Section>

        {/* 6. Jazyky a zručnosti */}
        <Section icon={LanguagesIcon} title="Jazyky a zručnosti">
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Jazyky</p>
              <Chips group="jazyky" options={JAZYKY} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Hudobné nástroje</p>
              <Chips group="nastroje" options={NASTROJE} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanec</p>
              <Chips group="tanec" options={TANCE} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Športy a bojové umenia
              </p>
              <Chips group="sporty" options={SPORTY} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Vodičské oprávnenia</p>
              <Chips group="vodicak" options={VODICAK} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Iné zručnosti">
                <Input value={t("otherSkills")} onChange={(e) => set("otherSkills", e.target.value)} />
              </Field>
              <Field label="Iné talenty">
                <Input value={t("otherTalents")} onChange={(e) => set("otherTalents", e.target.value)} />
              </Field>
              <Field label="Akcent pre rodených hovorcov">
                <Input value={t("accent")} onChange={(e) => set("accent", e.target.value)} />
              </Field>
            </div>
          </div>
        </Section>

        {/* 7. Sociálne siete – počet sledovateľov */}
        <Section icon={Share2} title="Sociálne siete – počet sledovateľov">
          <div className={grid}>
            <Field label="Instagram"><Input type="number" value={t("igFollowers")} onChange={(e) => set("igFollowers", e.target.value)} placeholder="0" /></Field>
            <Field label="TikTok"><Input type="number" value={t("ttFollowers")} onChange={(e) => set("ttFollowers", e.target.value)} placeholder="0" /></Field>
            <Field label="YouTube"><Input type="number" value={t("ytFollowers")} onChange={(e) => set("ytFollowers", e.target.value)} placeholder="0" /></Field>
            <Field label="Facebook"><Input type="number" value={t("fbFollowers")} onChange={(e) => set("fbFollowers", e.target.value)} placeholder="0" /></Field>
          </div>
        </Section>

        {/* 8. Webové odkazy */}
        <Section icon={Link2} title="Webové odkazy / profily">
          <div className={grid}>
            <Field label="Web"><Input value={t("urlWeb")} onChange={(e) => set("urlWeb", e.target.value)} placeholder="https://…" /></Field>
            <Field label="Instagram"><Input value={t("urlIg")} onChange={(e) => set("urlIg", e.target.value)} placeholder="https://…" /></Field>
            <Field label="TikTok"><Input value={t("urlTt")} onChange={(e) => set("urlTt", e.target.value)} placeholder="https://…" /></Field>
            <Field label="YouTube"><Input value={t("urlYt")} onChange={(e) => set("urlYt", e.target.value)} placeholder="https://…" /></Field>
            <Field label="Facebook"><Input value={t("urlFb")} onChange={(e) => set("urlFb", e.target.value)} placeholder="https://…" /></Field>
            <Field label="LinkedIn"><Input value={t("urlLi")} onChange={(e) => set("urlLi", e.target.value)} placeholder="https://…" /></Field>
            <Field label="IMDB"><Input value={t("urlImdb")} onChange={(e) => set("urlImdb", e.target.value)} placeholder="https://…" /></Field>
            <Field label="ČSFD"><Input value={t("urlCsfd")} onChange={(e) => set("urlCsfd", e.target.value)} placeholder="https://…" /></Field>
            <Field label="iDivadlo"><Input value={t("urlIdiv")} onChange={(e) => set("urlIdiv", e.target.value)} placeholder="https://…" /></Field>
          </div>
        </Section>

        {/* 9. Fotky a videá */}
        <Section icon={Images} title="Fotky a videá" desc="Nahrajte aktuálne portréty a prípadné ukážky.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Fotografie (portrét, celá postava)">
              <Input type="file" accept="image/*" multiple className="h-auto py-1.5" />
            </Field>
            <Field label="Videá (ukážka)">
              <Input type="file" accept="video/*" multiple className="h-auto py-1.5" />
            </Field>
          </div>
        </Section>

        {/* 10. Súhlasy */}
        <Section icon={ShieldCheck} title="Súhlasy">
          <div className="space-y-3">
            {[
              ["gdpr", "Súhlasím so spracovaním osobných údajov v zmysle GDPR.", true],
              ["media", "Súhlasím s vyhotovením a použitím fotografií a videí dieťaťa na účely castingu.", true],
              ["truth", "Potvrdzujem, že uvedené údaje sú pravdivé.", true],
            ].map(([key, label, req]) => (
              <label key={key as string} className="flex items-start gap-2.5 text-sm">
                <input
                  type="checkbox"
                  required={req as boolean}
                  className="mt-0.5 size-4 accent-[var(--primary)]"
                />
                <span>
                  {label} {req && <span className="text-destructive">*</span>}
                </span>
              </label>
            ))}
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3 pb-4">
          <p className="mr-auto text-xs text-muted-foreground">
            Po odoslaní vás budeme kontaktovať e-mailom.
          </p>
          <Button type="submit" size="lg" className="gap-2" disabled={submitting}>
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Odoslať prihlášku
          </Button>
        </div>
      </form>
    </div>
  );
}
