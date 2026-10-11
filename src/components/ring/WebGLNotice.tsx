import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { detectBrowser, WEBGL_ENABLE_STEPS } from '../../utils/browser';

const DISMISSED_KEY = 'portfolio-webgl-notice-dismissed';

// Remembers for this browser session that the visitor closed the notice.
function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

// Stores the dismissal so the notice doesn't reappear on every scroll or reload in this session.
function storeDismissed(): void {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, 'true');
  } catch {
    return;
  }
}

// Explains that the 3D animation is off because WebGL is unavailable, with steps for the visitor's browser.
export function WebGLNotice() {
  const [isOpen, setIsOpen] = useState(() => !readDismissed());
  const titleId = useId();
  const reloadButton = useRef<HTMLButtonElement>(null);
  const detectedBrowser = useMemo(() => detectBrowser(navigator.userAgent), []);
  const primarySteps = WEBGL_ENABLE_STEPS.find((entry) => entry.browser === detectedBrowser) ?? WEBGL_ENABLE_STEPS[WEBGL_ENABLE_STEPS.length - 1];
  const otherSteps = WEBGL_ENABLE_STEPS.filter((entry) => entry !== primarySteps);

  // Closes the notice and remembers the choice.
  const dismiss = () => {
    storeDismissed();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    reloadButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="webgl-notice" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="webgl-notice__card">
        <p className="webgl-notice__eyebrow">3D animation is off</p>
        <h2 id={titleId} className="webgl-notice__title">
          This page has interactive 3D cards
        </h2>
        <p className="webgl-notice__text">
          Your browser has WebGL (3D graphics) turned off, so you&apos;re seeing a simpler version. To see the full experience in{' '}
          {primarySteps.name}:
        </p>
        <ol className="webgl-notice__steps">
          {primarySteps.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <details className="webgl-notice__more">
          <summary>Using a different browser?</summary>
          {otherSteps.map((entry) => (
            <div key={entry.browser} className="webgl-notice__other">
              <strong>{entry.name}</strong>
              <ol>
                {entry.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </details>
        <div className="webgl-notice__actions">
          <button ref={reloadButton} type="button" className="button button--primary" onClick={() => window.location.reload()}>
            I turned it on, reload
          </button>
          <button type="button" className="button" onClick={dismiss}>
            Continue without animation
          </button>
        </div>
      </div>
    </div>
  );
}
