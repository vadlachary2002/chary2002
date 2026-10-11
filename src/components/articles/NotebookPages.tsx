import type { ReactNode } from 'react';
import type { Article } from '../../types/profile';
import { articleStartPage } from '../../utils/notebook';

const HARD_DENSITY = 'hard';

// Rigid front cover with the notebook title.
export function FrontCover({ ownerName }: { ownerName: string }) {
  return (
    <div className="note-page note-page--cover" data-density={HARD_DENSITY}>
      <span className="note-cover__band" />
      <div className="note-cover__content">
        <p className="note-cover__eyebrow">Articles</p>
        <h3 className="note-cover__title">Field Notes</h3>
        <p className="note-cover__owner">by {ownerName}</p>
      </div>
      <p className="note-cover__hint">Drag the corner to open →</p>
    </div>
  );
}

// Rigid back cover.
export function BackCover() {
  return (
    <div className="note-page note-page--cover note-page--back" data-density={HARD_DENSITY}>
      <span className="note-cover__band" />
      <div className="note-cover__content">
        <p className="note-cover__eyebrow">The end, for now</p>
      </div>
    </div>
  );
}

// Ruled paper page; numbered pages show their number in the footer.
export function PaperPage({ pageNumber, children }: { pageNumber?: number; children?: ReactNode }) {
  return (
    <div className="note-page note-page--paper">
      <div className="note-page__body">{children}</div>
      {pageNumber !== undefined && <span className="note-page__number">{pageNumber}</span>}
    </div>
  );
}

// Inside of the front cover, like a name label in a notebook.
export function InsideCoverPage({ ownerName }: { ownerName: string }) {
  return (
    <PaperPage>
      <p className="note-label">This notebook belongs to</p>
      <p className="note-owner">{ownerName}</p>
      <p className="note-aside">Notes on things I've built, broken and fixed in production.</p>
    </PaperPage>
  );
}

// Table of contents listing every article with its starting page.
export function ContentsPage({ articles }: { articles: Article[] }) {
  return (
    <PaperPage pageNumber={2}>
      <p className="note-label">Contents</p>
      <ol className="note-contents">
        {articles.map((article, index) => (
          <li key={article.url}>
            <span>{article.title}</span>
            <span className="note-contents__page">{articleStartPage(index)}</span>
          </li>
        ))}
      </ol>
    </PaperPage>
  );
}

// Left page of an article spread: title, publisher and what it covers.
export function ArticleTitlePage({ article, articleIndex }: { article: Article; articleIndex: number }) {
  return (
    <PaperPage pageNumber={articleStartPage(articleIndex)}>
      <p className="note-label">Note {String(articleIndex + 1).padStart(2, '0')} · {article.publisher}</p>
      <h4 className="note-title">{article.title}</h4>
      <p className="note-label note-label--small">Inside</p>
      <ul className="note-topics">
        {article.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </PaperPage>
  );
}

// Right page of an article spread: its opening paragraphs and the link to read on.
export function ArticleExcerptPage({ article, articleIndex }: { article: Article; articleIndex: number }) {
  return (
    <PaperPage pageNumber={articleStartPage(articleIndex) + 1}>
      <div className="note-excerpt">
        {article.excerpt.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <a className="note-link" href={article.url} target="_blank" rel="noopener noreferrer">
        Read the full article on {article.publisher} ↗
      </a>
    </PaperPage>
  );
}

// Closing page pointing to where new notes will appear.
export function EndPage({ writingProfileUrl, pageNumber }: { writingProfileUrl: string; pageNumber: number }) {
  return (
    <PaperPage pageNumber={pageNumber}>
      <p className="note-label">More notes coming soon</p>
      <p className="note-aside">I write about the systems I build: AI agents, workflows and frontend migrations.</p>
      <a className="note-link" href={writingProfileUrl} target="_blank" rel="noopener noreferrer">
        Follow along on Medium ↗
      </a>
    </PaperPage>
  );
}
