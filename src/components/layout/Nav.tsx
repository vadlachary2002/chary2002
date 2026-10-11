import type { TransitionStyle } from '../../config/transitions';
import { SHOW_TRANSITION_SWITCHER } from '../../config/transitions';
import { profile, SECTION_IDS } from '../../data/profile';
import { scrollToSection } from '../../utils/scroll';
import { TransitionSwitcher } from './TransitionSwitcher';

const NAV_ITEMS = [
  { id: SECTION_IDS.about, label: 'About' },
  { id: SECTION_IDS.experience, label: 'Experience' },
  { id: SECTION_IDS.projects, label: 'Projects' },
  { id: SECTION_IDS.resume, label: 'Resume' },
  { id: SECTION_IDS.contact, label: 'Contact' },
];

interface NavProps {
  transitionStyle: TransitionStyle;
  onTransitionStyleChange: (style: TransitionStyle) => void;
}

// Fixed top bar with initials, section links and the ring style switcher.
export function Nav({ transitionStyle, onTransitionStyleChange }: NavProps) {
  return (
    <nav className="nav" aria-label="Main">
      <button type="button" className="nav__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {profile.firstName[0]}
        {profile.lastName[0]}
        <span className="nav__dot" />
      </button>
      <div className="nav__right">
        <ul className="nav__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => scrollToSection(item.id)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        {SHOW_TRANSITION_SWITCHER && <TransitionSwitcher style={transitionStyle} onChange={onTransitionStyleChange} />}
      </div>
    </nav>
  );
}
