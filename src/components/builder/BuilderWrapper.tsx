'use client';

import { useEffect } from 'react';
import '@/lib/builder-init'; // Initialize component registration

/**
 * Wrapper component that ensures Builder.io components are registered
 * Include this in pages that use Builder.io
 */
export function BuilderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Components are registered via the import above
    // This effect ensures registration happens on mount
  }, []);

  return <>{children}</>;
}

