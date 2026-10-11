import { profile } from '../../data/profile';

// Plain list of articles, used when the visitor prefers reduced motion.
export function ArticleList() {
  return (
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
  );
}
