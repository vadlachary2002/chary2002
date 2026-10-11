import { useEffect, useState } from 'react';

const BLOCKED_SHORTCUT_KEYS = new Set(['p', 's']);
const SCREENSHOT_KEY = 'PrintScreen';
const SCREENSHOT_BLUR_MS = 1500;
const CLIPBOARD_NOTICE = 'Screenshots of this resume are disabled. Request a copy from the site instead.';

// Blocks print/save shortcuts and blurs the resume whenever the page loses focus.
export function useResumeProtection(): boolean {
  const [isConcealed, setIsConcealed] = useState(false);

  useEffect(() => {
    const conceal = () => setIsConcealed(true);
    const reveal = () => setIsConcealed(false);
    const handleVisibilityChange = () => (document.hidden ? conceal() : reveal());

    const handleKeyDown = (event: KeyboardEvent) => {
      const hasModifier = event.metaKey || event.ctrlKey;
      if (hasModifier && BLOCKED_SHORTCUT_KEYS.has(event.key.toLowerCase())) event.preventDefault();
      if (hasModifier && event.shiftKey) conceal();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey) reveal();
      if (event.key !== SCREENSHOT_KEY) return;
      conceal();
      navigator.clipboard?.writeText(CLIPBOARD_NOTICE).catch(() => undefined);
      window.setTimeout(reveal, SCREENSHOT_BLUR_MS);
    };

    window.addEventListener('blur', conceal);
    window.addEventListener('focus', reveal);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('blur', conceal);
      window.removeEventListener('focus', reveal);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return isConcealed;
}
