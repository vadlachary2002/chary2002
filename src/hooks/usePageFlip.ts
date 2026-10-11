import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PageFlip } from 'page-flip';
import {
  NOTEBOOK_FLIP_MS,
  NOTEBOOK_MAX_PAGE_HEIGHT,
  NOTEBOOK_MAX_PAGE_WIDTH,
  NOTEBOOK_MAX_SHADOW_OPACITY,
  NOTEBOOK_MIN_PAGE_HEIGHT,
  NOTEBOOK_MIN_PAGE_WIDTH,
  NOTEBOOK_PAGE_HEIGHT,
  NOTEBOOK_PAGE_WIDTH,
} from '../config/notebook';

const FLIP_EVENT = 'flip';

export interface PageFlipControls {
  pageIndex: number;
  pageCount: number;
  flipNext: () => void;
  flipPrev: () => void;
}

// Turns the template's child pages into a page-flip book mounted inside the host element.
export function usePageFlip(templateRef: RefObject<HTMLElement | null>, hostRef: RefObject<HTMLElement | null>): PageFlipControls {
  const bookRef = useRef<PageFlip | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const template = templateRef.current;
    const host = hostRef.current;
    if (!template || !host) return;

    let isCancelled = false;
    const bookElement = document.createElement('div');
    host.appendChild(bookElement);

    void import('page-flip').then(({ PageFlip: PageFlipBook }) => {
      if (isCancelled) return;
      const book = new PageFlipBook(bookElement, {
        width: NOTEBOOK_PAGE_WIDTH,
        height: NOTEBOOK_PAGE_HEIGHT,
        size: 'stretch',
        minWidth: NOTEBOOK_MIN_PAGE_WIDTH,
        maxWidth: NOTEBOOK_MAX_PAGE_WIDTH,
        minHeight: NOTEBOOK_MIN_PAGE_HEIGHT,
        maxHeight: NOTEBOOK_MAX_PAGE_HEIGHT,
        flippingTime: NOTEBOOK_FLIP_MS,
        maxShadowOpacity: NOTEBOOK_MAX_SHADOW_OPACITY,
        showCover: true,
        usePortrait: true,
        mobileScrollSupport: true,
        drawShadow: true,
      });
      const pages = [...template.children].map((page) => page.cloneNode(true) as HTMLElement);
      book.loadFromHTML(pages);
      book.on(FLIP_EVENT, (event) => setPageIndex(Number(event.data)));
      bookRef.current = book;
      setPageCount(book.getPageCount());
    });

    return () => {
      isCancelled = true;
      bookRef.current?.destroy();
      bookRef.current = null;
      bookElement.remove();
    };
  }, [templateRef, hostRef]);

  const flipNext = useCallback(() => bookRef.current?.flipNext(), []);
  const flipPrev = useCallback(() => bookRef.current?.flipPrev(), []);

  return { pageIndex, pageCount, flipNext, flipPrev };
}
