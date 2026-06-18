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
  Footprints,
  Shirt,
  Mic2,
  Cake,
  MapPin,
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
  Pencil,
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
import { StatusBadge, DocStatusBadge } from "@/components/shared/badges";
import { MediaTile } from "@/components/shared/media-tile";
import { HonorareTab } from "@/components/student/honorare-tab";
import { type StudentDocument } from "@/lib/data";
import { getExperience } from "@/lib/experience";
import { useStudent, useStudentProjects } from "@/lib/store";
import { formatDate, gradientFromSeed, initials } from "@/lib/utils";

const kindIcon: Record<string, ComponentType<{ className?: string }>> = {
  "Súhlas rodiča": ShieldAlert,
  "Lekárske tlačivo": FileText,
  "Súhlas s fotami a videom": FileText,
  "Zmluva o štúdiu": FileText,
  Vysvedčenie: GraduationCap,
  Štipendium: Sparkles,
};

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
                <TableHead className="hidden sm:table-cell">Typ</TableHead>
                <TableHead className="hidden md:table-cell">Pridané</TableHead>
                <TableHead className="hidden lg:table-cell">Kto</TableHead>
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
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {d.kind}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground md:table-cell">
                      {formatDate(d.uploadedAt)}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {d.addedBy}
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

  const { from, to } = gradientFromSeed(s.firstName + s.lastName);

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
        {/* ĽAVÝ stĺpec — veľká fotka + vždy viditeľné údaje */}
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div
              className="relative aspect-square w-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_60%)]" />
              <span className="absolute inset-0 flex items-center justify-center text-7xl font-semibold text-white">
                {initials(s.firstName, s.lastName)}
              </span>
            </div>
            <CardContent className="space-y-3 p-5">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h1 className="text-xl font-semibold tracking-tight">
                    {s.lastName} {s.firstName}
                  </h1>
                  {s.preferredName && (
                    <span className="text-sm text-muted-foreground">
                      „{s.preferredName}“
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="size-4" /> {s.cohort}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" /> {s.city}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                  <Pencil className="size-3.5" /> Upraviť
                </Button>
                <Button size="sm" className="flex-1 gap-1.5">
                  <Plus className="size-3.5" /> Pridať súbor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Osobné údaje — vždy viditeľné */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                Osobné údaje
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <InfoRow
                icon={Cake}
                label="Dátum narodenia"
                value={`${formatDate(s.dateOfBirth)} · ${s.age} r.`}
              />
              <InfoRow icon={User} label="Pohlavie" value={s.gender} />
              <InfoRow icon={User} label="Zámená" value={s.pronouns} />
              <InfoRow icon={Presentation} label="Pedagóg" value={s.teacher} />
              <InfoRow
                icon={CalendarDays}
                label="Zapísaný"
                value={formatDate(s.enrolledOn)}
              />
            </CardContent>
          </Card>

          {/* Rodič a núdzový kontakt — vždy viditeľné */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-primary" />
                Rodič a núdzový kontakt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">{s.guardianName}</p>
                <p className="text-xs text-muted-foreground">
                  {s.guardianRelation}
                </p>
              </div>
              <div className="space-y-1.5">
                <a
                  href={`tel:${s.guardianPhone}`}
                  className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary"
                >
                  <Phone className="size-4 text-muted-foreground" />
                  {s.guardianPhone || "—"}
                </a>
                <a
                  href={`mailto:${s.guardianEmail}`}
                  className="flex items-center gap-2 text-sm text-foreground/90 hover:text-primary"
                >
                  <Mail className="size-4 text-muted-foreground" />
                  {s.guardianEmail || "—"}
                </a>
              </div>
              {s.emergencyContact && (
                <div className="rounded-lg border border-border bg-secondary/50 p-2.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Núdzový kontakt
                  </p>
                  <p className="text-sm">{s.emergencyContact}</p>
                </div>
              )}
            </CardContent>
          </Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="size-4 text-primary" />
                      Atribúty pre obsadenie
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
                    <InfoRow icon={Ruler} label="Výška" value={`${s.heightCm} cm`} />
                    <InfoRow icon={Weight} label="Hmotnosť" value={`${s.weightKg} kg`} />
                    <InfoRow icon={Eye} label="Farba očí" value={s.eyeColor} />
                    <InfoRow icon={Palette} label="Farba vlasov" value={s.hairColor} />
                    <InfoRow icon={Footprints} label="Obuv (EU)" value={s.shoeEu} />
                    <InfoRow icon={Shirt} label="Oblečenie" value={s.clothingSize} />
                    {s.voiceType && (
                      <InfoRow icon={Mic2} label="Typ hlasu" value={s.voiceType} />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      Zručnosti a jazyky
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Quote className="size-4 text-primary" />
                      Profil a poznámka pedagóga
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {s.bio || "Zatiaľ bez popisu."}
                    </p>
                    {s.tutorNote && (
                      <div className="rounded-lg border border-border bg-secondary/50 p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Poznámka pedagóga
                        </p>
                        <p className="text-sm">{s.tutorNote}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
