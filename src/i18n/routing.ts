import { defineRouting } from "next-intl/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const locales = routing.locales as ReadonlyArray<"en" | "fr">;
export const defaultLocale = routing.defaultLocale as "en" | "fr";

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: routing.locales,
  localePrefix: routing.localePrefix,
});
