// Gestion des cookies côté client uniquement
// Types pour les cookies
export interface AuthCookies {
  token: string | null;
}

// Clés des cookies
const COOKIE_KEYS = {
  AUTH_TOKEN: "auth-token",
} as const;

// Configuration des cookies
const COOKIE_OPTIONS = {
  httpOnly: false, // Doit être accessible côté client pour les appels API
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 jours
} as const;

// Gestion des cookies côté client
export const clientCookies = {
  // Récupérer un cookie
  get(name: string): string | null {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  },

  // Définir un cookie
  set(name: string, value: string, options: Partial<typeof COOKIE_OPTIONS> = {}): void {
    if (typeof window === "undefined") return;

    const cookieOptions = { ...COOKIE_OPTIONS, ...options };
    let cookieString = `${name}=${value}`;

    if (cookieOptions.maxAge) {
      cookieString += `; max-age=${cookieOptions.maxAge}`;
    }
    if (cookieOptions.path) {
      cookieString += `; path=${cookieOptions.path}`;
    }
    if (cookieOptions.secure) {
      cookieString += `; secure`;
    }
    if (cookieOptions.sameSite) {
      cookieString += `; samesite=${cookieOptions.sameSite}`;
    }
    if (cookieOptions.httpOnly) {
      cookieString += `; httponly`;
    }

    document.cookie = cookieString;
  },

  // Supprimer un cookie
  remove(name: string): void {
    if (typeof window === "undefined") return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

// Fonctions utilitaires pour l'authentification côté client
export const authCookies = {
  // Récupérer le token d'authentification
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return clientCookies.get(COOKIE_KEYS.AUTH_TOKEN);
  },

  // Définir le token d'authentification
  setToken(token: string): void {
    clientCookies.set(COOKIE_KEYS.AUTH_TOKEN, token);
  },

  // Supprimer le token
  clearToken(): void {
    clientCookies.remove(COOKIE_KEYS.AUTH_TOKEN);
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
