# @rulesnap/app

Expo-based React Native app for RuleSnap — board game rules reference guides for iOS, Android, and web.

## Prerequisites

- Node.js 18+
- pnpm
- For iOS: Xcode + CocoaPods
- For Android: Android Studio + Android SDK

## Getting Started

From the monorepo root:

```bash
pnpm install
```

From `packages/app/`:

```bash
# Start the dev server (web)
pnpm web

# Start with platform picker
pnpm start
```

## Running

```bash
# Web
pnpm web

# iOS simulator
pnpm ios

# Android emulator
pnpm android
```

## Building for Production

### Web

```bash
pnpm build
```

Outputs to `dist/`. Deploy this folder to your hosting (S3, CloudFront, etc.).

### iOS / Android (via EAS Build)

```bash
# First time setup
npx eas init
npx eas build:configure

# Build
npx eas build --platform ios
npx eas build --platform android
```

### iOS / Android (locally)

```bash
# first time setup
npx eas build:configure

# Build
npx eas build --platform ios --profile production --local
npx eas build --platform android --profile production --local
```

### Fix dependency version issues

If you hit codegen or pod install errors, let Expo resolve compatible versions:

```bash
npx expo install react-native react-native-safe-area-context react-native-screens react-native-web
```

For iOS, clean and rebuild:

```bash
rm -rf ios/Pods ios/build
pnpm ios
```

## Project Structure

```
app/                    # Expo Router file-based routes
  _layout.tsx           # Root layout (ThemeProvider + SideNav)
  index.tsx             # Home screen
  [gameId].tsx          # Dynamic route — renders any registered game
  +not-found.tsx        # Catch-all → redirect to /
assets/
  i18n/                 # Translation JSON files by namespace/locale
  images/               # Static images
components/             # Shared UI components
  GameScreen.tsx        # Generic game screen (renders any GameConfig)
  SectionErrorBoundary.tsx
games/                  # Game configs, themes, and section components
  registry.ts           # Auto-generated from games/*/config.ts — do not edit
  translations.ts       # Translation import map
  castles-of-burgundy/
    config.ts           # Game configuration
    theme.ts            # Game theme (colors, fonts, spacing)
    sections/           # Section components
  quacks/
    config.ts
    theme.ts
    sections/
hooks/                  # Custom hooks (useScrollTracker, useTheme)
i18n/                   # i18next configuration
scripts/
  generate-registry.js  # Scans games/*/config.ts → generates registry.ts
  generate-theme-map.js # Scans games/*/theme.ts → generates theme/themeMap.ts
stores/                 # Zustand stores
theme/                  # Theme interface, home theme, and auto-generated themeMap
  themes.ts             # Theme interface + homeTheme
  themeMap.ts           # Auto-generated from games/*/theme.ts — do not edit
  ThemeContext.tsx       # React context provider
types/                  # Shared TypeScript interfaces (GameConfig, etc.)
utils/                  # Constants and helpers
```

## Adding a New Game

Adding a game requires three things: a config file, section components, and translations. The registry, routing, home screen, and SideNav update automatically.

### 1. Create the game directory and config

Create `games/{game-id}/config.ts`:

```typescript
import { GameConfig } from '@/types/GameConfig';

export const config: GameConfig = {
    id: 'my-game',
    sections: ['overview', 'setup', 'gameplay'],
    headerColor: '#2a4a3a',
    bggUrl: 'https://boardgamegeek.com/boardgame/12345/my-game',
    manualUrl: 'https://rulesnap.com/manuals/my-game.pdf',
    sectionComponents: {
        overview: () => import('./sections/Overview').then(m => ({ default: m.Overview })),
        setup: () => import('./sections/Setup').then(m => ({ default: m.Setup })),
        gameplay: () => import('./sections/Gameplay').then(m => ({ default: m.Gameplay })),
    },
};
```

Optional config fields:

- `subtitleKey` — i18n key for the hero subtitle (defaults to `'app.subtitle'`)
- `heroStyle` — per-game hero banner overrides (colors, border, spacing)
- `sectionNavLabels` — custom SideNav labels per section (map section ID to a translation key, or `null` for auto-formatted fallback)

### 2. Create section components

Add components in `games/{game-id}/sections/`. Each section is a named export:

```typescript
// games/my-game/sections/Overview.tsx
export function Overview() {
  return ( /* your section content */ );
}
```

### 3. Add translation files

Create `assets/i18n/{game-id}/en.json` (and other locales). Must include `app.title` and `app.icon`:

```json
{
    "app": { "title": "My Game", "subtitle": "Quick Reference", "icon": "🎮" },
    "overview": { "sidenav": "Overview", "heading": "...", "body": "..." },
    "setup": { "sidenav": "Setup", "heading": "..." }
}
```

Then add the imports to `games/translations.ts`:

```typescript
import myGameEn from '../assets/i18n/my-game/en.json';

export const translationMap = {
    // ... existing entries
    'my-game': { en: myGameEn },
};
```

### 4. Add a theme (optional)

If the game needs custom colors/fonts, create `games/{game-id}/theme.ts`:

```typescript
import type { Theme } from '../../theme/themes';

export const theme: Theme = {
    colors: {
        background: '#1a2a1a',
        card: '#2a3a2a',
        text: '#e0e0e0',
        textMuted: '#a0b0a0',
        accent: '#4caf50',
    },
    fonts: { body: 'System', heading: 'System' },
    spacing: { sectionMargin: 24, cardPadding: 16, containerPadding: 16 },
};
```

The `themeMap` auto-generates when the file is saved (same as the registry). Without a `theme.ts`, the game falls back to the home theme.

### That's it

Both `registry.ts` and `themeMap.ts` auto-generate on save (via chokidar watcher in Metro) or on `pnpm start`/`pnpm build`. The dynamic `[gameId]` route, home screen, and SideNav all derive from the registry — no changes needed.

## Editing an Existing Game

- **Sections**: Edit components in `games/{game-id}/sections/`. Changes hot-reload.
- **Config**: Edit `games/{game-id}/config.ts` to change sections, URLs, or hero styling. The registry regenerates automatically.
- **Theme**: Edit `games/{game-id}/theme.ts` to change colors, fonts, or spacing. The theme map regenerates automatically.
- **Translations**: Edit JSON files in `assets/i18n/{game-id}/`. Changes are picked up on reload.

## Adding or Modifying Translations

Translation files live in `assets/i18n/{namespace}/{locale}.json`. The translation map in `games/translations.ts` connects them to the i18n system.

### Supported locales

- `en` — English
- `es-MX` — Mexican Spanish

### Adding a new locale

1. Create `{locale}.json` files in each namespace directory under `assets/i18n/`
2. Add the locale imports to `games/translations.ts` for each game
3. Add the locale to `SUPPORTED_LOCALES` and `LOCALE_META` in `components/SideNav.tsx`

No changes to `i18n/index.ts` needed — it builds resources dynamically from the registry and translation map.

### Modifying existing translations

Edit the JSON files directly. Changes are picked up on next build/reload. Translation keys are resolved as dot-separated paths into the nested JSON (e.g., `t('setup.heading')` reads `{ "setup": { "heading": "..." } }`).

### Rich text in translations

Translation values can include HTML-like tags that the `RichText` component renders as styled text:

- `<strong>bold</strong>` → bold text
- `<em>italic</em>` → italic text
- `<br>` or `<br/>` → line break
- `<span className='qk-token qk-token-white'></span>` → colored token circle

## Testing

```bash
pnpm jest
```

Uses Jest with ts-jest. Test files go in `__tests__/`.
