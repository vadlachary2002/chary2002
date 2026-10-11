// Typed surface of the page-flip library, limited to what the notebook uses.
declare module 'page-flip' {
  export interface PageFlipSettings {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    flippingTime?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    usePortrait?: boolean;
    mobileScrollSupport?: boolean;
    drawShadow?: boolean;
  }

  export interface PageFlipEvent {
    data: number | string;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings);
    loadFromHTML(pages: HTMLElement[] | NodeListOf<HTMLElement>): void;
    on(eventName: string, callback: (event: PageFlipEvent) => void): PageFlip;
    flipNext(): void;
    flipPrev(): void;
    getPageCount(): number;
    destroy(): void;
  }
}
