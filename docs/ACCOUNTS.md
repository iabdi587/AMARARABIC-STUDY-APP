# Accounts and progress sync

## Current implementation

The Expo app supports optional passwordless email-code sign-in on web and native iOS. Students can continue as guests. Sign-in claims the current guest's learned words and bookmarks once. Each account has a separate on-device cache. Offline edits remain queued and sync after reconnection, on app focus, and at 30-second intervals. Each sync changes one flag on one word, so saving a bookmark on one device does not overwrite a learned flag from another device. If two devices change the same flag offline, the last edit received by the server wins.

Sign out returns to a separate guest workspace. Account deletion removes the authenticated Supabase user and their progress through an authenticated database function. Audio remains bundled and shared; it is never uploaded into students' accounts.

Without Supabase configuration, guest study continues and the account dialog explains that sign-in is not activated. There is no simulated production authentication.

## Activate a new free Supabase project

1. Connect Supabase to this conversation and select a new free project (already requested). Provisioning and actual email delivery cannot be completed until the owner's Supabase account is connected.
2. Apply `supabase/migrations/202610310001_progress.sql` using a migration tool or Supabase SQL editor. This creates the progress table, row-level read policy, per-field write RPC, and account-deletion RPC. Only the authenticated account can read its rows. Anonymous clients cannot read/write progress or delete an account.
3. Enable email authentication and sign-ups in Supabase Authentication. Keep email confirmation enabled. Configure an appropriate code lifetime (for example, 10 minutes) and rate limits.
4. Replace the **Magic Link** email template with `supabase/templates/magic_link.html`. The `{{ .Token }}` value gives students a numeric code; do not leave the default link-only template in place. No app deep link or web auth callback is required for code entry.
5. Configure a production SMTP sender and verify its sender domain. Supabase's built-in email service is restricted to project-team addresses and is not suitable for a student launch. Do not disable email verification to work around this. Domain registration/email-sending plans are separate from Supabase's free database tier. The owner has not provided a domain or sender yet.
6. Copy `.env.example` to `.env` and enter the project's URL and **publishable** client key. Never use a secret/service-role key in `EXPO_PUBLIC_*` variables. Public keys are intentionally part of the app; database policies provide account isolation.
7. Build web with `npm run build:web`. Expo substitutes public environment variables during the build. Setting only production runtime environment variables will not reconfigure an already exported static website. Rebuild and redeploy after changing them.
8. For EAS iOS builds, configure the same two public variables for the EAS build environment. Rebuild the native app. The committed `ios/` project can also be built in Xcode after the normal Expo/CocoaPods setup.
9. Test actual code delivery to a verified team email, then a student email through production SMTP. Test two real accounts, two devices, sign-out/relaunch, offline edits, and account deletion before enabling a public launch. The existing Sites audience remains private until the owner explicitly requests changing it.

Required public variables:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_CLIENT_KEY
```

## Verification

```sh
npm run check
npm run test:progress
npm run build:web
npx expo export --platform ios
```

`tests/progress.test.ts` covers guest migration, legacy progress, account separation, cross-device flags, pending edits during requests, restart after offline changes, and stopped sessions. `tests/database.sql` checks RPC access, row isolation, anonymous denial, and account-deletion cascading. Run it only against a dedicated test database: it runs in a transaction and rolls back its test users. During development it was run against an isolated temporary PostgreSQL instance with a test `auth.uid()` implementation; it does not replace validation against the live Supabase service.

Browser tests may mock Supabase responses to exercise UI and session transitions. These are integration checks, not evidence of live email delivery or live Supabase provisioning.
