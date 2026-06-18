import { Check, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <Input defaultValue={defaultValue} type={type} />
    </label>
  );
}

const recordFields = [
  "Výška",
  "Hmotnosť",
  "Farba očí",
  "Farba vlasov",
  "Veľkosť obuvi",
  "Veľkosť oblečenia",
  "Typ hlasu",
  "Zručnosti",
  "Jazyky",
  "Kontakt na rodiča",
];

const team = [
  { first: "Katarína", last: "Baranová", role: "Umelecká riaditeľka", access: "Vlastník" },
  { first: "Tomáš", last: "Vavrinec", role: "Pedagóg herectva", access: "Editor" },
  { first: "Elena", last: "Hudecová", role: "Pedagóg tanca", access: "Editor" },
  { first: "Študijné", last: "Oddelenie", role: "Administratíva", access: "Editor" },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Nastavenia"
        description="Spravujte profil štúdia, evidenčné polia a prístup tímu."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profil štúdia</CardTitle>
          <CardDescription>
            Tieto údaje sa zobrazujú v reportoch a exportoch.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Názov štúdia" defaultValue="Divadelné štúdio Ludus" />
          <Field label="Školský rok" defaultValue="2025 / 2026" />
          <Field label="Kontaktný e-mail" defaultValue="kancelaria@ludus.sk" type="email" />
          <Field label="Telefón" defaultValue="+421 905 000 100" />
          <div className="sm:col-span-2">
            <Field label="Adresa" defaultValue="Divadelná 12, 811 01 Bratislava, Slovensko" />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Button size="sm">Uložiť zmeny</Button>
            <Button size="sm" variant="ghost">
              Zrušiť
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidenčné polia študenta</CardTitle>
          <CardDescription>
            Atribúty evidované pri každom študentovi. Na nich sú postavené filtre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recordFields.map((f) => (
              <Badge key={f} variant="secondary" className="gap-1.5 py-1">
                <Check className="size-3 text-[var(--success)]" />
                {f}
              </Badge>
            ))}
            <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary">
              <Plus className="size-3" /> Pridať pole
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Tím a prístup</CardTitle>
            <CardDescription>
              Ľudia, ktorí môžu zobrazovať a upravovať záznamy.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="size-4" /> Pozvať
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {team.map((m) => (
            <div key={m.first + m.last} className="flex items-center gap-3 py-3">
              <Avatar firstName={m.first} lastName={m.last} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">
                  {m.first} {m.last}
                </div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </div>
              <Badge variant={m.access === "Vlastník" ? "default" : "outline"}>
                {m.access}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
