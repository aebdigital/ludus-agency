import { supabase } from "@/lib/supabase/client";

// Private bucket shared with the ludus_* tables. Files are read via short-lived
// signed URLs (see signPaths). Access is restricted to Ludus members by the
// storage RLS policies in supabase/migrations/0003_ludus_storage.sql.
export const STORAGE_BUCKET = "ludus";
const SIGNED_TTL = 60 * 60; // 1 hour

export async function uploadFile(
  path: string,
  file: File
): Promise<{ error?: string }> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
  return { error: error?.message };
}

export async function removeFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) console.error("removeFile:", error.message);
}

/** Batch-sign storage paths → Map<path, signedUrl>. */
export async function signPaths(paths: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const clean = [...new Set(paths.filter(Boolean))];
  if (clean.length === 0) return map;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrls(clean, SIGNED_TTL);
  if (error) {
    console.error("signPaths:", error.message);
    return map;
  }
  for (const item of data ?? []) {
    if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
  }
  return map;
}

/** ASCII-safe, filesystem-safe file name for storage keys. */
export function sanitizeName(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_") || "file"
  );
}

export function randomId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}
