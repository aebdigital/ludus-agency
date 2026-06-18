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
import { EditableCard } from "@/components/student/editable-card";
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
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
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
            ]}
          >
            <InfoRow
              icon={Cake}
              label="Dátum narodenia"
              value={`${formatDate(s.dateOfBirth)} · ${s.age} r.`}
            />
            <InfoRow icon={User} label="Pohlavie" value={s.gender} />
            <InfoRow icon={Presentation} label="Pedagóg" value={s.teacher} />
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
            contentClassName="space-y-3"
            fields={[
              { key: "phone", label: "Telefón dieťaťa", type: "text" },
              { key: "email", label: "E-mail dieťaťa", type: "text" },
            ]}
          >
            <div className="space-y-1.5">
              <a
                href={`tel:${s.phone ?? ""}`}
                className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary"
              >
                <Phone className="size-4 text-muted-foreground" />
                {s.phone || "—"}
              </a>
              <a
                href={`mailto:${s.email ?? ""}`}
                className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary"
              >
                <Mail className="size-4 text-muted-foreground" />
                {s.email || "—"}
              </a>
            </div>
            {parentEmails.length > 0 && (
              <div className="rounded-lg border border-border bg-secondary/50 p-2.5">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Kontakt na rodičov
                </p>
                <div className="space-y-1">
                  {parentEmails.map((em) => (
                    <a
                      key={em}
                      href={`mailto:${em}`}
                      className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary"
                    >
                      <Mail className="size-4 text-muted-foreground" />
                      {em}
                    </a>
                  ))}
                </div>
              </div>
            )}
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
                  ]}
                >
                  <InfoRow icon={Ruler} label="Výška" value={`${s.heightCm} cm`} />
                  <InfoRow icon={Weight} label="Hmotnosť" value={`${s.weightKg} kg`} />
                  <InfoRow icon={Eye} label="Farba očí" value={s.eyeColor} />
                  <InfoRow icon={Palette} label="Farba vlasov" value={s.hairColor} />
                  <InfoRow icon={Shirt} label="Oblečenie" value={s.clothingSize} />
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
                    {s.skills.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {s.skills.map((sk) => (
                          <Badge key={sk} variant="default">
                            {sk}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Languages className="size-3.5" /> Jazyky
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.languages.map((l) => (
                        <Badge key={l} variant="secondary">
                          {l}
                        </Badge>
                      ))}
                    </div>
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
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {s.tutorNote || "Zatiaľ bez poznámky."}
                  </p>
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
