'use client';

import { HydrationBoundary, HydrationBoundaryProps } from '@tanstack/react-query';

export const HydrateClient = (props: HydrationBoundaryProps) => <HydrationBoundary {...props} />;
