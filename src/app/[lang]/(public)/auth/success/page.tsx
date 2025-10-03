"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { authCookies } from "@/lib/cookies-client";
import Image from "next/image";
import { Loader } from "@/components/ui/loader";

export default function OAuthSuccessPage() {
  const t = useTranslations("Auth.success");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        // Extract query parameters
        const token = searchParams.get("token");
        const newUser = searchParams.get("newUser");
        const requiresPassword = searchParams.get("requiresPassword");

        if (!token) {
          setError("No authentication token received");
          return;
        }

        // Store token in cookies
        authCookies.setToken(token);

        // Determine redirect path
        let redirectPath = "/dashboard";

        // If new user, could redirect to onboarding
        if (newUser === "1") {
          // For now, just go to dashboard
          // In future: redirectPath = "/onboarding";
        }

        // If requires password setup, could redirect to password setup
        if (requiresPassword === "1") {
          // For now, just go to dashboard
          // In future: redirectPath = "/auth/set-password";
        }

        // Small delay to show success message
        setTimeout(() => {
          router.replace(redirectPath);
        }, 1500);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Failed to process authentication");
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center">
              <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t("error_title", { default: "Authentication Error" })}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
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

            <p className="text-gray-600 mb-6">{error}</p>

            <button
              onClick={() => router.push("/auth/login")}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              {t("back_to_login", { default: "Back to Login" })}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t("title", { default: "Authentication Successful" })}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
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

          <p className="text-gray-600 mb-6">
            {t("redirecting", { default: "Redirecting you to dashboard..." })}
          </p>

          <Loader size="sm" />
        </div>
      </div>
    </div>
  );
}
