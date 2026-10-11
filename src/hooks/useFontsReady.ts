import { useEffect, useState } from 'react';

// Resolves to true once the given CSS font descriptors have loaded.
export function useFontsReady(fontDescriptors: string[]): boolean {
  const [isReady, setIsReady] = useState(false);
  const descriptorKey = fontDescriptors.join('|');

  useEffect(() => {
    let isCancelled = false;
    Promise.all(descriptorKey.split('|').map((descriptor) => document.fonts.load(descriptor)))
      .catch(() => undefined)
      .finally(() => {
        if (!isCancelled) setIsReady(true);
      });
    return () => {
      isCancelled = true;
    };
  }, [descriptorKey]);

  return isReady;
}
