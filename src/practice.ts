import type { Word } from './course';
export type PracticeQuestion = { word: Word; options: Word[] };

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Generate once per round so both question and answer order stay stable while answering. */
export function createPractice(words: readonly Word[]): PracticeQuestion[] {
  return shuffled(words).map(word => ({
    word,
    options: shuffled([word, ...shuffled(words.filter(other => other.id !== word.id)).slice(0, 3)]),
  }));
}
