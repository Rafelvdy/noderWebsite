import { useEffect, useState, RefObject } from 'react';

interface UseVisibilityTrackingOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

/**
 * Custom hook for tracking element visibility using Intersection Observer
 * 
 * @param ref - React ref to the element to track
 * @param options - Intersection Observer options
 * @returns Object with visibility state and intersection ratio
 */
export function useVisibilityTracking(
  ref: RefObject<Element>,
  options: UseVisibilityTrackingOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    root = null
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
          setIsIntersecting(entry.isIntersecting);
          setIntersectionRatio(entry.intersectionRatio);
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, root]);

  return {
    isVisible,
    isIntersecting,
    intersectionRatio
  };
}

/**
 * Hook specifically for 3D model visibility with optimized settings
 * 
 * @param ref - React ref to the model container
 * @returns Object with visibility state optimized for 3D rendering
 */
export function useModelVisibility(ref: RefObject<Element>) {
  return useVisibilityTracking(ref, {
    // Start loading/rendering when model is 20% visible
    threshold: [0, 0.2, 0.5, 0.8, 1.0],
    // Larger margin to preload models before they're fully visible
    rootMargin: '100px',
  });
}

export default useVisibilityTracking; 