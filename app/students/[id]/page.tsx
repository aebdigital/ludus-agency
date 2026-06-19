"use client";

import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Ruler,
  Eye,
  Palette,
  Shirt,
  Cake,
  CalendarDays,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Languages,
  Sparkles,
  FileText,
  Download,
  Plus,
  Weight,
  Quote,
  GraduationCap,
  Presentation,
  Wallet,
  Briefcase,
  UserX,
  Mic2,
  Link2,
  Users,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocStatusBadge } from "@/components/shared/badges";
import { MediaTile } from "@/components/shared/media-tile";
import { HonorareTab } from "@/components/student/honorare-tab";
import { EditableCard, InlineEditableField, useEditableCard } from "@/components/student/editable-card";
import { ProfileCard } from "@/components/student/profile-card";
import {
  TEACHERS,
  EYE_COLORS,
  HAIR_COLORS,
  type StudentDocument,
} from "@/lib/data";
import { getExperience } from "@/lib/experience";
import { useStudent, useStudentProjects } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const kindIcon: Record<string, ComponentType<{ className?: string }>> = {
  "Súhlas rodiča": ShieldAlert,
  "Lekárske tlačivo": FileText,
  "Súhlas s fotami a videom": FileText,
  "Zmluva o štúdiu": FileText,
  Vysvedčenie: GraduationCap,
  Štipendium: Sparkles,
};

/** Odvodí e-mail z mena typu "Urban Bednár · +421 …" → urban.bednar@email.sk */
function emailFromName(raw: string): string {
  const name = raw.split("·")[0].trim();
  const ascii = name.normalize("NFD").replace(/[^\x00-\x7F]/g, "");
  const parts = ascii.toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return "";
  return `${parts[0]}.${parts[parts.length - 1]}@email.sk`;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  editKey,
  editType = "text",
  editOptions,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  editKey?: string;
  editType?: "text" | "number" | "date" | "select";
  editOptions?: readonly string[];
}) {
  const ctx = useEditableCard();
  const isEditing = ctx?.editing && editKey;

  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="size-4" />
        {label}
      </span>
      {isEditing ? (
        <div className="flex-1 max-w-[200px] flex justify-end">
          <InlineEditableField
            keyName={editKey}
            type={editType}
            options={editOptions}
            className="w-full text-right h-8"
          />
        </div>
      ) : (
        <span className="text-sm font-medium">{value}</span>
      )}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  value,
  href,
  editKey,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: string | undefined | null;
  href?: string;
  editKey: string;
  label: string;
}) {
  const ctx = useEditableCard();
  const isEditing = ctx?.editing;

  return (
    <div className="flex items-center gap-2 py-0.5">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      {isEditing ? (
        <div className="flex-1">
          <span className="sr-only">{label}</span>
          <InlineEditableField
            keyName={editKey}
            type="text"
            placeholder={label}
            className="h-8 text-left text-sm w-full"
          />
        </div>
      ) : href ? (
        <a href={href} className="text-sm text-foreground/90 hover:text-primary truncate">
          {value || "—"}
        </a>
      ) : (
        <span className="text-sm text-foreground/90 truncate">{value || "—"}</span>
      )}
    </div>
  );
}

function SkillsList({
  skills,
  editKey,
  placeholder,
}: {
  skills: string[];
  editKey: string;
  placeholder?: string;
}) {
  const ctx = useEditableCard();
  const isEditing = ctx?.editing;

  if (isEditing) {
    return (
      <InlineEditableField
        keyName={editKey}
        type="text"
        placeholder={placeholder}
        className="w-full h-8 text-sm"
      />
    );
  }

  if (!skills.length) {
    return <p className="text-sm text-muted-foreground">—</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((sk) => (
        <Badge key={sk} variant={editKey === "skills" ? "default" : "secondary"}>
          {sk}
        </Badge>
      ))}
    </div>
  );
}

function TutorNoteSection({ note }: { note: string }) {
  const ctx = useEditableCard();
  const isEditing = ctx?.editing;

  if (isEditing) {
    return (
      <InlineEditableField
        keyName="tutorNote"
        type="textarea"
        placeholder="Napíšte poznámku..."
        className="w-full text-sm"
      />
    );
  }

  return (
    <p className="text-sm leading-relaxed text-foreground/90">
      {note || "Zatiaľ bez poznámky."}
    </p>
  );
}

