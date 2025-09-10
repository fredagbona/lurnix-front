# Services

Ce dossier contient tous les services pour les appels API et la logique métier.

## Structure

```
src/services/
├── index.ts              # Export de tous les services
├── api.ts                # Client API de base
├── auth.service.ts       # Service d'authentification
└── README.md            # Documentation
```

## Services disponibles

### api.ts

Client API de base avec :

- **Configuration centralisée** des URLs et headers
- **Gestion automatique** des tokens d'authentification
- **Gestion d'erreurs** standardisée
- **Types TypeScript** pour les erreurs API

#### Utilisation :

```typescript
import { apiClient } from "@/services";

// GET request
const data = await apiClient.get<User>("/users/me");

// POST request
const result = await apiClient.post<AuthResponse>("/auth/login", credentials);

// Avec gestion d'erreurs
try {
  const user = await apiClient.get<User>("/users/me");
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
}
```

### auth.service.ts

Service d'authentification avec toutes les méthodes :

- `login(credentials)` - Connexion
- `register(data)` - Inscription
- `logout()` - Déconnexion
- `getCurrentUser()` - Utilisateur actuel
- `requestPasswordReset(data)` - Demande de réinitialisation
- `confirmPasswordReset(data)` - Confirmation de réinitialisation
- `refreshToken(token)` - Rafraîchissement de token
- `checkEmailAvailability(email)` - Vérification email
- `checkUsernameAvailability(username)` - Vérification username
- `verifyEmail(token)` - Vérification email avec token

#### Utilisation :

```typescript
import { authService } from "@/services";

// Connexion
const authResponse = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Vérification de disponibilité
const emailCheck = await authService.checkEmailAvailability("user@example.com");

// Vérification email avec token
await authService.verifyEmail("verification-token-here");
```

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` avec :

```env
# Pour le développement local
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# Pour la production (par défaut)
# NEXT_PUBLIC_BASE_URL=https://api.lurnix.tech/api

NEXT_PUBLIC_APP_NAME=Lurnix
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Note** : L'URL par défaut est `https://api.lurnix.tech/api` si aucune variable d'environnement n'est définie.

### Endpoints API configurés

Les endpoints suivants sont déjà configurés avec de vraies API :

#### Authentification

- **POST** `https://api.lurnix.tech/api/auth/login` - Connexion

  **Request:**

  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```

  **Response:**

  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "success": true,
      "user": {
        "id": "e4e12d5a-e6e7-4716-b776-9ee0027a9e0b",
        "username": "cisse",
        "fullname": "AMIDOU Taher",
        "email": "tairoucisse@gmail.com",
        "isActive": true,
        "createdAt": "2025-09-06T12:57:51.831Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "timestamp": "2025-09-06T13:07:09.188Z"
  }
  ```

- **POST** `https://api.lurnix.tech/api/auth/register` - Inscription

  **Request:**

  ```json
  {
    "username": "string",
    "fullname": "string",
    "email": "user@example.com",
    "password": "string"
  }
  ```

  **Response:** (Structure similaire au login)

- **GET** `https://api.lurnix.tech/api/auth/verify-email/{token}` - Vérification email

  **Paramètres:**
  - `token` (path) - Token de vérification email

  **Réponses:**
  - `200` - Email vérifié avec succès
  - `400` - Token invalide ou expiré

#### Endpoints en simulation (à implémenter)

- **POST** `/auth/logout` - Déconnexion
- **GET** `/auth/me` - Utilisateur actuel
- **POST** `/auth/password-reset` - Demande de réinitialisation
- **POST** `/auth/password-reset/confirm` - Confirmation de réinitialisation
- **GET** `/auth/check-email` - Vérification email
- **GET** `/auth/check-username` - Vérification username

## Gestion d'erreurs

Toutes les erreurs API sont typées avec `ApiError` :

```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}
```

## Bonnes pratiques

1. **Toujours utiliser les services** au lieu d'appels fetch directs
2. **Gérer les erreurs** avec try/catch
3. **Utiliser les types** importés depuis `@/models`
4. **Tester les services** avec des mocks en développement
5. **Documenter** les nouvelles méthodes ajoutées
