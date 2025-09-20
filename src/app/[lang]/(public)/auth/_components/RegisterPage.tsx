"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateUsername, validateFullname, validateEmail, validatePassword } from "@/validations";
import { useRegister } from "@/hooks";
import Image from "next/image";

export function RegisterPage() {
  const t = useTranslations("Auth.register");
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    fullname?: string;
    email?: string;
    password?: string;
  }>({});

  const registerMutation = useRegister();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Validate all fields
    const usernameError = validateUsername(formData.username);
    const fullnameError = validateFullname(formData.fullname);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (usernameError) newErrors.username = usernameError;
    if (fullnameError) newErrors.fullname = fullnameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Use TanStack Query mutation
    registerMutation.mutate(formData, {
      onSuccess: () => {
        setRegistrationSuccess(true);
      },
      onError: (error) => {
        // Handle registration error
        console.error("Registration failed:", error);
      },
    });
  };

  // Success screen after registration
  if (registrationSuccess) {
    return (
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center">
              <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
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
              {t("success_title", { default: "Account Created!" })}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("success_message", {
                default:
                  "We've sent a verification link to your email address. Please check your email and click the link to verify your account before signing in.",
              })}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/${lang}/auth/login`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("go_to_login", { default: "Go to Sign In" })}
              </Button>

              <p className="text-sm text-gray-500">
                {t("didnt_receive_email", {
                  default: "Didn't receive the email? Check your spam folder or",
                })}{" "}
                <button
                  onClick={() => setRegistrationSuccess(false)}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  {t("try_again", { default: "try again" })}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <Image src="/assets/logo/lurnix-favicon.svg" alt="Lurnix" width={40} height={40} />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("title")}</h2>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="exempleDev"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                required
                placeholder="Full Name"
                value={formData.fullname}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
                className={`w-full ${errors.fullname ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                aria-invalid={!!errors.fullname}
                aria-describedby={errors.fullname ? "fullname-error" : undefined}
              />
              {errors.fullname && (
                <p id="fullname-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.fullname}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t("email_placeholder")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
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

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder={t("password_placeholder")}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Terms */}
            <div className="text-sm text-gray-600">
              <p>
                {t("terms_text_prefix", { default: "By creating an account, you agree to our" })}{" "}
                <a
                  href="https://lurnix.tech/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-800"
                >
                  {t("terms_link", { default: "Terms of Service" })}
                </a>{" "}
                {t("terms_text_middle", { default: "and" })}{" "}
                <a
                  href="https://lurnix.tech/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-800"
                >
                  {t("privacy_link", { default: "Privacy Policy" })}
                </a>
                {"."}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                t("create_account_button")
              )}
            </Button>
          </form>

          {/* Separator */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t("have_account_cta")} {t("have_account_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
