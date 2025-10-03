"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function OAuthErrorPage() {
  const t = useTranslations("Auth.error");
  const router = useRouter();
  const searchParams = useSearchParams();

  const reason = searchParams.get("reason") || "unknown";

  const getErrorMessage = () => {
    switch (reason) {
      case "oauth_failed":
        return t("oauth_failed", {
          default: "OAuth authentication failed. Please try again.",
        });
      case "invalid_state":
        return t("invalid_state", {
          default: "Invalid authentication state. Please try again.",
        });
      case "access_denied":
        return t("access_denied", {
          default: "Access was denied. You need to grant permissions to continue.",
        });
      case "server_error":
        return t("server_error", {
          default: "A server error occurred. Please try again later.",
        });
      default:
        return t("unknown_error", {
          default: "An unexpected error occurred during authentication.",
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t("title", { default: "Authentication Failed" })}
          </h2>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            {/* Error Icon */}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("error_occurred", { default: "Something went wrong" })}
            </h3>
            <p className="text-gray-600 mb-6">{getErrorMessage()}</p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={() => router.push("/auth/login")} className="w-full h-12">
                {t("retry", { default: "Try Again" })}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/auth/register")}
                className="w-full h-12"
              >
                {t("create_account", { default: "Create an Account" })}
              </Button>
            </div>

            {/* Help Text */}
            <p className="mt-6 text-sm text-gray-500">
              {t("need_help", { default: "Need help?" })}{" "}
              <a href="mailto:support@lurnix.tech" className="text-primary hover:underline">
                {t("contact_support", { default: "Contact Support" })}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
