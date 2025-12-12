import { useEffect, useState } from 'react';

export function useAutoCycling<T>(items: T[], interval: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => {
      clearInterval(cycleInterval);
    };
  }, [items.length, interval]);

  return { activeIndex, setActiveIndex };
}
