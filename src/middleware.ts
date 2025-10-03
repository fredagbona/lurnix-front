import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const i18nMiddleware = createMiddleware(routing);

// Routes privées à protéger (après le segment locale)
const protectedPrefixes = [
  "/dashboard",
  "/home",
  "/courses",
  "/resources",
  "/community",
  "/integrations",
  "/settings",
];

// Routes publiques qui ne nécessitent pas d'authentification
const publicPrefixes = [
  "/auth/login",
  "/auth/register",
  "/auth/success", // OAuth callback success
  "/auth/error", // OAuth callback error
  "/auth/verify-email",
  "/auth/resend-verify-email",
  "/auth/forgot-password",
  "/auth/password-reset",
  "/auth/reset-password",
  "/auth/_confirm-password-reset",
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const locale = routing.locales.includes(first as any) ? first : routing.defaultLocale;

  // Redirect root and bare-locale paths to auth/register
  if (segments.length === 0) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/auth/register`, req.url));
  }
  if (segments.length === 1 && routing.locales.includes(first as any)) {
    return NextResponse.redirect(new URL(`/${first}/auth/register`, req.url));
  }

  const withoutLocale = routing.locales.includes(first as any)
    ? "/" + segments.slice(1).join("/")
    : pathname;

  // Check if route is public (OAuth callbacks, auth pages, etc.)
  const isPublic = publicPrefixes.some((p) => withoutLocale.startsWith(p));

  // Debug logging for OAuth routes
  if (withoutLocale.includes("/auth/success") || withoutLocale.includes("/auth/error")) {
    console.log("[Middleware] OAuth callback route:", pathname);
    console.log("[Middleware] Is public:", isPublic);
    console.log("[Middleware] Query params:", req.nextUrl.searchParams.toString());
  }

  // Skip protection for public routes
  if (isPublic) {
    return i18nMiddleware(req);
  }

  const isProtected = protectedPrefixes.some((p) => withoutLocale.startsWith(p));

  if (isProtected) {
    const raw = req.cookies.get("auth-token")?.value;
    const token = raw && raw.trim().length > 0 ? raw : undefined;
    if (!token) {
      const loginUrl = new URL(`/${locale}/auth/login`, req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return i18nMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
