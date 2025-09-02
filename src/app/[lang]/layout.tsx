import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/routing";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

function Providers({ children }: { children: ReactNode }) {
  return children;
}

export default async function LocaleLayout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  if (!locales.includes(lang as "fr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
      <ThemeProvider>
        <Providers>{children}</Providers>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}


