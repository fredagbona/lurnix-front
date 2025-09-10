# Lib - Utilitaires

Ce dossier contient les utilitaires et helpers de l'application.

## Structure

```
src/lib/
├── cookies.ts           # Index des exports de cookies
├── cookies-client.ts    # Gestion des cookies côté client
├── cookies-server.ts    # Gestion des cookies côté serveur
├── utils.ts            # Utilitaires généraux
└── README.md           # Documentation
```

## Cookies

### Séparation Client/Serveur

Les cookies sont séparés en deux fichiers pour respecter les contraintes de Next.js :

#### **cookies-client.ts** - Côté Client

- ✅ **Utilisable dans** : Composants client, hooks, services
- ✅ **API** : `authCookies.getToken()`, `setToken()`, `clearToken()`
- ✅ **Imports** : `import { authCookies } from "@/lib/cookies-client"`

#### **cookies-server.ts** - Côté Serveur

- ✅ **Utilisable dans** : Server Components, API routes, middleware
- ✅ **API** : `serverCookies.getAuthCookies()`, `setAuthCookie()`, `removeAuthCookies()`
- ✅ **Imports** : `import { serverCookies } from "@/lib/cookies-server"`

### Utilisation

#### **Dans les composants client :**

```typescript
import { authCookies } from "@/lib/cookies-client";

const token = authCookies.getToken();
authCookies.setToken("new-token");
```

#### **Dans les composants serveur :**

```typescript
import { serverCookies } from "@/lib/cookies-server";

const { token } = serverCookies.getAuthCookies();
serverCookies.setAuthCookie("AUTH_TOKEN", "new-token");
```

#### **Import unifié (recommandé) :**

```typescript
import { authCookies, serverCookies } from "@/lib/cookies";
```

### Configuration

Les cookies sont configurés avec :

- **httpOnly** : `false` (accessible côté client)
- **secure** : `true` en production
- **sameSite** : `"lax"` (protection CSRF)
- **path** : `"/"` (accessible partout)
- **maxAge** : `7 jours`

### Sécurité

1. **Protection XSS** : SameSite=Lax
2. **Protection CSRF** : SameSite=Lax
3. **HTTPS** : Secure en production
4. **Expiration** : 7 jours maximum
5. **Domaine** : Contrôle d'accès

## Utils

### utils.ts

Utilitaires généraux pour l'application :

- Fonctions de formatage
- Helpers de validation
- Utilitaires de date/heure
- Fonctions de manipulation de chaînes

## Bonnes pratiques

1. **Utiliser les bons imports** : Client vs Serveur
2. **Tester les cookies** : Vérifier la persistance
3. **Gérer les erreurs** : Try/catch pour les opérations cookies
4. **Documenter** : Commenter les nouvelles fonctions
5. **Sécurité** : Ne jamais exposer de données sensibles
