/**
 * Performance monitoring utilities for tracking and measuring app performance
 */

import { useEffect, useRef } from "react";

/**
 * Measure and log component render time
 * Usage: const renderTime = useRenderTime('MyComponent');
 */
export const useRenderTime = (componentName: string, enabled = process.env.NODE_ENV === "development") => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    const endTime = performance.now();
    const duration = endTime - startTime.current;
    renderCount.current += 1;

    console.log(
      `[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms (render #${renderCount.current})`
    );

    // Reset start time for next render
    startTime.current = performance.now();
  });

  return (duration: number) => {
    if (enabled) {
      console.log(`[Performance] ${componentName} operation took ${duration.toFixed(2)}ms`);
    }
  };
};

/**
 * Monitor Web Vitals (LCP, FID, CLS, FCP, TTFB)
 * These are core metrics for measuring user experience
 */
export const reportWebVitals = (metric: any) => {
  const { name, value, id } = metric;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      id,
    });
  }

  // Send to analytics in production
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, {
      event_category: "Web Vitals",
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }
};

/**
 * Performance marker utility for measuring custom operations
 */
export class PerformanceMarker {
  private markers: Map<string, number> = new Map();
  private enabled: boolean;

  constructor(enabled = process.env.NODE_ENV === "development") {
    this.enabled = enabled;
  }

  /**
   * Start measuring an operation
   */
  start(name: string) {
    if (!this.enabled) return;
    this.markers.set(name, performance.now());
  }

  /**
   * End measuring and log the duration
   */
  end(name: string): number {
    if (!this.enabled) return 0;

    const startTime = this.markers.get(name);
    if (!startTime) {
      console.warn(`[Performance] No start marker found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    this.markers.delete(name);

    return duration;
  }

  /**
   * Measure an async operation
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Clear all markers
   */
  clear() {
    this.markers.clear();
  }
}

/**
 * Global performance marker instance
 */
export const performanceMarker = new PerformanceMarker();

/**
 * Hook to measure component mount/unmount time
 */
export const useComponentLifecycle = (componentName: string, enabled = process.env.NODE_ENV === "development") => {
  useEffect(() => {
    if (!enabled) return;

    const mountTime = performance.now();
    console.log(`[Lifecycle] ${componentName} mounted`);

    return () => {
      const unmountTime = performance.now();
      const lifetime = unmountTime - mountTime;
      console.log(`[Lifecycle] ${componentName} unmounted after ${lifetime.toFixed(2)}ms`);
    };
  }, [componentName, enabled]);
};

/**
 * Measure and report long tasks (> 50ms)
 * Long tasks can cause jank and poor user experience
 */
export const observeLongTasks = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`, entry);

          // Send to analytics if available
          if (window.gtag) {
            window.gtag("event", "long_task", {
              event_category: "Performance",
              value: Math.round(entry.duration),
              non_interaction: true,
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ["longtask"] });

    return () => observer.disconnect();
  } catch (e) {
    console.warn("[Performance] Long task observation not supported");
  }
};

/**
 * Memory usage monitoring (Chrome only)
 */
export const getMemoryUsage = () => {
  if (typeof window === "undefined") return null;

  const performance = window.performance as any;

  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      usedPercentage: (
        (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) *
        100
      ).toFixed(2),
    };
  }

  return null;
};

/**
 * Hook to monitor memory usage (development only)
 */
export const useMemoryMonitor = (interval = 10000) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const intervalId = setInterval(() => {
      const memory = getMemoryUsage();
      if (memory) {
        console.log(`[Memory] Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB (${memory.usedPercentage}%)`);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);
};

// Extend Window type for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
