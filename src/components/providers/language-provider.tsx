"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, locales } from "@/i18n/routing";
import { useCurrentUser } from "@/hooks";

type SupportedLocale = (typeof locales)[number];

interface LanguageContextValue {
  language: SupportedLocale;
  setLanguage: (next: SupportedLocale) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  initialLocale: SupportedLocale;
  children: ReactNode;
}

export function LanguageProvider({ initialLocale, children }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routeLocale = useLocale();
  const { data: currentUser, isLoading, isFetching } = useCurrentUser();

  const [language, setLanguageState] = useState<SupportedLocale>(initialLocale);

  const normalizeLocale = useCallback((value: unknown): SupportedLocale | null => {
    if (typeof value !== "string") return null;
    return locales.includes(value as SupportedLocale) ? (value as SupportedLocale) : null;
  }, []);

  useEffect(() => {
    const preferred = normalizeLocale((currentUser as any)?.language);
    const currentRouteLocale = normalizeLocale(routeLocale);

    // If user has a language preference and it doesn't match the current route
    if (preferred && currentRouteLocale && preferred !== currentRouteLocale && pathname) {
      // Redirect to the user's preferred language
      const newPath = `/${preferred}${pathname}`;
      window.location.href = newPath;
    } else if (preferred && preferred !== language) {
      setLanguageState(preferred);
    }
  }, [currentUser, language, normalizeLocale, routeLocale, pathname]);

  useEffect(() => {
    if ((currentUser as any)?.language) {
      return;
    }
    const normalizedRoute = normalizeLocale(routeLocale);
    if (normalizedRoute && normalizedRoute !== language) {
      setLanguageState(normalizedRoute);
    }
  }, [routeLocale, language, normalizeLocale, currentUser]);

  useEffect(() => {
    const normalizedRoute = normalizeLocale(routeLocale);
    if (!normalizedRoute || normalizedRoute === language || !pathname) {
      return;
    }
    // Force a full page reload to ensure all translations are updated
    const newPath = `/${language}${pathname}`;
    window.location.href = newPath;
  }, [language, routeLocale, pathname, normalizeLocale]);

  const setLanguage = useCallback(
    (next: SupportedLocale) => {
      if (next === language) return;
      if (!locales.includes(next)) return;
      setLanguageState(next);
    },
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      isLoading: isLoading || isFetching,
    }),
    [language, setLanguage, isLoading, isFetching],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export type { SupportedLocale };
