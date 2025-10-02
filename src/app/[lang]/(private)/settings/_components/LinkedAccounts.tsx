"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLinkedAccounts, useUnlinkProvider } from "@/hooks";
import { authService } from "@/services";
import type { OAuthProvider } from "@/models";
import { Loader } from "@/components/ui/loader";

export function LinkedAccounts() {
  const t = useTranslations("Settings.linked_accounts");
  const params = useParams();
  const locale = (params.lang as string) || "en";
  const { data: linkedAccountsData, isLoading } = useLinkedAccounts();
  const unlinkMutation = useUnlinkProvider();

  const [unlinkDialog, setUnlinkDialog] = useState<{
    open: boolean;
    provider: OAuthProvider | null;
  }>({
    open: false,
    provider: null,
  });
  const [password, setPassword] = useState("");

  const providers = linkedAccountsData?.providers || [];
  const hasPassword = linkedAccountsData?.hasPassword || false;

  const isProviderConnected = (provider: string): boolean => {
    // Handle both array of strings and array of objects
    if (providers.length === 0) return false;
    
    if (typeof providers[0] === 'string') {
      return (providers as unknown as string[]).includes(provider);
    }
    return (providers as unknown as any[]).some((p: any) => p.provider === provider);
  };

  const getProviderEmail = (provider: string) => {
    // Handle both array of strings and array of objects
    if (providers.length === 0 || typeof providers[0] === 'string') {
      return undefined; // String array doesn't have email info
    }
    const account = (providers as any[]).find((p: any) => p.provider === provider);
    return account?.email;
  };

  const handleConnect = (provider: OAuthProvider) => {
    const oauthUrl = authService.getOAuthUrl(provider, "/settings", locale);
    window.location.href = oauthUrl;
  };

  const handleUnlinkClick = (provider: OAuthProvider) => {
    setUnlinkDialog({ open: true, provider });
    setPassword("");
  };

  const handleUnlinkConfirm = async () => {
    if (!unlinkDialog.provider) return;

    const data = hasPassword ? { password } : undefined;

    unlinkMutation.mutate(
      { provider: unlinkDialog.provider, data },
      {
        onSuccess: () => {
          toast.success(
            t("unlink_success", {
              default: "Provider unlinked successfully",
              provider: unlinkDialog.provider,
            }),
          );
          setUnlinkDialog({ open: false, provider: null });
          setPassword("");
        },
        onError: (error: any) => {
          console.error("Unlink error:", error);
          toast.error(
            error.message || t("unlink_error", { default: "Failed to unlink provider" }),
          );
        },
      },
    );
  };

  if (isLoading) {
    return <Loader message={t("loading", { default: "Loading linked accounts..." })} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t("title", { default: "Linked Accounts" })}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("description", {
            default: "Manage your connected authentication providers",
          })}
        </p>
      </div>

      <div className="space-y-4">
        {/* Email/Password */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium">
                {t("providers.email", { default: "Email & Password" })}
              </div>
              {hasPassword ? (
                <div className="text-sm text-muted-foreground">
                  {t("status.connected", { default: "Connected" })}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t("status.not_connected", { default: "Not connected" })}
                </div>
              )}
            </div>
          </div>
          <div>
            {hasPassword ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("status.connected", { default: "Connected" })}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {t("status.not_connected", { default: "Not connected" })}
              </span>
            )}
          </div>
        </div>

        {/* Google */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium">{t("providers.google", { default: "Google" })}</div>
              {isProviderConnected("google") ? (
                <div className="text-sm text-muted-foreground">{getProviderEmail("google")}</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t("status.not_connected", { default: "Not connected" })}
                </div>
              )}
            </div>
          </div>
          <div>
            {isProviderConnected("google") ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("status.connected", { default: "Connected" })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnlinkClick("google")}
                  disabled={unlinkMutation.isPending}
                >
                  {t("unlink", { default: "Unlink" })}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleConnect("google")}>
                {t("connect", { default: "Connect" })}
              </Button>
            )}
          </div>
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{t("providers.github", { default: "GitHub" })}</div>
              {isProviderConnected("github") ? (
                <div className="text-sm text-muted-foreground">{getProviderEmail("github")}</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {t("status.not_connected", { default: "Not connected" })}
                </div>
              )}
            </div>
          </div>
          <div>
            {isProviderConnected("github") ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("status.connected", { default: "Connected" })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnlinkClick("github")}
                  disabled={unlinkMutation.isPending}
                >
                  {t("unlink", { default: "Unlink" })}
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleConnect("github")}>
                {t("connect", { default: "Connect" })}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Unlink Confirmation Dialog */}
      <Dialog open={unlinkDialog.open} onOpenChange={(open) => setUnlinkDialog({ open, provider: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("unlink_confirm_title", { default: "Unlink Provider" })}
            </DialogTitle>
            <DialogDescription>
              {t("unlink_confirm_message", {
                default: "Are you sure you want to unlink {provider}?",
                provider: unlinkDialog.provider || "",
              })}
            </DialogDescription>
          </DialogHeader>

          {hasPassword && (
            <div className="py-4">
              <label htmlFor="password" className="text-sm font-medium mb-2 block">
                {t("password_required", {
                  default: "Enter your password to unlink this provider",
                })}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnlinkDialog({ open: false, provider: null })}
              disabled={unlinkMutation.isPending}
            >
              {t("cancel", { default: "Cancel" })}
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnlinkConfirm}
              disabled={unlinkMutation.isPending || (hasPassword && !password)}
            >
              {unlinkMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("unlinking", { default: "Unlinking..." })}
                </div>
              ) : (
                t("confirm", { default: "Unlink" })
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
