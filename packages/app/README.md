# @rulesnap/app

Expo-based React Native app for RuleSnap — board game rules reference guides for iOS, Android, and web.

## Prerequisites

- Node.js 18+
- pnpm
- For iOS: Xcode + CocoaPods
- For Android: Android Studio + Android SDK
- Custom fonts downloaded to `assets/fonts/` (see `assets/fonts/README.md`)

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
  castles-of-burgundy.tsx
  quacks.tsx
  +not-found.tsx        # Catch-all → redirect to /
assets/
  fonts/                # Custom .ttf fonts (Cinzel, Crimson Text)
  i18n/                 # Translation JSON files by namespace/locale
components/             # Shared UI components
games/                  # Game screen implementations
  castles-of-burgundy/
    CoBScreen.tsx
    sections/           # Individual section components
  quacks/
    QuacksScreen.tsx
    sections/
hooks/                  # Custom hooks (useScrollTracker)
i18n/                   # i18next configuration
stores/                 # Zustand stores
theme/                  # Theme definitions and context
utils/                  # Constants and helpers
```

## Adding a New Game

1. **Add translation files** — Create `assets/i18n/{game-id}/en.json` (and other locales). The JSON must include an `app` key with `title` and `icon`:

   ```json
   {
     "app": {
       "title": "My Game",
       "icon": "🎮"
     },
     "overview": { "sidenav": "Overview", "heading": "...", "body": "..." }
   }
   ```

2. **Register translations in i18n** — Edit `i18n/index.ts`:
   - Add static imports for the new JSON files
   - Add the namespace to the `resources` object for each locale
   - Add the namespace string to the `ns` array

   ```typescript
   import myGameEn from '../assets/i18n/my-game/en.json';

   const resources = {
     en: { ..., 'my-game': myGameEn },
   };

   const ns = ['common', 'castles-of-burgundy', 'quacks', 'my-game'];
   ```

3. **Create the game screen** — Add files under `games/{game-id}/`:
   - `MyGameScreen.tsx` — main screen component (follow `CoBScreen.tsx` or `QuacksScreen.tsx` as a template)
   - `sections/` — individual section components

4. **Add the route** — Create `app/{game-id}.tsx`:

   ```typescript
   import { MyGameScreen } from '../games/my-game/MyGameScreen';

   export default function MyGameRoute() {
     return <MyGameScreen />;
   }
   ```

5. **Add a theme** (optional) — If the game needs custom colors, add a theme to `theme/themes.ts` and register it in `themeMap`:

   ```typescript
   export const myGameTheme: Theme = { ... };

   export const themeMap: Record<string, Theme> = {
     ...,
     'my-game': myGameTheme,
   };
   ```

The home screen game list and SideNav are derived automatically from the `gameIds` array — no changes needed there.

## Adding or Modifying Translations

Translation files live in `assets/i18n/{namespace}/{locale}.json`.

### Supported locales

- `en` — English
- `es-MX` — Mexican Spanish

### Adding a new locale

1. Create `{locale}.json` files in each namespace directory under `assets/i18n/`
2. Add static imports and resource entries in `i18n/index.ts`
3. Add the locale to `SUPPORTED_LOCALES` and `LOCALE_META` in `components/SideNav.tsx`

### Modifying existing translations

Edit the JSON files directly. Changes are picked up on next build/reload. Translation keys are resolved as dot-separated paths into the nested JSON (e.g., `t('setup.heading')` reads `{ "setup": { "heading": "..." } }`).

### Rich text in translations

Translation values can include HTML-like tags that the `RichText` component renders as styled text:

- `<strong>bold</strong>` → bold text
- `<em>italic</em>` → italic text
- `<br>` or `<br/>` → line break
- `<span className='qk-token qk-token-white'></span>` → colored token circle

### Keeping web and mobile in sync

The translation files in `assets/i18n/` are copies of `packages/web/src/i18n/translations/`. When updating translations, update both locations or copy from web to mobile.

## Custom Fonts

The Castles of Burgundy theme uses Cinzel (headings) and Crimson Text (body). Download the `.ttf` files per `assets/fonts/README.md` and uncomment the font loading block in `app/_layout.tsx`.

## Testing

```bash
pnpm jest
```

Uses Jest with ts-jest. Test files go in `__tests__/`.
