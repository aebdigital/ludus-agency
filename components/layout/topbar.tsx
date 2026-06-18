"use client";

import Link from "next/link";
import { Drama } from "lucide-react";

export function Topbar() {
  // Iba na mobile — na väčších obrazovkách slúži ako navigácia bočný panel.
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
      <Link href="/students" className="flex items-center gap-2">
        <div
          className="flex size-8 items-center justify-center rounded-lg text-white"
          style={{
            backgroundImage:
              "linear-gradient(135deg, oklch(0.62 0.18 300), oklch(0.5 0.2 280))",
          }}
        >
          <Drama className="size-4" />
        </div>
        <span className="font-semibold">Ludus</span>
      </Link>
    </header>
  );
}
