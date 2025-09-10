"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authService } from "@/services";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setSuccess(
        t("success", {
          default: "Si l'adresse existe, un email de réinitialisation a été envoyé.",
        }),
      );
    } catch (err: any) {
      setError(t("error", { default: "Une erreur est survenue. Veuillez réessayer plus tard." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md h-screen flex flex-col justify-center p-8">
      <div className="flex justify-center mb-6">
        <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
      </div>
      <h1 className="text-2xl font-display mb-2">
        {t("title", { default: "Mot de passe oublié" })}
      </h1>
      <p className="text-muted-foreground mb-6">
        {t("subtitle", {
          default: "Entrez votre email pour recevoir un lien de réinitialisation.",
        })}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium" htmlFor="email">
          {t("email", { default: "Email" })}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("loading", { default: "Envoi..." }) : t("submit", { default: "Envoyer" })}
        </Button>
      </form>

      {success && <p className="mt-4 text-sm text-success">{success}</p>}
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </main>
  );
}
