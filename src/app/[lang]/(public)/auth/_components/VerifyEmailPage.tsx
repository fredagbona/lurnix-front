"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks";
import Image from "next/image";

export function VerifyEmailPage() {
  const t = useTranslations("Auth.verifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const lang = params.lang as string;
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const hasAttemptedVerification = useRef(false);

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token manquant");
      return;
    }

    // Vérifier si on a déjà tenté la vérification
    if (hasAttemptedVerification.current) {
      return;
    }

    hasAttemptedVerification.current = true;

    verifyEmailMutation.mutate(token, {
      onSuccess: () => {
        setStatus("success");
        setMessage("Email vérifié avec succès !");
      },
      onError: (error: any) => {
        setStatus("error");
        if (error?.status === 400) {
          setMessage(
            "Token invalide ou expiré. Veuillez demander un nouveau lien de vérification.",
          );
        } else {
          setMessage("Erreur lors de la vérification de l'email. Veuillez réessayer.");
        }
      },
    });
  }, [token, verifyEmailMutation]); // Ajouter verifyEmailMutation pour éviter le warning

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={60} height={60} />
            </div>
          </div>

          {status === "loading" && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("loading")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Veuillez patienter pendant que nous vérifions votre email.
              </p>
              <div className="mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
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
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("success")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t("success_message")}</p>
              <Button
                onClick={() => router.push(`/${lang}/auth/login`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("sign_in_button")}
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("error")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message || t("error_message")}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setStatus("loading");
                    setMessage("");
                    hasAttemptedVerification.current = false; // Reset pour permettre une nouvelle tentative
                    if (token) {
                      verifyEmailMutation.mutate(token, {
                        onSuccess: () => {
                          setStatus("success");
                          setMessage("Email vérifié avec succès !");
                        },
                        onError: (error: any) => {
                          setStatus("error");
                          if (error?.status === 400) {
                            setMessage(
                              "Token invalide ou expiré. Veuillez demander un nouveau lien de vérification.",
                            );
                          } else {
                            setMessage(
                              "Erreur lors de la vérification de l'email. Veuillez réessayer.",
                            );
                          }
                        },
                      });
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t("retry_button")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/${lang}/auth/login`)}
                  className="w-full"
                >
                  {t("back_to_login")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
