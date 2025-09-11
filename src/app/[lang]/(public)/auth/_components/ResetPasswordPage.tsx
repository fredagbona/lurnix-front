"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateEmail } from "@/validations";
import { usePasswordReset } from "@/hooks";
import Image from "next/image";

export function ResetPasswordPage() {
  const t = useTranslations("Auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const passwordResetMutation = usePasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError("");

    // Use TanStack Query mutation
    passwordResetMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
        onError: (error) => {
          console.error("Password reset failed:", error);
          setError("Failed to send reset email. Please try again.");
        },
      },
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center">
              <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={60} height={60} />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("email_sent_title")}</h2>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t("success")}</h3>
            <p className="text-sm text-gray-600 mb-6">{t("email_sent_message", { email })}</p>
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors">
                  {t("back_to_sign_in")}
                </Button>
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t("try_different_email")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={60} height={60} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("form_title")}</h2>
          <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("email_placeholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              {error && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={passwordResetMutation.isPending || !email}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
            >
              {passwordResetMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("loading")}
                </div>
              ) : (
                t("submit")
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t("back_to_sign_in")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
