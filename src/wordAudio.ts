/**
 * One recording per word. Use the stable word IDs in course.ts.
 * Add a literal require for each file so Expo bundles it on web and iOS.
 * Unmapped words show “Audio coming soon”.
 */
export const wordAudio: Readonly<Partial<Record<string, number>>> = {
  // After adding assets/audio/level-1/head.mp3, uncomment:
  // '1-Head-0': require('../assets/audio/level-1/head.mp3'),
};
