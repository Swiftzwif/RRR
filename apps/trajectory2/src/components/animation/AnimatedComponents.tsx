'use client';

import dynamic from 'next/dynamic';
import type { ComponentPropsWithoutRef } from 'react';
// Type-only import: Does NOT bundle any runtime code, only provides TypeScript types
import type { HTMLMotionProps } from 'framer-motion';

/**
 * Lazy-loaded wrapper components for framer-motion
 *
 * This module provides performance-optimized alternatives to direct framer-motion imports.
 * By lazy-loading the motion components, we reduce the initial bundle size significantly.
 *
 * IMPORTANT: We use `import type` which does NOT bundle any runtime code.
 * The actual motion components are loaded dynamically at runtime only when used.
 *
 * Usage:
 * - Replace: import { motion } from 'framer-motion'; <motion.div />
 * - With: import { AnimatedDiv } from '@/components/animation/AnimatedComponents'; <AnimatedDiv />
 */

// Lazy load framer-motion components with proper SSR support
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: true }
);

const MotionSection = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.section),
  { ssr: true }
);

const MotionButton = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.button),
  { ssr: true }
);

const MotionH1 = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.h1),
  { ssr: true }
);

const MotionH2 = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.h2),
  { ssr: true }
);

const MotionSpan = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.span),
  { ssr: true }
);

const MotionP = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.p),
  { ssr: true }
);

const MotionUl = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.ul),
  { ssr: true }
);

const MotionLi = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.li),
  { ssr: true }
);

const MotionSvg = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.svg),
  { ssr: true }
);

const MotionPath = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.path),
  { ssr: true }
);

const MotionCircle = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.circle),
  { ssr: true }
);

const MotionImg = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.img),
  { ssr: true }
);

const MotionA = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.a),
  { ssr: true }
);

const MotionForm = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.form),
  { ssr: true }
);

// Export wrapper components with proper typing from framer-motion
// Use HTMLMotionProps which includes all framer-motion animation props
export function AnimatedDiv(props: HTMLMotionProps<'div'>) {
  return <MotionDiv {...props} />;
}

export function AnimatedSection(props: HTMLMotionProps<'section'>) {
  return <MotionSection {...props} />;
}

export function AnimatedButton(props: HTMLMotionProps<'button'>) {
  return <MotionButton {...props} />;
}

export function AnimatedH1(props: HTMLMotionProps<'h1'>) {
  return <MotionH1 {...props} />;
}

export function AnimatedH2(props: HTMLMotionProps<'h2'>) {
  return <MotionH2 {...props} />;
}

export function AnimatedSpan(props: HTMLMotionProps<'span'>) {
  return <MotionSpan {...props} />;
}

export function AnimatedP(props: HTMLMotionProps<'p'>) {
  return <MotionP {...props} />;
}

export function AnimatedUl(props: HTMLMotionProps<'ul'>) {
  return <MotionUl {...props} />;
}

export function AnimatedLi(props: HTMLMotionProps<'li'>) {
  return <MotionLi {...props} />;
}

export function AnimatedSvg(props: HTMLMotionProps<'svg'>) {
  return <MotionSvg {...props} />;
}

export function AnimatedPath(props: HTMLMotionProps<'path'>) {
  return <MotionPath {...props} />;
}

export function AnimatedCircle(props: HTMLMotionProps<'circle'>) {
  return <MotionCircle {...props} />;
}

export function AnimatedImg(props: HTMLMotionProps<'img'>) {
  return <MotionImg {...props} />;
}

export function AnimatedA(props: HTMLMotionProps<'a'>) {
  return <MotionA {...props} />;
}

export function AnimatedForm(props: HTMLMotionProps<'form'>) {
  return <MotionForm {...props} />;
}

// Lazy load AnimatePresence separately
export const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false } // AnimatePresence should not SSR
);
