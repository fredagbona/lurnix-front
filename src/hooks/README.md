# TanStack Query Hooks

Ce dossier contient tous les hooks personnalisés utilisant TanStack Query pour la gestion des données et des états de chargement.

## Structure

```
src/hooks/
├── index.ts              # Export de tous les hooks
├── use-auth.ts           # Hooks d'authentification
├── use-password-reset.ts # Hook de réinitialisation de mot de passe
└── README.md            # Documentation
```

## Architecture

Les hooks utilisent une architecture en couches :

- **Models** (`@/models`) : Types TypeScript
- **Services** (`@/services`) : Appels API et logique métier
- **Hooks** (`@/hooks`) : Gestion d'état avec TanStack Query

## Hooks disponibles

### use-auth.ts

#### `useCurrentUser()`

- **Description** : Récupère les informations de l'utilisateur connecté
- **Retour** : `{ data: User | null, isLoading: boolean, error: Error | null }`

#### `useLogin()`

- **Description** : Mutation pour la connexion
- **Retour** : `{ mutate: (credentials) => void, isPending: boolean, error: Error | null }`
- **Usage** :

```typescript
const loginMutation = useLogin();
loginMutation.mutate({ email, password });
```

#### `useRegister()`

- **Description** : Mutation pour l'inscription
- **Retour** : `{ mutate: (data) => void, isPending: boolean, error: Error | null }`
- **Usage** :

```typescript
const registerMutation = useRegister();
registerMutation.mutate({ username, fullname, email, password });
```

#### `useLogout()`

- **Description** : Mutation pour la déconnexion
- **Retour** : `{ mutate: () => void, isPending: boolean, error: Error | null }`

#### `useCheckEmailAvailability()`

- **Description** : Mutation pour vérifier la disponibilité d'un email
- **Retour** : `{ mutate: (email) => void, isPending: boolean, error: Error | null }`

#### `useCheckUsernameAvailability()`

- **Description** : Mutation pour vérifier la disponibilité d'un nom d'utilisateur
- **Retour** : `{ mutate: (username) => void, isPending: boolean, error: Error | null }`

### use-password-reset.ts

#### `usePasswordReset()`

- **Description** : Mutation pour demander une réinitialisation de mot de passe
- **Retour** : `{ mutate: (data) => void, isPending: boolean, error: Error | null }`
- **Usage** :

```typescript
const passwordResetMutation = usePasswordReset();
passwordResetMutation.mutate({ email });
```

#### `usePasswordResetConfirm()`

- **Description** : Mutation pour confirmer la réinitialisation de mot de passe
- **Retour** : `{ mutate: (data) => void, isPending: boolean, error: Error | null }`
- **Usage** :

```typescript
const confirmMutation = usePasswordResetConfirm();
confirmMutation.mutate({ token, password });
```

## Configuration

TanStack Query est configuré dans `src/lib/query-client.ts` avec :

- **staleTime** : 5 minutes
- **gcTime** : 10 minutes
- **Retry** : 3 tentatives pour les erreurs 5xx
- **refetchOnWindowFocus** : désactivé

## DevTools

Les React Query DevTools sont inclus en mode développement pour déboguer les requêtes.

## Exemple d'utilisation

```typescript
import { useLogin, useCurrentUser } from "@/hooks";

function LoginPage() {
  const loginMutation = useLogin();
  const { data: user } = useCurrentUser();

  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials, {
      onSuccess: () => {
        // Redirection ou autre action
      },
      onError: (error) => {
        // Gestion d'erreur
      },
    });
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Formulaire */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
```
