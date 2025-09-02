import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const i18nMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  return i18nMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};


