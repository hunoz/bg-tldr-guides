# RuleSnap Mobile

A Flutter cross-platform app for board game rules reference. Targets web, iOS, and Android from a single codebase.

## Prerequisites

### macOS

1. Install Flutter via [Homebrew](https://brew.sh) or the [official installer](https://docs.flutter.dev/get-started/install/macos):
   ```bash
   brew install --cask flutter
   ```
2. Verify installation:
   ```bash
   flutter doctor
   ```
3. For iOS development:
   - Install [Xcode](https://apps.apple.com/us/app/xcode/id497799835) from the App Store
   - Run `xcodebuild -runFirstLaunch` after first install
   - Install the iOS simulator runtime: `xcodebuild -downloadPlatform iOS`
   - Install CocoaPods: `brew install cocoapods`
4. For Android development:
   - Install [Android Studio](https://developer.android.com/studio)
   - Open it once and let it install the Android SDK
   - Create an emulator via Tools → Device Manager

### Windows

1. Install Flutter via the [official installer](https://docs.flutter.dev/get-started/install/windows):
   ```powershell
   # Or via Chocolatey
   choco install flutter
   ```
2. Verify installation:
   ```powershell
   flutter doctor
   ```
3. For Android development:
   - Install [Android Studio](https://developer.android.com/studio)
   - Open it once and let it install the Android SDK
   - Create an emulator via Tools → Device Manager
4. iOS development is not available on Windows

## Running Locally

### Web

```bash
# From packages/mobile/
flutter run -d chrome
```

### iOS (macOS only)

```bash
# Install dependencies
pod install --project-directory=ios

# List available simulators
xcrun simctl list devices available

# Run on a simulator
flutter run -d 'iPhone 16'

# Open the Simulator window if it doesn't appear
open -a Simulator
```

### Android

```bash
# List available emulators
flutter emulators

# Launch an emulator
flutter emulators --launch <emulator_id>

# Run on the emulator
flutter run -d emulator-5554
```

### Check available devices

```bash
flutter devices
```

## Running Tests

```bash
flutter test
```

## Building

### Web

```bash
flutter build web
```

Build output is in `build/web/`. Serve it with any static file server.

### iOS

```bash
# Build for device (requires Apple Developer account and code signing)
flutter build ios

# Build for simulator (no code signing needed)
flutter build ios --simulator
```

### Android

```bash
# Build APK
flutter build apk

# Build App Bundle (recommended for Play Store)
flutter build appbundle
```

## Publishing

### Web

Deploy the `build/web/` directory to any static hosting:
- Firebase Hosting: `firebase deploy`
- AWS S3 + CloudFront
- Netlify, Vercel, GitHub Pages

### iOS (App Store)

1. Set up an [Apple Developer account](https://developer.apple.com)
2. Configure signing in Xcode: open `ios/Runner.xcworkspace`, select a Development Team
3. Build the archive:
   ```bash
   flutter build ipa
   ```
4. Upload to App Store Connect via Xcode or `xcrun altool`

### Android (Play Store)

1. Create a [Google Play Developer account](https://play.google.com/console)
2. Create a signing key:
   ```bash
   keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```
3. Configure signing in `android/app/build.gradle`
4. Build the release bundle:
   ```bash
   flutter build appbundle
   ```
5. Upload `build/app/outputs/bundle/release/app-release.aab` to the Play Console

## Project Structure

```
lib/
├── main.dart              # Entry point
├── app.dart               # Root widget with providers
├── router.dart            # GoRouter configuration
├── i18n/                  # Internationalization service + rich text parser
├── theme/                 # Per-game theme configs
├── models/                # Data models (NavItem, GameMetadata)
├── screens/               # Home, Castles of Burgundy, Quacks screens
├── widgets/               # Shared widgets (AppShell, SideNav, ScrollTracker)
└── utils/                 # External links, constants, responsive helpers
```
