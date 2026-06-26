import type { ComponentType } from "react";
import { Play, Image as ImageIcon, Film, Camera } from "lucide-react";
import { gradientFromSeed, cn, formatDate } from "@/lib/utils";
import type { MediaItem, MediaKind } from "@/lib/data";

function durationLabel(sec?: number) {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const kindIcon: Record<MediaKind, ComponentType<{ className?: string }>> = {
  Portrét: Camera,
  "Foto z predstavenia": ImageIcon,
  "Konkurzné video": Film,
  "Video z predstavenia": Film,
};

export function MediaTile({
  item,
  ownerName,
  className,
}: {
  item: MediaItem;
  ownerName?: string;
  className?: string;
}) {
  const isVideo =
    item.kind === "Konkurzné video" || item.kind === "Video z predstavenia";
  const { from, to } = gradientFromSeed(item.id + item.title);
  const Icon = kindIcon[item.kind];
  const hasPhoto = Boolean(item.url) && !isVideo;

  const media = (
    <div
      className="relative aspect-[4/3] w-full"
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {hasPhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.title}
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {/* jemná textúra (iba keď nie je fotka) */}
      {!hasPhoto && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
      )}

      {/* štítok typu */}
      <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
        <Icon className="size-3" />
        {item.kind}
      </span>

      {/* ovládanie videa */}
      {isVideo ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-foreground shadow-pop transition-transform group-hover:scale-110">
              <Play className="size-5 translate-x-0.5 fill-current" />
            </span>
          </div>
          {durationLabel(item.durationSec) && (
            <span className="absolute bottom-2.5 right-2.5 rounded bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {durationLabel(item.durationSec)}
            </span>
          )}
        </>
      ) : null}
    </div>
  );

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-pop",
        className
      )}
    >
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {media}
        </a>
      ) : (
        media
      )}

      <figcaption className="px-3 py-2.5">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {ownerName && (
            <>
              <span className="truncate">{ownerName}</span>
              <span>·</span>
            </>
          )}
          <span>{formatDate(item.capturedAt)}</span>
        </p>
      </figcaption>
    </figure>
  );
}
