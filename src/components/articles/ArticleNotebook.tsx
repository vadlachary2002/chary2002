import { useRef } from 'react';
import { profile } from '../../data/profile';
import { usePageFlip } from '../../hooks/usePageFlip';
import { articleStartPage } from '../../utils/notebook';
import {
  ArticleExcerptPage,
  ArticleTitlePage,
  BackCover,
  ContentsPage,
  EndPage,
  FrontCover,
  InsideCoverPage,
  PaperPage,
} from './NotebookPages';

// Articles as a notebook whose paper pages curl and turn under drag, click or the buttons.
export function ArticleNotebook() {
  const templateRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const { pageIndex, pageCount, flipNext, flipPrev } = usePageFlip(templateRef, hostRef);
  const ownerName = `${profile.firstName} ${profile.lastName}`;
  const endPageNumber = articleStartPage(profile.articles.length);
  const isOnLastPage = pageCount > 0 && pageIndex >= pageCount - 1;

  return (
    <div className="notebook">
      <div ref={templateRef} hidden>
        <FrontCover ownerName={ownerName} />
        <InsideCoverPage ownerName={ownerName} />
        <ContentsPage articles={profile.articles} />
        {profile.articles.map((article, index) => [
          <ArticleTitlePage key={`${article.url}-title`} article={article} articleIndex={index} />,
          <ArticleExcerptPage key={`${article.url}-excerpt`} article={article} articleIndex={index} />,
        ])}
        <EndPage writingProfileUrl={profile.writingProfileUrl} pageNumber={endPageNumber} />
        <PaperPage />
        <BackCover />
      </div>
      <div ref={hostRef} className="notebook__book" />
      <div className="notebook__controls">
        <button type="button" onClick={flipPrev} disabled={pageIndex === 0}>
          ← Prev
        </button>
        <span className="notebook__hint">Drag a page corner, or tap the edge, to turn it</span>
        <button type="button" onClick={flipNext} disabled={isOnLastPage}>
          Next →
        </button>
      </div>
    </div>
  );
}
