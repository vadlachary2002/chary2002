import { useCallback, useEffect, useRef, useState } from 'react';
import { createGearAudio, playGearTick } from '../utils/gearSound';
import { MINOR_TICK_STEP_DEG, TICK_SPACING_DEG } from '../utils/ringLayout';

export const GEAR_SOUND_ON_BY_DEFAULT = true;
const MIN_TICK_INTERVAL_MS = 28;
const FAST_TICKS_PER_FRAME = 3;
const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchend'] as const;

export interface GearSound {
  isEnabled: boolean;
  toggle: () => void;
}

// Ticks like a ratchet whenever the ring turns past one of its minor tick marks.
export function useGearSound(position: number): GearSound {
  const [isEnabled, setIsEnabled] = useState(GEAR_SOUND_ON_BY_DEFAULT);
  const audio = useRef<AudioContext | null>(null);
  const lastTick = useRef(Math.floor((position * TICK_SPACING_DEG) / MINOR_TICK_STEP_DEG));
  const lastPlayedAt = useRef(0);

  useAudioUnlock(audio);

  useEffect(() => {
    const tick = Math.floor((position * TICK_SPACING_DEG) / MINOR_TICK_STEP_DEG);
    const ticksPassed = Math.abs(tick - lastTick.current);
    lastTick.current = tick;
    const context = audio.current;
    if (!isEnabled || !context || context.state !== 'running' || ticksPassed === 0) return;
    const now = performance.now();
    if (now - lastPlayedAt.current < MIN_TICK_INTERVAL_MS) return;
    lastPlayedAt.current = now;
    playGearTick(context, ticksPassed / FAST_TICKS_PER_FRAME);
  }, [position, isEnabled]);

  useEffect(() => () => void audio.current?.close(), []);

  const toggle = useCallback(() => {
    audio.current ??= createGearAudio();
    void audio.current?.resume();
    setIsEnabled((previous) => !previous);
  }, []);

  return { isEnabled, toggle };
}

// Browsers only allow sound after a click, tap or key press, so the audio starts on the visitor's first one.
function useAudioUnlock(audio: { current: AudioContext | null }): void {
  useEffect(() => {
    const unlock = () => {
      audio.current ??= createGearAudio();
      void audio.current?.resume();
      UNLOCK_EVENTS.forEach((eventName) => window.removeEventListener(eventName, unlock, true));
    };
    UNLOCK_EVENTS.forEach((eventName) => window.addEventListener(eventName, unlock, true));
    return () => UNLOCK_EVENTS.forEach((eventName) => window.removeEventListener(eventName, unlock, true));
  }, [audio]);
}
