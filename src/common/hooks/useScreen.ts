'use client';
import { useEffect, useState } from 'react';

const breakpoints = { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, _2xl: 1536 };

export const useScreen = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    xs: width >= breakpoints.xs,
    sm: width >= breakpoints.sm,
    md: width >= breakpoints.md,
    lg: width >= breakpoints.lg,
    xl: width >= breakpoints.xl,
    _2xl: width >= breakpoints._2xl,
    width,
  };
};
