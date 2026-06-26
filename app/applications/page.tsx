"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Loader2,
  ChevronDown,
  Phone,
  Mail,
  User,
  UserPlus,
  Trash2,
  Check,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { supabase } from "@/lib/supabase/client";
import { createStudentFromData } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { Student } from "@/lib/data";

interface Application {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  guardian_name: string | null;
  guardian_email: string | null;
  guardian_phone: string | null;
  data: Partial<Student> & Record<string, unknown>;
  status: string;
  created_at: string;
}

const STATUS: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
  new: { label: "Nová", variant: "default" },
  reviewed: { label: "Spracovaná", variant: "secondary" },
  approved: { label: "Prijatá", variant: "success" },
};

// Slovak labels for the most relevant application data fields.
const LABELS: Record<string, string> = {
  preferredName: "Prezývka",
  gender: "Pohlavie",
  city: "Bydlisko",
  school: "Umelecká škola",
  phone: "Telefón dieťaťa",
  email: "E-mail dieťaťa",
  heightCm: "Výška (cm)",
  weightKg: "Hmotnosť (kg)",
  apparentAge: "Vekový vzhľad",
  ethnicity: "Etnický vzhľad",
  bodyType: "Typ postavy",
  eyeColor: "Farba očí",
  hairColor: "Farba vlasov",
  hairLength: "Dĺžka vlasov",
  hairType: "Typ vlasov",
  beard: "Brada / fúzy",
  clothingSize: "Oblečenie",
  shoeEu: "Obuv (EU)",
  suitSize: "Oblek / kostým",
  chestCircumference: "Obvod hrudníka",
  waistCircumference: "Obvod pása",
  hipsCircumference: "Obvod bokov",
  headCircumference: "Obvod hlavy",
  neckCircumference: "Obvod krku",
  voiceType: "Typ hlasu (spev)",
  voiceSpeak: "Výška hlasu (reč)",
  skills: "Zručnosti",
  languages: "Jazyky",
  instruments: "Nástroje",
  danceStyles: "Tanec",
  sports: "Športy",
  drivingLicences: "Vodičské oprávnenia",
  distinctiveFeatures: "Unikátne znaky",
  handicaps: "Hendikepy",
  otherSkills: "Iné zručnosti",
  otherTalents: "Iné talenty",
  accent: "Akcent",
  igFollowers: "Instagram (sledovatelia)",
  ttFollowers: "TikTok (sledovatelia)",
  ytFollowers: "YouTube (sledovatelia)",
  fbFollowers: "Facebook (sledovatelia)",
  urlWeb: "Web",
  urlIg: "Instagram",
  urlTt: "TikTok",
  urlYt: "YouTube",
  urlFb: "Facebook",
  urlLi: "LinkedIn",
  urlImdb: "IMDB",
  urlCsfd: "ČSFD",
  urlIdiv: "iDivadlo",
};

function hasValue(v: unknown): boolean {
  if (v === null || v === undefined || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "number") return v !== 0;
  return true;
}

function render(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

function Details({ data }: { data: Application["data"] }) {
  const entries = Object.entries(LABELS).filter(([k]) => hasValue(data[k]));
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Bez ďalších údajov.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
      {entries.map(([k, label]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-border/60 py-1.5">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-right text-sm font-medium">{render(data[k])}</span>
        </div>
      ))}
    </div>
  );
}

function ApplicationRow({
  app,
  onChanged,
}: {
  app: Application;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<null | "promote" | "review" | "delete">(null);

  const name =
    [app.first_name, app.last_name].filter(Boolean).join(" ") || "Bez mena";
  const st = STATUS[app.status] ?? { label: app.status, variant: "default" as const };

  const promote = async () => {
    setBusy("promote");
    const { id, error } = await createStudentFromData(app.data);
    if (error) {
      setBusy(null);
      alert(`Nepodarilo sa vytvoriť študenta: ${error}`);
      return;
    }
    await supabase.from("ludus_applications").update({ status: "approved" }).eq("id", app.id);
    setBusy(null);
    onChanged();
    if (id && confirm("Študent bol vytvorený. Otvoriť jeho profil?")) {
      window.location.href = `/students/${id}`;
    }
  };

  const markReviewed = async () => {
    setBusy("review");
    await supabase.from("ludus_applications").update({ status: "reviewed" }).eq("id", app.id);
    setBusy(null);
    onChanged();
  };

  const remove = async () => {
    if (!confirm("Naozaj vymazať túto prihlášku?")) return;
    setBusy("delete");
    await supabase.from("ludus_applications").delete().eq("id", app.id);
    setBusy(null);
    onChanged();
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-tight">{name}</h3>
              <Badge variant={st.variant}>{st.label}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {app.date_of_birth && <span>nar. {formatDate(app.date_of_birth)}</span>}
              <span>Prijaté {formatDate(app.created_at)}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {app.guardian_name && (
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5 text-muted-foreground" />
                  {app.guardian_name}
                </span>
              )}
              {app.guardian_phone && (
                <a href={`tel:${app.guardian_phone}`} className="flex items-center gap-1.5 hover:text-primary">
                  <Phone className="size-3.5 text-muted-foreground" />
                  {app.guardian_phone}
                </a>
              )}
              {app.guardian_email && (
                <a href={`mailto:${app.guardian_email}`} className="flex items-center gap-1.5 hover:text-primary">
                  <Mail className="size-3.5 text-muted-foreground" />
                  {app.guardian_email}
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Detail
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="mt-4 border-t border-border pt-4">
            <Details data={app.data} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="gap-1.5" onClick={promote} disabled={busy !== null || app.status === "approved"}>
            {busy === "promote" ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
            Vytvoriť študenta
          </Button>
          {app.status === "new" && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={markReviewed} disabled={busy !== null}>
              {busy === "review" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Označiť ako spracované
            </Button>
          )}
          <Button size="sm" variant="ghost" className="ml-auto gap-1.5 text-destructive hover:text-destructive" onClick={remove} disabled={busy !== null}>
            {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Vymazať
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("ludus_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setApps([]);
      return;
    }
    setError(null);
    setApps((data ?? []) as Application[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Prihlášky"
        description="Prihlášky odoslané rodičmi cez verejný formulár /prihlaska."
      >
        <Link href="/prihlaska" target="_blank">
          <Button size="sm" variant="outline" className="gap-1.5">
            <ExternalLink className="size-4" /> Verejný formulár
          </Button>
        </Link>
      </PageHeader>

      {apps === null ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Nepodarilo sa načítať prihlášky: {error}
          </CardContent>
        </Card>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Inbox className="size-6" />
            </span>
            <p className="font-medium">Zatiaľ žiadne prihlášky</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Keď rodič vyplní verejný formulár, prihláška sa zobrazí tu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <ApplicationRow key={app.id} app={app} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
