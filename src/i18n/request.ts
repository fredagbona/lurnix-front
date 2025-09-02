import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  let resolvedLocale = locale as string | undefined;

  if (!resolvedLocale || !routing.locales.includes(resolvedLocale as "fr" | "en")) {
    resolvedLocale = routing.defaultLocale;
  }

  return {
    timeZone: "UTC",
    messages: (await import(`../locales/${resolvedLocale}.json`)).default,
  };
});
