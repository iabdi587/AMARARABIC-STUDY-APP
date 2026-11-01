# Word recordings

Organize one recording per word by level and lesson:

- `level-1/body-parts/` — body-parts recordings
- `level-1/numbers/` — numbers recordings

Map each file to its stable word ID in `src/wordAudio.ts`, using a literal `require` path so Expo bundles it for web and native iOS:

```ts
'1-Head-0': require('../assets/audio/level-1/body-parts/head.mp3'),
'2-Fundamentals-10': require('../assets/audio/level-1/numbers/ten2.mp3'),
```

For named duplicates, use the highest numeric suffix (`ten2.mp3` over `ten.mp3`). Filenames made entirely of digits, such as `200.mp3` and `1000.mp3`, identify numbers rather than recording versions. Keep older files unless you want to remove them; only mapped recordings are bundled.

`fourty.mp3` is mapped to the Forty card. `two.mp3` maps to `2-Fundamentals-2` and `three.mp3` maps to `2-Fundamentals-3`. All 30 number cards have a recording.

No trimming or student uploads are used. Rebuild the web and native iOS apps after adding or moving recordings.
