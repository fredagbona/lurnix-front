"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButton } from "@/components/ui/oauth-button";
import { validateEmail, validatePassword } from "@/validations";
import { useLogin } from "@/hooks";
import { useRouter } from "@/i18n/routing";

export function LoginPage() {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [errors, setErrors] = useState<{ email?: string; password?: string; login?: string }>({});

  const loginMutation = useLogin();

  // Feature flag to control signup visibility (defaults to false if not set)
  const isSignupEnabled = (process.env.NEXT_PUBLIC_SIGNUP_ENABLED ?? "false") === "true";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    setErrors({});

    // Use TanStack Query mutation
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          // Redirect to locale-aware /home after successful login
          router.replace("/dashboard");
        },
        onError: (error: any) => {
          // Handle login error
          console.error("Login failed:", error);
          const errorMessage =
            error?.response?.data?.error?.message || "Login failed. Please try again.";
          setErrors({ login: errorMessage });
        },
      },
    );
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
    setErrors({});
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("title")}</h2>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {isSignupEnabled && (
                <>
                  {/* OAuth Buttons */}
                  <div className="space-y-3">
                    <OAuthButton provider="google" className="w-full h-12 font-semibold">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {t("oauth.continue_with_google", { default: "Continue with Google" })}
                    </OAuthButton>

                    <OAuthButton provider="github" className="w-full h-12 font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      {t("oauth.continue_with_github", { default: "Continue with GitHub" })}
                    </OAuthButton>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {t("oauth.or_separator", { default: "Or continue with email" })}
                      </span>
                    </div>
                  </div>
                </>
              )}

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
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/password-reset"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {t("forgot_email")}
                </Link>
              </div>

              <Button type="submit" disabled={!email} className="w-full h-12 font-semibold">
                {t("next_button")}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Email display with back button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Back to email"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-600">{email}</span>
                </div>
              </div>

              <div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder={t("password_placeholder")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                      if (errors.login) setErrors({ ...errors, login: undefined });
                    }}
                    className={`w-full pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {errors.login && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600" role="alert">
                    {errors.login}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/password-reset"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {t("forgot_password")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending || !password}
                className="w-full h-12 font-semibold"
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  t("sign_in_button")
                )}
              </Button>
            </form>
          )}

          {/* Separator and Sign Up Button - Only show on email step and if signup is enabled */}
          {step === "email" && isSignupEnabled && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t("or_separator")}</span>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <div className="mt-6">
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full h-12 font-semibold">
                    {t("sign_up_button")}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