function TextareaSection({
  note,
  editKey,
  placeholder,
  fallback = "—",
}: {
  note: string;
  editKey: string;
  placeholder?: string;
  fallback?: string;
}) {
  const ctx = useEditableCard();
  const isEditing = ctx?.editing;

  if (isEditing) {
    return (
      <InlineEditableField
        keyName={editKey}
        type="textarea"
        placeholder={placeholder}
        className="w-full text-sm"
      />
    );
  }

  return (
    <p className="text-sm leading-relaxed text-foreground/90">
      {note || fallback}
    </p>
  );
}

function DocSection({
  title,
  docs,
}: {
  title: string;
  docs: StudentDocument[];
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary">{docs.length}</Badge>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Plus className="size-4" /> Nahrať
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {docs.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted-foreground">
            Žiadne dokumenty v tejto kategórii.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Dokument</TableHead>
                <TableHead className="hidden md:table-cell">Pridané</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d) => {
                const Icon = kindIcon[d.kind] ?? FileText;
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {d.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {d.sizeKb ? `${d.sizeKb} KB` : "Čaká na nahranie"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground md:table-cell">
                      {formatDate(d.uploadedAt)}
                    </TableCell>
                    <TableCell>
                      <DocStatusBadge status={d.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={!d.sizeKb}
                        aria-label="Stiahnuť"
                      >
                        <Download className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function StudentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const s = useStudent(id);
  const assigned = useStudentProjects(id);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!s) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        {!mounted ? (
          <p className="text-sm text-muted-foreground">Načítavam…</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <UserX className="size-6" />
            </div>
            <p className="font-medium">Študent sa nenašiel</p>
            <Link href="/students">
              <Button variant="outline" size="sm">
                Späť na študentov
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  const photos = s.media.filter(
    (m) => m.kind === "Portrét" || m.kind === "Foto z predstavenia"
  );
  const videos = s.media.filter(
    (m) => m.kind === "Konkurzné video" || m.kind === "Video z predstavenia"
  );

  const parentKinds = new Set<string>([
    "Súhlas rodiča",
    "Súhlas s fotami a videom",
    "Lekárske tlačivo",
  ]);
  const rodicia = s.documents.filter((d) => parentKinds.has(d.kind));
  const agentura = s.documents.filter((d) => !parentKinds.has(d.kind));

  const timeline = [
    ...assigned.map((p) => ({
      year: p.dates.match(/(20\d{2})/)?.[1] ?? "2026",
      title: p.title,
      role: "Obsadenie",
      org: p.venue,
      isProject: true,
    })),
    ...getExperience(s.id).map((e) => ({ ...e, isProject: false })),
  ];

  const parentEmails = [
    s.guardianEmail,
    s.emergencyContact ? emailFromName(s.emergencyContact) : "",
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/students"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Všetci študenti
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ĽAVÝ stĺpec — fotka + vždy viditeľné údaje */}
        <div className="space-y-5">
          <ProfileCard student={s} />

          <EditableCard
            student={s}
            title="Osobné údaje"
            icon={User}
            contentClassName="divide-y divide-border"
            fields={[
              { key: "dateOfBirth", label: "Dátum narodenia", type: "date" },
              {
                key: "gender",
                label: "Pohlavie",
                type: "select",
                options: ["Dievča", "Chlapec"],
              },
              { key: "teacher", label: "Pedagóg", type: "select", options: TEACHERS },
              { key: "school", label: "Umelecká škola", type: "text" },
            ]}
          >
            <InfoRow
              icon={Cake}
              label="Dátum narodenia"
              value={`${formatDate(s.dateOfBirth)} · ${s.age} r.`}
              editKey="dateOfBirth"
              editType="date"
            />
            <InfoRow
              icon={User}
              label="Pohlavie"
              value={s.gender}
              editKey="gender"
              editType="select"
              editOptions={["Dievča", "Chlapec"]}
            />
            <InfoRow
              icon={Presentation}
              label="Pedagóg"
              value={s.teacher}
              editKey="teacher"
              editType="select"
              editOptions={TEACHERS}
            />
            <InfoRow
              icon={GraduationCap}
              label="Umelecká škola"
              value={s.school || "—"}
              editKey="school"
              editType="text"
            />
            <InfoRow
              icon={CalendarDays}
              label="Zapísaný"
              value={formatDate(s.enrolledOn)}
            />
          </EditableCard>

          <EditableCard
            student={s}
            title="Kontakt"
            icon={ShieldAlert}
            contentClassName="space-y-4"
            fields={[
              { key: "phone", label: "Telefón dieťaťa", type: "text" },
              { key: "email", label: "E-mail dieťaťa", type: "text" },
              { key: "guardianName", label: "Meno rodiča", type: "text" },
              { key: "guardianRelation", label: "Vzťah k dieťaťu", type: "text" },
              { key: "guardianPhone", label: "Telefón rodiča", type: "text" },
              { key: "guardianEmail", label: "E-mail rodiča", type: "text" },
              { key: "guardianEmail2", label: "E-mail druhého rodiča", type: "text" },
            ]}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Študent</p>
              <ContactRow
                icon={Phone}
                value={s.phone}
                href={s.phone ? `tel:${s.phone}` : undefined}
                editKey="phone"
                label="Telefón dieťaťa"
              />
              <ContactRow
                icon={Mail}
                value={s.email}
                href={s.email ? `mailto:${s.email}` : undefined}
                editKey="email"
                label="E-mail dieťaťa"
              />
            </div>
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rodič / zástupca</p>
              <ContactRow
                icon={User}
                value={s.guardianName}
                editKey="guardianName"
                label="Meno rodiča"
              />
              <ContactRow
                icon={Users}
                value={s.guardianRelation}
                editKey="guardianRelation"
                label="Vzťah k dieťaťu"
              />
              <ContactRow
                icon={Phone}
                value={s.guardianPhone}
                href={s.guardianPhone ? `tel:${s.guardianPhone}` : undefined}
                editKey="guardianPhone"
                label="Telefón rodiča"
              />
              <ContactRow
                icon={Mail}
                value={s.guardianEmail}
                href={s.guardianEmail ? `mailto:${s.guardianEmail}` : undefined}
                editKey="guardianEmail"
                label="E-mail rodiča"
              />
              <ContactRow
                icon={Mail}
                value={s.guardianEmail2}
                href={s.guardianEmail2 ? `mailto:${s.guardianEmail2}` : undefined}
                editKey="guardianEmail2"
                label="E-mail druhého rodiča"
              />
            </div>
          </EditableCard>
        </div>

        {/* PRAVÝ stĺpec — záložky */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="overview">
                <User /> Prehľad
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText /> Dokumenty
                <Badge variant="secondary" className="ml-1">
                  {s.documents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="media">
                <Sparkles /> Médiá
                <Badge variant="secondary" className="ml-1">
                  {s.media.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="honorare">
                <Wallet /> Honoráre
              </TabsTrigger>
              <TabsTrigger value="experience">
                <Briefcase /> Skúsenosti
              </TabsTrigger>
            </TabsList>

            {/* PREHĽAD */}
            <TabsContent value="overview">
              <div className="space-y-5">
                <EditableCard
                  student={s}
                  title="Atribúty pre obsadenie"
                  icon={Ruler}
                  contentClassName="grid grid-cols-2 gap-x-8 sm:grid-cols-3"
                  fields={[
                    { key: "heightCm", label: "Výška (cm)", type: "number" },
                    { key: "weightKg", label: "Hmotnosť (kg)", type: "number" },
                    {
                      key: "eyeColor",
                      label: "Farba očí",
                      type: "select",
                      options: EYE_COLORS,
                    },
                    {
                      key: "hairColor",
                      label: "Farba vlasov",
                      type: "select",
                      options: HAIR_COLORS,
                    },
                    {
                      key: "clothingSize",
                      label: "Oblečenie",
                      type: "select",
                      options: ["XS", "S", "M", "L", "XL"],
                    },
                    { key: "shoeEu", label: "Veľkosť obuvi (EU)", type: "number" },
                  ]}
                >
                  <InfoRow icon={Ruler} label="Výška" value={`${s.heightCm} cm`} editKey="heightCm" editType="number" />
                  <InfoRow icon={Weight} label="Hmotnosť" value={`${s.weightKg} kg`} editKey="weightKg" editType="number" />
                  <InfoRow icon={Eye} label="Farba očí" value={s.eyeColor} editKey="eyeColor" editType="select" editOptions={EYE_COLORS} />
                  <InfoRow icon={Palette} label="Farba vlasov" value={s.hairColor} editKey="hairColor" editType="select" editOptions={HAIR_COLORS} />
                  <InfoRow icon={Shirt} label="Oblečenie" value={s.clothingSize} editKey="clothingSize" editType="select" editOptions={["XS", "S", "M", "L", "XL"]} />
                  <InfoRow icon={Ruler} label="Obuv (EU)" value={s.shoeEu || "—"} editKey="shoeEu" editType="number" />
                </EditableCard>

                <EditableCard
                  student={s}
                  title="Rozšírený vzhľad"
                  icon={Eye}
                  contentClassName="grid grid-cols-2 gap-x-8 sm:grid-cols-3"
                  fields={[
                    { key: "apparentAge", label: "Vekový vzhľad", type: "text" },
                    { key: "ethnicity", label: "Etnický vzhľad", type: "text" },
                    { key: "bodyType", label: "Typ postavy", type: "text" },
                    { key: "hairLength", label: "Dĺžka vlasov", type: "text" },
                    { key: "hairType", label: "Typ vlasov", type: "text" },
                    { key: "beard", label: "Brada / fúzy", type: "text" },
                  ]}
                >
                  <InfoRow icon={User} label="Vekový vzhľad" value={s.apparentAge || "—"} editKey="apparentAge" editType="text" />
                  <InfoRow icon={User} label="Etnický vzhľad" value={s.ethnicity || "—"} editKey="ethnicity" editType="text" />
                  <InfoRow icon={User} label="Typ postavy" value={s.bodyType || "—"} editKey="bodyType" editType="text" />
                  <InfoRow icon={Palette} label="Dĺžka vlasov" value={s.hairLength || "—"} editKey="hairLength" editType="text" />
                  <InfoRow icon={Palette} label="Typ vlasov" value={s.hairType || "—"} editKey="hairType" editType="text" />
                  <InfoRow icon={User} label="Brada / fúzy" value={s.beard || "—"} editKey="beard" editType="text" />
                </EditableCard>

                <EditableCard
                  student={s}
                  title="Telesné miery"
                  icon={Ruler}
                  contentClassName="grid grid-cols-2 gap-x-8 sm:grid-cols-3"
                  fields={[
                    { key: "suitSize", label: "Veľkosť obleku / kostýmu", type: "text" },
                    { key: "chestCircumference", label: "Obvod hrudníka (cm)", type: "number" },
                    { key: "waistCircumference", label: "Obvod pása (cm)", type: "number" },
                    { key: "hipsCircumference", label: "Obvod bokov (cm)", type: "number" },
                    { key: "headCircumference", label: "Obvod hlavy (cm)", type: "number" },
                    { key: "neckCircumference", label: "Obvod krku (cm)", type: "number" },
                  ]}
                >
                  <InfoRow icon={Shirt} label="Oblek/kostým" value={s.suitSize || "—"} editKey="suitSize" editType="text" />
                  <InfoRow icon={Ruler} label="Obvod hrudníka" value={s.chestCircumference ? `${s.chestCircumference} cm` : "—"} editKey="chestCircumference" editType="number" />
                  <InfoRow icon={Ruler} label="Obvod pása" value={s.waistCircumference ? `${s.waistCircumference} cm` : "—"} editKey="waistCircumference" editType="number" />
                  <InfoRow icon={Ruler} label="Obvod bokov" value={s.hipsCircumference ? `${s.hipsCircumference} cm` : "—"} editKey="hipsCircumference" editType="number" />
                  <InfoRow icon={Ruler} label="Obvod hlavy" value={s.headCircumference ? `${s.headCircumference} cm` : "—"} editKey="headCircumference" editType="number" />
                  <InfoRow icon={Ruler} label="Obvod krku" value={s.neckCircumference ? `${s.neckCircumference} cm` : "—"} editKey="neckCircumference" editType="number" />
                </EditableCard>

                <EditableCard
                  student={s}
                  title="Zručnosti a jazyky"
                  icon={Sparkles}
                  contentClassName="space-y-4"
                  fields={[
                    {
                      key: "skills",
                      label: "Zručnosti (oddelené čiarkou)",
                      type: "list",
                    },
                    {
                      key: "languages",
                      label: "Jazyky (oddelené čiarkou)",
                      type: "list",
                    },
                  ]}
                >
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Zručnosti
                    </p>
                    <SkillsList
                      skills={s.skills}
                      editKey="skills"
                      placeholder="Zručnosti oddelené čiarkou"
                    />
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Languages className="size-3.5" /> Jazyky
                    </p>
                    <SkillsList
                      skills={s.languages}
                      editKey="languages"
                      placeholder="Jazyky oddelené čiarkou"
                    />
                  </div>
                </EditableCard>

                <EditableCard
                  student={s}
                  title="Rozšírené zručnosti a charakteristiky"
                  icon={Sparkles}
                  contentClassName="space-y-4"
                  fields={[
                    { key: "instruments", label: "Hudobné nástroje (čiarkou)", type: "list" },
                    { key: "danceStyles", label: "Tanec (čiarkou)", type: "list" },
                    { key: "sports", label: "Športy (čiarkou)", type: "list" },
                    { key: "drivingLicences", label: "Vodičské preukazy (čiarkou)", type: "list" },
                    { key: "distinctiveFeatures", label: "Unikátne znaky (čiarkou)", type: "list" },
                    { key: "otherSkills", label: "Iné zručnosti", type: "text" },
                    { key: "otherTalents", label: "Iné talenty", type: "text" },
                    { key: "accent", label: "Akcent", type: "text" },
                    { key: "voiceSpeak", label: "Výška hlasu (reč)", type: "text" },
                    { key: "handicaps", label: "Hendikepy / iné", type: "textarea" },
                  ]}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Hudobné nástroje</p>
                      <SkillsList skills={s.instruments || []} editKey="instruments" placeholder="Nástroje oddelené čiarkou" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Tanec</p>
                      <SkillsList skills={s.danceStyles || []} editKey="danceStyles" placeholder="Tance oddelené čiarkou" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Športy a bojové umenia</p>
                      <SkillsList skills={s.sports || []} editKey="sports" placeholder="Športy oddelené čiarkou" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Vodičské oprávnenia</p>
                      <SkillsList skills={s.drivingLicences || []} editKey="drivingLicences" placeholder="Vodičáky oddelené čiarkou" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Unikátne znaky</p>
                      <SkillsList skills={s.distinctiveFeatures || []} editKey="distinctiveFeatures" placeholder="Znaky oddelené čiarkou" />
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                    <InfoRow icon={Sparkles} label="Iné zručnosti" value={s.otherSkills || "—"} editKey="otherSkills" editType="text" />
                    <InfoRow icon={Sparkles} label="Iné talenty" value={s.otherTalents || "—"} editKey="otherTalents" editType="text" />
                    <InfoRow icon={Languages} label="Akcent" value={s.accent || "—"} editKey="accent" editType="text" />
                    <InfoRow icon={Mic2} label="Hlas (reč)" value={s.voiceSpeak || "—"} editKey="voiceSpeak" editType="text" />
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Hendikepy a iné obmedzenia</p>
                    <TextareaSection note={s.handicaps || ""} editKey="handicaps" placeholder="Popíšte prípadné hendikepy..." fallback="Bez obmedzení." />
                  </div>
                </EditableCard>

                <EditableCard
                  student={s}
                  title="Sociálne siete a web"
                  icon={Share2}
                  contentClassName="space-y-4"
                  fields={[
                    { key: "igFollowers", label: "Instagram (sledovatelia)", type: "number" },
                    { key: "ttFollowers", label: "TikTok (sledovatelia)", type: "number" },
                    { key: "ytFollowers", label: "YouTube (sledovatelia)", type: "number" },
                    { key: "fbFollowers", label: "Facebook (sledovatelia)", type: "number" },
                    { key: "urlWeb", label: "Web URL", type: "text" },
                    { key: "urlIg", label: "Instagram URL", type: "text" },
                    { key: "urlTt", label: "TikTok URL", type: "text" },
                    { key: "urlYt", label: "YouTube URL", type: "text" },
                    { key: "urlFb", label: "Facebook URL", type: "text" },
                    { key: "urlLi", label: "LinkedIn URL", type: "text" },
                    { key: "urlImdb", label: "IMDB URL", type: "text" },
                    { key: "urlCsfd", label: "ČSFD URL", type: "text" },
                    { key: "urlIdiv", label: "iDivadlo URL", type: "text" },
                  ]}
                >
                  <div className="grid grid-cols-2 gap-y-2 gap-x-8 sm:grid-cols-4">
                    <InfoRow icon={Share2} label="Instagram (sleď.)" value={s.igFollowers || 0} editKey="igFollowers" editType="number" />
                    <InfoRow icon={Share2} label="TikTok (sleď.)" value={s.ttFollowers || 0} editKey="ttFollowers" editType="number" />
                    <InfoRow icon={Share2} label="YouTube (sleď.)" value={s.ytFollowers || 0} editKey="ytFollowers" editType="number" />
                    <InfoRow icon={Share2} label="Facebook (sleď.)" value={s.fbFollowers || 0} editKey="fbFollowers" editType="number" />
                  </div>
                  
                  <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                    <ContactRow icon={Link2} label="Web" value={s.urlWeb} href={s.urlWeb} editKey="urlWeb" />
                    <ContactRow icon={Link2} label="Instagram" value={s.urlIg} href={s.urlIg} editKey="urlIg" />
                    <ContactRow icon={Link2} label="TikTok" value={s.urlTt} href={s.urlTt} editKey="urlTt" />
                    <ContactRow icon={Link2} label="YouTube" value={s.urlYt} href={s.urlYt} editKey="urlYt" />
                    <ContactRow icon={Link2} label="Facebook" value={s.urlFb} href={s.urlFb} editKey="urlFb" />
                    <ContactRow icon={Link2} label="LinkedIn" value={s.urlLi} href={s.urlLi} editKey="urlLi" />
                    <ContactRow icon={Link2} label="IMDB" value={s.urlImdb} href={s.urlImdb} editKey="urlImdb" />
                    <ContactRow icon={Link2} label="ČSFD" value={s.urlCsfd} href={s.urlCsfd} editKey="urlCsfd" />
                    <ContactRow icon={Link2} label="iDivadlo" value={s.urlIdiv} href={s.urlIdiv} editKey="urlIdiv" />
                  </div>
                </EditableCard>

                <EditableCard
                  student={s}
                  title="Poznámka pedagóga"
                  icon={Quote}
                  fields={[
                    {
                      key: "tutorNote",
                      label: "Poznámka pedagóga",
                      type: "textarea",
                    },
                  ]}
                >
                  <TutorNoteSection note={s.tutorNote || ""} />
                </EditableCard>
              </div>
            </TabsContent>

            {/* DOKUMENTY */}
            <TabsContent value="documents">
              <div className="space-y-5">
                <DocSection title="Agentúra" docs={agentura} />
                <DocSection title="Rodičia" docs={rodicia} />
              </div>
            </TabsContent>

            {/* MÉDIÁ */}
            <TabsContent value="media">
              {s.media.length === 0 ? (
                <Card className="py-12 text-center text-sm text-muted-foreground">
                  Žiadne médiá.
                </Card>
              ) : (
                <div className="space-y-6">
                  {photos.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-sm font-semibold">
                        Fotografie{" "}
                        <span className="font-normal text-muted-foreground">
                          ({photos.length})
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {photos.map((m) => (
                          <MediaTile key={m.id} item={m} />
                        ))}
                      </div>
                    </section>
                  )}
                  {videos.length > 0 && (
                    <section>
                      <h3 className="mb-3 text-sm font-semibold">
                        Videá{" "}
                        <span className="font-normal text-muted-foreground">
                          ({videos.length})
                        </span>
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {videos.map((m) => (
                          <MediaTile key={m.id} item={m} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </TabsContent>

            {/* HONORÁRE */}
            <TabsContent value="honorare">
              <HonorareTab studentId={s.id} />
            </TabsContent>

            {/* SKÚSENOSTI */}
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    Projekty a skúsenosti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Zatiaľ žiadne zaznamenané projekty.
                    </p>
                  ) : (
                    <ol className="relative ml-2 border-l border-border">
                      {timeline.map((it, i) => (
                        <li key={i} className="relative pl-6 pb-6 last:pb-0">
                          <span className="absolute -left-[7px] top-1 size-3.5 rounded-full border-[3px] border-card bg-primary" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                              {it.year}
                            </span>
                            {it.isProject && (
                              <Badge variant="gold" className="px-1.5 py-0 text-[10px]">
                                Nový projekt
                              </Badge>
                            )}
                          </div>
                          <div className="mt-0.5 font-semibold leading-snug">
                            {it.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {it.role}
                            {it.org ? ` · ${it.org}` : ""}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
