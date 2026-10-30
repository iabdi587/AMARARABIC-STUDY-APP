# AMAR Arabic Study Companion

An Expo / React Native application for **native iOS and web**, with a navy, teal and orange theme inspired by rahmaniyyah.com. It is an independent personal study companion, not an official AMAR product.

## Features

- 15 level slots; Level 1 is populated, remaining levels await course content.
- Selected Arabic vocabulary organised by the PDF's 11 topic sections (topics 7–8 are combined).
- Click/tap a word to play an imported recording. No generated or substitute Sheikh voice.
- Import audio per word, with optional start and end offsets for longer clips.
- Flashcards, vocabulary quizzes, bookmarks and learned-word tracking.
- Complete original 149-page student revision PDF, including grammar, worksheets and answer sheets.
- On native iOS the PDF opens through the system share sheet; choose a PDF reader / Save to Files. The full PDF is bundled and available offline in the installed app.
- Local recordings and progress persist on the current device. No cross-device sync or backend account exists.

## Development

Use Node 22.13+ and npm.

```sh
npm ci
npm start
npm run web
npm run check
npm run build:web
```

## Native iOS

This is React Native UI, not a WebView or a PWA wrapper.

On macOS with Xcode and CocoaPods:

```sh
npm ci
npx expo run:ios
```

For an Apple-signed build via Expo EAS:

```sh
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios --profile production
```

The Expo account/project and Apple Developer account must be configured by the owner. Confirm a unique iOS bundle identifier before signing. TestFlight/App Store submission also requires app icons, screenshots, privacy information, and the necessary permission to distribute the course notes and recordings. No iOS binary has been signed or tested on a physical iPhone in this Linux workspace.

The `eas.json` file includes preview and production build profiles. Native iOS source can be regenerated from app.json with `npx expo prebuild --platform ios --no-install`.

## Content and audio

Vocabulary lives in `src/course.ts`. The full source PDF is `assets/level-1-notes.pdf`; the web copy is `public/assets/level-1-notes.pdf`. Selected vocabulary is a starter study set, not a complete transcription. Use the original notes as the source of truth for tables and grammar.

Audio library → choose a word → choose an audio file → optionally enter start/end seconds → Save. Web stores blobs in IndexedDB; native stores files in the app documents directory and metadata in AsyncStorage. Removing app/browser data removes these local records. Long recording imports are copied per word; short individual clips use less storage.

## Verification

TypeScript checking, Expo web export, native iOS bundle export, Expo dependency compatibility and browser functional checks are run during implementation. A real Xcode build and device playback remain required before distribution.
