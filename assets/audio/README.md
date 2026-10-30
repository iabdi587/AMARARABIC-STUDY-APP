# Word recordings

Place the Sheikh’s individual Level 1 recordings in `level-1/` (for example, `level-1/head.mp3`). Then add each file to `src/wordAudio.ts` using the corresponding word ID and a literal `require` path.

Example, after the file exists:

```ts
'1-Head-0': require('../assets/audio/level-1/head.mp3'),
```

Use one complete recording per word. No trimming or student uploads are used. Rebuild the web and native iOS apps after adding recordings. See the project README for details.
