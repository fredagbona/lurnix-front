import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { locales } from "@/i18n/routing";
import { QueryProvider } from "@/components/providers/query-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import type { SupportedLocale } from "@/components/providers/language-provider";
import { Toaster } from "sonner";

function Providers({ children, locale }: { children: ReactNode; locale: SupportedLocale }) {
  return (
    <QueryProvider>
      <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      <Toaster position="top-right" />
    </QueryProvider>
  );
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
  const supportedLocale = lang as SupportedLocale;

  return (
    <NextIntlClientProvider locale={lang} messages={messages} timeZone="UTC">
      <Providers locale={supportedLocale}>{children}</Providers>
    </NextIntlClientProvider>
  );
}
