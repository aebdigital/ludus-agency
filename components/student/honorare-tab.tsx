"use client";

import { useMemo, useState } from "react";
import { Wallet, Plus, Check, Coins } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getFees, nextMonthLabel, type Fee } from "@/lib/honorare";

function cloneFees(fees: Fee[]): Fee[] {
  return fees.map((f) => ({
    ...f,
    months: f.months?.map((mm) => ({ ...mm })),
  }));
}

function PaidCheckbox({
  paid,
  onClick,
}: {
  paid: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={paid}
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
        paid
          ? "border-transparent bg-[var(--success)] text-white"
          : "border-border bg-card hover:border-ring"
      )}
    >
      {paid && <Check className="size-3.5" strokeWidth={3} />}
    </button>
  );
}

function StatusBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <Badge variant="success">Vyplatené</Badge>
  ) : (
    <Badge variant="warning">Čaká</Badge>
  );
}

export function HonorareTab({ studentId }: { studentId: string }) {
  const [fees, setFees] = useState<Fee[]>(() => cloneFees(getFees(studentId)));

  const toggleOneTime = (feeId: string) =>
    setFees((prev) =>
      prev.map((f) => (f.id === feeId ? { ...f, paid: !f.paid } : f))
    );

  const toggleMonth = (feeId: string, idx: number) =>
    setFees((prev) =>
      prev.map((f) =>
        f.id === feeId
          ? {
              ...f,
              months: f.months?.map((mm, i) =>
                i === idx ? { ...mm, paid: !mm.paid } : mm
              ),
            }
          : f
      )
    );

  const addMonth = (feeId: string) =>
    setFees((prev) =>
      prev.map((f) => {
        if (f.id !== feeId) return f;
        const months = f.months ?? [];
        const last = months[months.length - 1]?.label;
        return {
          ...f,
          months: [...months, { label: nextMonthLabel(last), paid: false }],
        };
      })
    );

  const totals = useMemo(() => {
    let due = 0;
    let paid = 0;
    for (const f of fees) {
      if (f.type === "Jednorazový") {
        due += f.amount;
        if (f.paid) paid += f.amount;
      } else {
        for (const mm of f.months ?? []) {
          due += f.amount;
          if (mm.paid) paid += f.amount;
        }
      }
    }
    return { due, paid, pending: due - paid };
  }, [fees]);

  if (fees.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Wallet className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Žiak zatiaľ nemá evidované žiadne honoráre.
        </p>
      </Card>
    );
  }

  const summary = [
    { label: "Honorár spolu", value: totals.due, accent: "oklch(0.55 0.19 285)" },
    { label: "Vyplatené", value: totals.paid, accent: "oklch(0.62 0.15 152)" },
    { label: "Čaká na vyplatenie", value: totals.pending, accent: "oklch(0.7 0.15 70)" },
  ];

  return (
    <div className="space-y-5">
      {/* Súhrn */}
      <div className="grid grid-cols-3 gap-3">
        {summary.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div
                className="text-2xl font-semibold tracking-tight tabular-nums"
                style={{ color: s.accent }}
              >
                {s.value} €
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Honoráre podľa projektov */}
      {fees.map((f) => (
        <Card key={f.id} className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Coins className="size-4" />
              </span>
              <div>
                <CardTitle className="text-[15px]">{f.project}</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {f.type === "Mesačný"
                    ? `${f.amount} € / mesiac`
                    : `${f.amount} € jednorazovo`}
                </p>
              </div>
            </div>
            <Badge variant={f.type === "Mesačný" ? "default" : "gold"}>
              {f.type}
            </Badge>
          </CardHeader>

          <CardContent className="pt-0">
            {f.type === "Jednorazový" ? (
              <div className="flex w-full items-center gap-3 rounded-lg border border-border p-3">
                <PaidCheckbox paid={!!f.paid} onClick={() => toggleOneTime(f.id)} />
                <span className="flex-1 text-sm font-medium">
                  Jednorazová platba
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {f.amount} €
                </span>
                <StatusBadge paid={!!f.paid} />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="divide-y divide-border rounded-lg border border-border">
                  {f.months?.map((mm, i) => (
                    <div
                      key={mm.label + i}
                      className="flex items-center gap-3 p-3"
                    >
                      <PaidCheckbox
                        paid={mm.paid}
                        onClick={() => toggleMonth(f.id, i)}
                      />
                      <span className="flex-1 text-sm font-medium capitalize">
                        {mm.label}
                      </span>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {f.amount} €
                      </span>
                      <StatusBadge paid={mm.paid} />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addMonth(f.id)}
                  className="w-full border-dashed"
                >
                  <Plus className="size-4" /> Pridať mesiac
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
