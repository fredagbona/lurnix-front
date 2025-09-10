import { NextRequest, NextResponse } from "next/server";

// Middleware pour vérifier l'authentification
export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Si pas de token, rediriger vers login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Middleware pour les routes publiques (rediriger si déjà connecté)
export function publicMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Si token présent, rediriger vers dashboard
  if (token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Middleware pour vérifier les permissions
export function permissionMiddleware(request: NextRequest, requiredPermissions: string[]) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // TODO: Vérifier les permissions depuis le token ou l'API
  // Pour l'instant, on laisse passer
  return NextResponse.next();
}
