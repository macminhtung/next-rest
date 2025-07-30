'use client';

import { HydrationBoundary, HydrationBoundaryProps } from '@tanstack/react-query';

export const HydrateClient = ({ state, children }: HydrationBoundaryProps) => {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
};
