import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Status, DocStatus, Program } from "@/lib/data";
import { programAccent } from "@/lib/data";

const statusMap: Record<Status, { variant: Parameters<typeof Badge>[0]["variant"]; dot: string }> = {
  Aktívny: { variant: "success", dot: "var(--success)" },
  Konkurz: { variant: "default", dot: "var(--primary)" },
  "Na voľne": { variant: "warning", dot: "var(--warning)" },
  Absolvent: { variant: "secondary", dot: "var(--muted-foreground)" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { variant, dot } = statusMap[status];
  return (
    <Badge variant={variant} className="gap-1.5">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {status}
    </Badge>
  );
}

const docMap: Record<DocStatus, Parameters<typeof Badge>[0]["variant"]> = {
  Podpísané: "success",
  "Čaká sa": "warning",
  Vypršané: "destructive",
};

export function DocStatusBadge({ status }: { status: DocStatus }) {
  return <Badge variant={docMap[status]}>{status}</Badge>;
}

export function ProgramBadge({
  program,
  className,
}: {
  program: Program;
  className?: string;
}) {
  const color = programAccent[program];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <span className="size-2 rounded-[3px]" style={{ backgroundColor: color }} />
      {program}
    </span>
  );
}
