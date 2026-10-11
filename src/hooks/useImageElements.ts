import { useEffect, useState } from 'react';

export type ImageElementMap = ReadonlyMap<string, HTMLImageElement>;

// Loads every URL once and returns the decoded images keyed by URL; failed loads are skipped.
export function useImageElements(urls: string[]): ImageElementMap {
  const [images, setImages] = useState<ImageElementMap>(new Map());
  const urlKey = urls.join('|');

  useEffect(() => {
    if (!urlKey) return;
    let isCancelled = false;
    const loads = urlKey.split('|').map(async (url) => {
      const element = new Image();
      element.src = url;
      await element.decode();
      return [url, element] as const;
    });
    Promise.allSettled(loads).then((results) => {
      if (isCancelled) return;
      const loaded = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
      setImages(new Map(loaded));
    });
    return () => {
      isCancelled = true;
    };
  }, [urlKey]);

  return images;
}
