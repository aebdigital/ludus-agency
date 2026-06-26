"use client";

import { useState } from "react";
import { Drama, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setError(
        error === "Invalid login credentials"
          ? "Nesprávny e-mail alebo heslo."
          : error
      );
      setBusy(false);
    }
    // On success the auth listener swaps the view; no need to reset busy.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-3 flex size-12 items-center justify-center rounded-xl text-white shadow-pop"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.62 0.18 300), oklch(0.5 0.2 280))",
            }}
          >
            <Drama className="size-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Ludus Agency</h1>
          <p className="text-sm text-muted-foreground">
            Prihláste sa do databázy
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  E-mail
                </span>
                <Input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Heslo
                </span>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full gap-2" disabled={busy}>
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogIn className="size-4" />
                )}
                Prihlásiť sa
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Prístup spravuje administrátor agentúry.
        </p>
      </div>
    </div>
  );
}
