import { useEffect, useState } from 'react';

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const hasShownLoader = sessionStorage.getItem("hasShownKillTheBoyLoader");

    if (hasShownLoader === "true") {
      setIsLoading(false);
      setShowContent(true);
      return;
    }

    let fontsLoaded = false;
    let domReady = false;
    let minimumTimeElapsed = false;

    const checkAllReady = () => {
      if (fontsLoaded && domReady && minimumTimeElapsed) {
        sessionStorage.setItem("hasShownKillTheBoyLoader", "true");
      }
    };

    if (document.fonts.ready) {
      document.fonts.ready.then(() => {
        fontsLoaded = true;
        checkAllReady();
      });
    } else {
      fontsLoaded = true;
      checkAllReady();
    }

    domReady = true;
    checkAllReady();

    const minimumTimer = setTimeout(() => {
      minimumTimeElapsed = true;
      checkAllReady();
    }, 2800);

    return () => {
      clearTimeout(minimumTimer);
    };
  }, []);

  const handleLoaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return { isLoading, showContent, handleLoaderComplete };
}
