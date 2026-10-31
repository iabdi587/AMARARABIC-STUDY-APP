/**
 * One recording per word, bundled for web and native iOS.
 * For duplicate filenames, use the highest numeric suffix (e.g. leg2.mp3).
 * Unmapped words show “Audio coming soon”.
 */
export const wordAudio: Readonly<Partial<Record<string, number>>> = {
  '1-Head-0': require('../assets/audio/head.mp3'), // Head
  '1-Head-1': require('../assets/audio/hair.mp3'), // Hair
  '1-Head-2': require('../assets/audio/face.mp3'), // Face
  '1-Head-3': require('../assets/audio/forehead.mp3'), // Forehead
  '1-Head-4': require('../assets/audio/eyebrow.mp3'), // Eyebrow
  '1-Head-5': require('../assets/audio/nose.mp3'), // Nose
  '1-Head-6': require('../assets/audio/mouth.mp3'), // Mouth
  '1-Head-7': require('../assets/audio/tongue.mp3'), // Tongue
  '1-Head-8': require('../assets/audio/chin.mp3'), // Chin
  '1-Head-9': require('../assets/audio/eye.mp3'), // Eye
  '1-Head-10': require('../assets/audio/ear.mp3'), // Ear
  '1-Head-11': require('../assets/audio/teeth.mp3'), // Teeth
  '1-Upper body-0': require('../assets/audio/shoulder.mp3'), // Shoulder
  '1-Upper body-1': require('../assets/audio/forearm2.mp3'), // Arm / forearm
  '1-Upper body-2': require('../assets/audio/chest.mp3'), // Chest
  '1-Upper body-3': require('../assets/audio/hand.mp3'), // Hand
  '1-Core & lower body-0': require('../assets/audio/heart.mp3'), // Heart
  '1-Core & lower body-1': require('../assets/audio/stomach2.mp3'), // Stomach
  '1-Core & lower body-2': require('../assets/audio/thigh.mp3'), // Thigh
  '1-Core & lower body-3': require('../assets/audio/leg2.mp3'), // Leg
  '1-Core & lower body-4': require('../assets/audio/knee.mp3'), // Knee
  '1-Core & lower body-5': require('../assets/audio/shin.mp3'), // Shin
  '1-Core & lower body-6': require('../assets/audio/foot.mp3'), // Foot
};
