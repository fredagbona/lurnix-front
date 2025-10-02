"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Redirect handler for OAuth callbacks without locale
 * This catches /auth/success and redirects to /en/auth/success
 */
function OAuthSuccessRedirectContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get all query parameters
    const params = new URLSearchParams(searchParams.toString());

    // Detect user's preferred language from browser or use default
    const browserLang = navigator.language.split("-")[0];
    const locale = ["en", "fr"].includes(browserLang) ? browserLang : "en";

    // Redirect to localized success page with all query parameters
    const redirectUrl = `/${locale}/auth/success?${params.toString()}`;
    window.location.replace(redirectUrl);
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export default function OAuthSuccessRedirect() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OAuthSuccessRedirectContent />
    </Suspense>
  );
}
