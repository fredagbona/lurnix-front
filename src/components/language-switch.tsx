"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

const languageNames = {
  en: "English",
  fr: "Français",
};

const languageFlags = {
  en: "🇺🇸",
  fr: "🇫🇷",
};

export const LanguageSwitch = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: "en" | "fr") => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
        {locales.map((loc, index) => (
          <div key={loc} className="flex items-center">
            <button
              onClick={() => handleLanguageChange(loc)}
              className={`flex items-center space-x-1 transition-colors ${
                locale === loc ? "text-gray-700 font-semibold" : "hover:text-gray-700"
              }`}
              aria-label={`Switch to ${languageNames[loc]}`}
            >
              <span>{languageFlags[loc]}</span>
              <span>{languageNames[loc]}</span>
              {locale === loc && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>
            {index < locales.length - 1 && <span className="mx-2">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
