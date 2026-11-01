# AMAR Arabic Study Companion

An Expo / React Native application for **native iOS and web**, with a navy, teal and orange theme inspired by rahmaniyyah.com. It is an independent personal study companion, not an official AMAR product.

## Features

- 15 level slots; Level 1 is populated, remaining levels await course content.
- Selected Arabic vocabulary organised by the PDF's 11 topic sections (topics 7–8 are combined).
- Click/tap a word to play its bundled recording. No generated or substitute Sheikh voice.
- One developer-managed audio file per word, shared by the web and native iOS builds.
- Flashcards, vocabulary quizzes, bookmarks and learned-word tracking.
- Complete original 149-page student revision PDF, including grammar, worksheets and answer sheets.
- On native iOS the PDF opens through the system share sheet; choose a PDF reader / Save to Files. The full PDF is bundled and available offline in the installed app.
- Optional email-code accounts with learned-word and bookmark syncing through Supabase; guest study and offline caching remain available. Live accounts require the Supabase and email-sender setup described below.

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

For an iPhone using Expo Go from the App Store, this project targets Expo SDK 54. Start a tunnel if your phone cannot reach the development computer over the local network:

```sh
npx expo start --go --tunnel --clear
```

Scan the terminal QR code with the iPhone Camera and open it in Expo Go. Keep the server running and use the newly generated QR code after restarting.

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

Add the Sheikh’s individual word recordings directly to `assets/audio/level-1/body-parts/` or `assets/audio/level-1/numbers/`, then map them to word IDs in `src/wordAudio.ts`. For example, after adding `head.mp3`:

```ts
export const wordAudio: Readonly<Partial<Record<string, number>>> = {
  '1-Head-0': require('../assets/audio/level-1/body-parts/head.mp3'),
};
```

`1-Head-0` is the ID of رَأْسٌ (Head). IDs are generated in `src/course.ts` from the topic number, group, and zero-based row index; keep IDs stable to preserve saved progress. Use literal `require` paths so Metro includes the audio in both web and native iOS builds. MP3 and M4A are suitable formats. Add the file before adding the map entry, then rebuild and publish the app.

Unmapped words show “Audio coming soon”. Students only listen: there are no upload, trim, or file-management controls. Each mapped file plays from the beginning to the end. Existing local imports are no longer used; stored learning progress is preserved.

## Accounts and cloud progress

The sign-in UI, offline sync queue, and Supabase database migration are implemented. See [account setup](docs/ACCOUNTS.md) for activation and current prerequisites. A Supabase connection and production email sender are still required; without configuration the app continues in guest mode.

## Verification

TypeScript checking, Expo web export, native iOS bundle export, Expo dependency compatibility and browser functional checks are run during implementation. A real Xcode build and device playback remain required before distribution.
