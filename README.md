## Lurnix Frontend

Next.js 14 App Router project with:

- Internationalization (next-intl v3) with `/[lang]` routing (`en`, `fr`)
- TailwindCSS + shadcn/ui setup, lucide-react icons
- Brand design tokens (light/dark) + accent gradient
- Theme system (next-themes) with toggle
- Fonts: Inter (sans) + Poppins (display) via `next/font`
- ESLint + Prettier + Husky pre-commit (lint-staged)

### Requirements

- Node 18+ (recommended 18.18+)
- pnpm

### Install & run

```bash
pnpm install
pnpm dev
# http://localhost:3000 → redirects to /en
```

### Scripts

```bash
pnpm lint        # ESLint (next/core-web-vitals)
pnpm format      # Prettier write
pnpm build       # Next build
pnpm start       # Next start
```

### Internationalization (next-intl)

- Routing config: `src/i18n/routing.ts` (locales: `en`, `fr`; `localePrefix: "always"`)
- Request config: `src/i18n/request.ts` (loads `src/locales/{locale}.json`)
- Middleware: `middleware.ts` (root) + `src/middleware.ts`
- App structure: `src/app/[lang]/layout.tsx`, `src/app/[lang]/(landing)/page.tsx`
- Root redirect: `src/app/page.tsx` → `/${defaultLocale}`
- Docs: next-intl App Router `https://next-intl.dev/docs/getting-started/app-router`

Usage example:

```tsx
import { useTranslations } from "next-intl";
const t = useTranslations("Home");
return <h1>{t("main_title")}</h1>;
```

### Theming (light/dark)

- Provider: `src/components/theme-provider.tsx` (next-themes, attribute="class")
- Toggle: `src/components/theme-toggle.tsx` (shadcn Button + lucide icons)
- Integrated in `src/app/[lang]/layout.tsx` and used on landing page

### Design system

- Global tokens in `src/app/globals.css` (HSL CSS variables) for:
  - `primary`, `success`, `warning`, `info`, `destructive`
  - neutrals: `background`, `foreground`, `border`, `muted`, etc.
  - charts: `--chart-1..4`
  - gradient utility: `.bg-accent-gradient`
- Tailwind mapping in `tailwind.config.ts` (colors, container, radius, animations)

Examples:

```tsx
<button className="bg-primary text-primary-foreground">Primary</button>
<div className="bg-accent-gradient h-10 w-full" />
<p className="text-muted">Muted text</p>
```

### Fonts

- `src/app/layout.tsx` loads Inter (`--font-inter`) and Poppins (`--font-poppins`)
- Tailwind families in `tailwind.config.ts`:
  - `font-sans` → Inter
  - `font-display` → Poppins
  - `font-mono` → Geist Mono

### shadcn/ui

- Installed primitives and `src/components/ui/button.tsx`
- Utilities: `src/lib/utils.ts` (`cn`)

### Linting & formatting

- ESLint config: `.eslintrc.json` extends `next/core-web-vitals` + `plugin:prettier/recommended`
- Prettier config: `.prettierrc`
- Ignores: `.eslintignore`, `.prettierignore`

### Husky (pre-commit)

- package.json:
  - `"prepare": "husky"`
  - `lint-staged`:
    - `*.{js,jsx,ts,tsx}` → `eslint --fix` then `prettier --write`
    - `*.{json,css,md}` → `prettier --write`
- Initialize hook:

```bash
pnpm exec husky init && cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged
EOF
chmod +x .husky/pre-commit
```

### Project structure (key paths)

```
src/
  app/
    [lang]/
      (landing)/page.tsx
      layout.tsx
    layout.tsx
    page.tsx
  components/
    theme-provider.tsx
    theme-toggle.tsx
    ui/button.tsx
  i18n/
    routing.ts
    request.ts
  locales/
    en.json
    fr.json
middleware.ts
tailwind.config.ts
```
