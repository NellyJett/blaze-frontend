import { useEffect, useRef, useCallback } from 'react';

interface UsePollOptions {
  interval: number;
  enabled?: boolean;
}

export function usePoll(callback: () => void, options: UsePollOptions) {
  const { interval, enabled = true } = options;
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Execute immediately
    savedCallback.current();

    // Then set up interval
    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, enabled]);

  // Manual refresh function
  const refresh = useCallback(() => {
    savedCallback.current();
  }, []);

  return { refresh };
}
