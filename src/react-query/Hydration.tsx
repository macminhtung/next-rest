'use client';

import { HydrationBoundary, HydrationBoundaryProps } from '@tanstack/react-query';

export const Hydration = ({ state, children }: HydrationBoundaryProps) => {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
};
