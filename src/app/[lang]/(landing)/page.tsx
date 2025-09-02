import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale: params.lang });
  return {
    title: t("meta.home.title"),
    description: t("meta.home.description"),
  };
}

export default function LandingPage({ params }: { params: { lang: string } }) {
  unstable_setRequestLocale(params.lang);
  
  const t = useTranslations("Home");

  return (
    <main className="flex flex-col gap-6 items-start p-8">
      <h1 className="text-3xl font-bold bg-primary">{t("main_title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <a
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 text-sm"
        href="#"
      >
        {t("cta_button")}
      </a>
    </main>
  );
}


