import { ComponentType, lazy, LazyExoticComponent, Suspense, ReactNode } from "react";
import { LoadingSpinner } from "@/components/loading-wrapper";

/**
 * Utility for lazy loading components with better error handling and loading states
 */

interface LazyLoadOptions {
  fallback?: ReactNode;
  delay?: number;
  onError?: (error: Error) => void;
}

/**
 * Enhanced lazy load wrapper with customizable fallback
 * Usage: const MyComponent = lazyLoad(() => import('./MyComponent'), { fallback: <Skeleton /> })
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> {
  const { fallback = <LoadingSpinner />, onError } = options;

  const LazyComponent = lazy(() =>
    importFunc().catch((error) => {
      if (onError) {
        onError(error);
      }
      console.error("Error loading component:", error);

      // Return a fallback component on error
      return {
        default: (() => (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Failed to load component. Please refresh the page.
          </div>
        )) as T,
      };
    })
  );

  return LazyComponent;
}

/**
 * Wrapper component for lazy loaded components with Suspense
 */
export const LazyLoadWrapper = ({
  children,
  fallback = <LoadingSpinner />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

/**
 * Preload a lazy component
 * Useful for prefetching components on hover or route anticipation
 */
export const preloadComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  importFunc().catch((error) => {
    console.error("Error preloading component:", error);
  });
};

/**
 * Hook to preload component on hover
 * Usage: const handleHover = usePreloadOnHover(() => import('./HeavyComponent'))
 */
export const usePreloadOnHover = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  let preloaded = false;

  return () => {
    if (!preloaded) {
      preloadComponent(importFunc);
      preloaded = true;
    }
  };
};

/**
 * Lazy load with retry logic
 * Retries failed imports up to 3 times
 */
export function lazyLoadWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3
): LazyExoticComponent<T> {
  return lazy(() => {
    const retry = async (n: number): Promise<{ default: T }> => {
      try {
        return await importFunc();
      } catch (error) {
        if (n === 1) {
          throw error;
        }
        console.warn(`Failed to load component, retrying... (${retries - n + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
        return retry(n - 1);
      }
    };

    return retry(retries);
  });
}
