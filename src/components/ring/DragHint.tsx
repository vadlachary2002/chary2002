import type { CardHold } from '../../types/cardHold';

const STRETCH_HINT = 'Stretch far and hold for 3 seconds to break the strap';
const TORN_HINT = 'Strap broken. Let go to drop the card';

// Text for the current hold: the instruction, a countdown while over-stretched, or what to do after the tear.
function hintText(hold: CardHold): string {
  if (hold.isTorn) return TORN_HINT;
  if (hold.secondsToTear !== null) return `Keep holding… ${hold.secondsToTear}`;
  return STRETCH_HINT;
}

// Small grey hint in the middle of the hero, shown only while a card is held.
export function DragHint({ hold }: { hold: CardHold }) {
  return (
    <p className={`drag-hint ${hold.isHeld ? 'is-visible' : ''}`} aria-live="polite">
      {hold.isHeld ? hintText(hold) : ''}
    </p>
  );
}
