const CLICK_DURATION_S = 0.04;
const CLICK_BASE_FREQUENCY_HZ = 2600;
const CLICK_FREQUENCY_JITTER_HZ = 700;
const CLICK_FILTER_Q = 7;
const CLICK_GAIN = 0.55;
const THUNK_FREQUENCY_HZ = 140;
const THUNK_DURATION_S = 0.03;
const THUNK_GAIN = 0.3;
const NOISE_DECAY = 7;

let noiseBuffer: AudioBuffer | null = null;

// Short burst of decaying white noise reused for every click.
function getNoiseBuffer(context: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) return noiseBuffer;
  const length = Math.floor(context.sampleRate * CLICK_DURATION_S);
  noiseBuffer = context.createBuffer(1, length, context.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let index = 0; index < length; index++) {
    samples[index] = (Math.random() * 2 - 1) * Math.exp((-NOISE_DECAY * index) / length);
  }
  return noiseBuffer;
}

// Creates the audio context; call from a click or key press so browsers allow playback.
export function createGearAudio(): AudioContext | null {
  const AudioContextClass = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

// Plays one ratchet tick: a filtered metallic click over a soft low thunk.
export function playGearTick(context: AudioContext, intensity: number): void {
  const now = context.currentTime;
  const volume = Math.min(Math.max(intensity, 0.3), 1);

  const click = context.createBufferSource();
  click.buffer = getNoiseBuffer(context);
  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = CLICK_BASE_FREQUENCY_HZ + Math.random() * CLICK_FREQUENCY_JITTER_HZ;
  filter.Q.value = CLICK_FILTER_Q;
  const clickGain = context.createGain();
  clickGain.gain.value = CLICK_GAIN * volume;
  click.connect(filter).connect(clickGain).connect(context.destination);
  click.start(now);

  const thunk = context.createOscillator();
  thunk.type = 'triangle';
  thunk.frequency.value = THUNK_FREQUENCY_HZ;
  const thunkGain = context.createGain();
  thunkGain.gain.setValueAtTime(THUNK_GAIN * volume, now);
  thunkGain.gain.exponentialRampToValueAtTime(0.0001, now + THUNK_DURATION_S);
  thunk.connect(thunkGain).connect(context.destination);
  thunk.start(now);
  thunk.stop(now + THUNK_DURATION_S);
}
