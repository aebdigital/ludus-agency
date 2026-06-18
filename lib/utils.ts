import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic gradient pair from a string seed — used for avatars & media tiles. */
export function gradientFromSeed(seed: string): { from: string; to: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 38) % 360;
  return {
    from: `oklch(0.62 0.16 ${h1})`,
    to: `oklch(0.52 0.18 ${h2})`,
  };
}

export function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sk-SK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Vek vypočítaný z dátumu narodenia (aktualizuje sa automaticky). */
export function computeAge(iso: string): number {
  const dob = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}
