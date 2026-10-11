import { profile, SECTION_IDS } from '../../data/profile';
import { Section } from '../layout/Section';

// List of published articles, each linking out to where it was posted.
export function Articles() {
  return (
    <Section id={SECTION_IDS.articles} eyebrow="Articles" title="Things I've written.">
      <ul className="articles">
        {profile.articles.map((article) => (
          <li key={article.url}>
            <a className="article" href={article.url} target="_blank" rel="noopener noreferrer">
              <h3 className="article__title">{article.title}</h3>
              <span className="article__publisher">Read on {article.publisher} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
