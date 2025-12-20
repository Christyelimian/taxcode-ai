'use client';

import { useEffect } from 'react';

/**
 * Global error handler component to catch and suppress MutationObserver errors
 * from third-party scripts (like Puter SDK) that may try to observe elements
 * before they're ready in the DOM.
 */
export function ErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Suppress MutationObserver errors from Puter SDK or other third-party scripts
      if (
        event.message?.includes('MutationObserver') ||
        event.message?.includes('observe') ||
        event.error?.message?.includes('MutationObserver') ||
        event.error?.message?.includes('observe')
      ) {
        // Silently suppress these errors - they're non-critical
        event.preventDefault();
        return false;
      }
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress MutationObserver-related promise rejections
      const reason = event.reason;
      if (
        reason?.message?.includes('MutationObserver') ||
        reason?.message?.includes('observe') ||
        String(reason)?.includes('MutationObserver')
      ) {
        event.preventDefault();
        return false;
      }
      return true;
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}

