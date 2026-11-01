/**
 * One recording per word, bundled for web and native iOS.
 * For duplicate filenames, use the highest numeric suffix (e.g. leg2.mp3).
 * Unmapped words show “Audio coming soon”.
 */
export const wordAudio: Readonly<Partial<Record<string, number>>> = {
  '1-Head-0': require('../assets/audio/level-1/body-parts/head.mp3'), // Head
  '1-Head-1': require('../assets/audio/level-1/body-parts/hair.mp3'), // Hair
  '1-Head-2': require('../assets/audio/level-1/body-parts/face.mp3'), // Face
  '1-Head-3': require('../assets/audio/level-1/body-parts/forehead.mp3'), // Forehead
  '1-Head-4': require('../assets/audio/level-1/body-parts/eyebrow.mp3'), // Eyebrow
  '1-Head-5': require('../assets/audio/level-1/body-parts/nose.mp3'), // Nose
  '1-Head-6': require('../assets/audio/level-1/body-parts/mouth.mp3'), // Mouth
  '1-Head-7': require('../assets/audio/level-1/body-parts/tongue.mp3'), // Tongue
  '1-Head-8': require('../assets/audio/level-1/body-parts/chin.mp3'), // Chin
  '1-Head-9': require('../assets/audio/level-1/body-parts/eye.mp3'), // Eye
  '1-Head-10': require('../assets/audio/level-1/body-parts/ear.mp3'), // Ear
  '1-Head-11': require('../assets/audio/level-1/body-parts/teeth.mp3'), // Teeth
  '1-Upper body-0': require('../assets/audio/level-1/body-parts/shoulder.mp3'), // Shoulder
  '1-Upper body-1': require('../assets/audio/level-1/body-parts/forearm2.mp3'), // Arm / forearm
  '1-Upper body-2': require('../assets/audio/level-1/body-parts/chest.mp3'), // Chest
  '1-Upper body-3': require('../assets/audio/level-1/body-parts/hand.mp3'), // Hand
  '1-Core & lower body-0': require('../assets/audio/level-1/body-parts/heart.mp3'), // Heart
  '1-Core & lower body-1': require('../assets/audio/level-1/body-parts/stomach2.mp3'), // Stomach
  '1-Core & lower body-2': require('../assets/audio/level-1/body-parts/thigh.mp3'), // Thigh
  '1-Core & lower body-3': require('../assets/audio/level-1/body-parts/leg2.mp3'), // Leg
  '1-Core & lower body-4': require('../assets/audio/level-1/body-parts/knee.mp3'), // Knee
  '1-Core & lower body-5': require('../assets/audio/level-1/body-parts/shin.mp3'), // Shin
  '1-Core & lower body-6': require('../assets/audio/level-1/body-parts/foot.mp3'), // Foot

  // Numbers
  '2-Fundamentals-0': require('../assets/audio/level-1/numbers/zero.mp3'), // Zero
  '2-Fundamentals-1': require('../assets/audio/level-1/numbers/one.mp3'), // One
  '2-Fundamentals-2': require('../assets/audio/level-1/numbers/two.mp3'), // Two
  '2-Fundamentals-3': require('../assets/audio/level-1/numbers/three.mp3'), // Three
  '2-Fundamentals-4': require('../assets/audio/level-1/numbers/four.mp3'), // Four
  '2-Fundamentals-5': require('../assets/audio/level-1/numbers/five.mp3'), // Five
  '2-Fundamentals-6': require('../assets/audio/level-1/numbers/six.mp3'), // Six
  '2-Fundamentals-7': require('../assets/audio/level-1/numbers/seven.mp3'), // Seven
  '2-Fundamentals-8': require('../assets/audio/level-1/numbers/eight.mp3'), // Eight
  '2-Fundamentals-9': require('../assets/audio/level-1/numbers/nine.mp3'), // Nine
  '2-Fundamentals-10': require('../assets/audio/level-1/numbers/ten2.mp3'), // Ten
  '2-Fundamentals-11': require('../assets/audio/level-1/numbers/twenty.mp3'), // Twenty
  '2-Fundamentals-12': require('../assets/audio/level-1/numbers/thirty.mp3'), // Thirty
  '2-Fundamentals-13': require('../assets/audio/level-1/numbers/fourty.mp3'), // Forty
  '2-Fundamentals-14': require('../assets/audio/level-1/numbers/fifty.mp3'), // Fifty
  '2-Fundamentals-15': require('../assets/audio/level-1/numbers/sixty.mp3'), // Sixty
  '2-Fundamentals-16': require('../assets/audio/level-1/numbers/seventy.mp3'), // Seventy
  '2-Fundamentals-17': require('../assets/audio/level-1/numbers/eighty.mp3'), // Eighty
  '2-Fundamentals-18': require('../assets/audio/level-1/numbers/ninety.mp3'), // Ninety
  '2-Fundamentals-19': require('../assets/audio/level-1/numbers/onehundred.mp3'), // One hundred
  '2-Fundamentals-20': require('../assets/audio/level-1/numbers/1000.mp3'), // One thousand
  '2-Fundamentals-21': require('../assets/audio/level-1/numbers/200.mp3'), // Two hundred
  '2-Fundamentals-22': require('../assets/audio/level-1/numbers/300.mp3'), // Three hundred
  '2-Fundamentals-23': require('../assets/audio/level-1/numbers/400.mp3'), // Four hundred
  '2-Fundamentals-24': require('../assets/audio/level-1/numbers/500.mp3'), // Five hundred
  '2-Fundamentals-25': require('../assets/audio/level-1/numbers/600.mp3'), // Six hundred
  '2-Fundamentals-26': require('../assets/audio/level-1/numbers/700.mp3'), // Seven hundred
  '2-Fundamentals-27': require('../assets/audio/level-1/numbers/800.mp3'), // Eight hundred
  '2-Fundamentals-28': require('../assets/audio/level-1/numbers/900.mp3'), // Nine hundred
  '2-Fundamentals-29': require('../assets/audio/level-1/numbers/million.mp3'), // One million
};
