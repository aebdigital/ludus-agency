import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { Eye, Ruler, Cake, Weight, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/badges";
import { gradientFromSeed, initials } from "@/lib/utils";
import type { Student } from "@/lib/data";

function Attr({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
      <Icon className="size-3 text-muted-foreground" />
      {children}
    </span>
  );
}

export function StudentCard({ student: s }: { student: Student }) {
  const { from, to } = gradientFromSeed(s.firstName + s.lastName);
  return (
    <Link
      href={`/students/${s.id}`}
      className="group flex overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop"
    >
      {/* Foto — väčšie, zarovnané do rohu bez okrajov */}
      <div
        className="relative w-24 shrink-0 self-stretch sm:w-28"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_60%)]" />
        <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white">
          {initials(s.firstName, s.lastName)}
        </span>
      </div>

      {/* Obsah */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold leading-tight">
            {s.lastName} {s.firstName}
          </h3>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div>
          <StatusBadge status={s.status} />
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          <Attr icon={Cake}>{s.age} r.</Attr>
          <Attr icon={Ruler}>{s.heightCm} cm</Attr>
          <Attr icon={Weight}>{s.weightKg} kg</Attr>
          <Attr icon={Eye}>{s.eyeColor}</Attr>
        </div>
      </div>
    </Link>
  );
}
