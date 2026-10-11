const FIRST_ARTICLE_PAGE = 3;
const PAGES_PER_ARTICLE = 2;

// Page number on which an article's spread starts in the notebook.
export function articleStartPage(articleIndex: number): number {
  return FIRST_ARTICLE_PAGE + articleIndex * PAGES_PER_ARTICLE;
}
