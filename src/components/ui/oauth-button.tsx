"use client";

import { useParams } from "next/navigation";
import { Button } from "./button";
import { authService } from "@/services";
import type { OAuthProvider } from "@/models";

interface OAuthButtonProps {
  provider: OAuthProvider;
  redirectPath?: string;
  children: React.ReactNode;
  className?: string;
}

export function OAuthButton({
  provider,
  redirectPath = "/dashboard",
  children,
  className,
}: OAuthButtonProps) {
  const params = useParams();
  const locale = (params.lang as string) || "en";

  const handleOAuthLogin = () => {
    const oauthUrl = authService.getOAuthUrl(provider, redirectPath, locale);
    console.log("OAuth URL:", oauthUrl);
    console.log("Locale:", locale);
    window.location.href = oauthUrl;
  };

  return (
    <Button type="button" variant="outline" onClick={handleOAuthLogin} className={className}>
      {children}
    </Button>
  );
}
