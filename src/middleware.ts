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

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const locale = routing.locales.includes(first as any) ? first : routing.defaultLocale;

  const withoutLocale = routing.locales.includes(first as any)
    ? "/" + segments.slice(1).join("/")
    : pathname;

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
