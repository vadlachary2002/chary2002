import { SECTION_IDS } from '../../data/profile';
import { prefersReducedMotion } from '../../utils/webgl';
import { ArticleList } from '../articles/ArticleList';
import { ArticleNotebook } from '../articles/ArticleNotebook';
import { Section } from '../layout/Section';

// Published writing, shown as a flip-through notebook or a plain list for reduced motion.
export function Articles() {
  return (
    <Section id={SECTION_IDS.articles} eyebrow="Articles" title="Things I've written.">
      {prefersReducedMotion() ? <ArticleList /> : <ArticleNotebook />}
    </Section>
  );
}
