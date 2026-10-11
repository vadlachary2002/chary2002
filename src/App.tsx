import { Nav } from './components/layout/Nav';
import { RingHero } from './components/ring/RingHero';
import { About } from './components/sections/About';
import { Articles } from './components/sections/Articles';
import { Contact } from './components/sections/Contact';
import { ExperienceTimeline } from './components/sections/ExperienceTimeline';
import { Projects } from './components/sections/Projects';
import { ResumeViewer } from './components/sections/ResumeViewer';
import { Skills } from './components/sections/Skills';
import { profile } from './data/profile';
import { useTransitionStyle } from './hooks/useTransitionStyle';

// Page shell: nav, physics hero, then the content sections.
export default function App() {
  const [transitionStyle, setTransitionStyle] = useTransitionStyle();

  return (
    <>
      <Nav transitionStyle={transitionStyle} onTransitionStyleChange={setTransitionStyle} />
      <RingHero transitionStyle={transitionStyle} />
      <main>
        <About />
        <ExperienceTimeline />
        <Projects />
        <Articles />
        <Skills />
        <ResumeViewer />
        <Contact />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} {profile.firstName} {profile.lastName}. Built with React Three Fiber and Rapier.
      </footer>
    </>
  );
}
