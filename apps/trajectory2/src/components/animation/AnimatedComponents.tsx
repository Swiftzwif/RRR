'use client';

import dynamic from 'next/dynamic';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Lazy-loaded wrapper components for framer-motion
 *
 * This module provides performance-optimized alternatives to direct framer-motion imports.
 * By lazy-loading the motion components, we reduce the initial bundle size significantly.
 *
 * CRITICAL: Do NOT import types from framer-motion here - it will bundle the entire library!
 * Instead, we define compatible prop types that match framer-motion's API.
 *
 * Usage:
 * - Replace: import { motion } from 'framer-motion'; <motion.div />
 * - With: import { AnimatedDiv } from '@/components/animation/AnimatedComponents'; <AnimatedDiv />
 */

// Define animation prop types without importing from framer-motion
interface AnimationProps {
  initial?: Record<string, unknown> | boolean;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
  viewport?: Record<string, unknown>;
  layout?: boolean | 'position' | 'size';
  layoutId?: string;
  drag?: boolean | 'x' | 'y';
  dragConstraints?: Record<string, unknown>;
  onAnimationComplete?: () => void;
  style?: Record<string, unknown>;
}

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

// Export wrapper components with proper typing
// Omit React's event handlers that conflict with framer-motion's API
type OmittedReactEvents = 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd';

type AnimatedDivProps = Omit<ComponentPropsWithoutRef<'div'>, OmittedReactEvents> & AnimationProps;
type AnimatedSectionProps = Omit<ComponentPropsWithoutRef<'section'>, OmittedReactEvents> & AnimationProps;
type AnimatedButtonProps = Omit<ComponentPropsWithoutRef<'button'>, OmittedReactEvents> & AnimationProps;
type AnimatedH1Props = Omit<ComponentPropsWithoutRef<'h1'>, OmittedReactEvents> & AnimationProps;
type AnimatedH2Props = Omit<ComponentPropsWithoutRef<'h2'>, OmittedReactEvents> & AnimationProps;
type AnimatedSpanProps = Omit<ComponentPropsWithoutRef<'span'>, OmittedReactEvents> & AnimationProps;
type AnimatedPProps = Omit<ComponentPropsWithoutRef<'p'>, OmittedReactEvents> & AnimationProps;
type AnimatedUlProps = Omit<ComponentPropsWithoutRef<'ul'>, OmittedReactEvents> & AnimationProps;
type AnimatedLiProps = Omit<ComponentPropsWithoutRef<'li'>, OmittedReactEvents> & AnimationProps;
type AnimatedSvgProps = Omit<ComponentPropsWithoutRef<'svg'>, OmittedReactEvents> & AnimationProps;
type AnimatedPathProps = Omit<ComponentPropsWithoutRef<'path'>, OmittedReactEvents> & AnimationProps;
type AnimatedCircleProps = Omit<ComponentPropsWithoutRef<'circle'>, OmittedReactEvents> & AnimationProps;
type AnimatedImgProps = Omit<ComponentPropsWithoutRef<'img'>, OmittedReactEvents> & AnimationProps;
type AnimatedAProps = Omit<ComponentPropsWithoutRef<'a'>, OmittedReactEvents> & AnimationProps;
type AnimatedFormProps = Omit<ComponentPropsWithoutRef<'form'>, OmittedReactEvents> & AnimationProps;

export function AnimatedDiv(props: AnimatedDivProps) {
  return <MotionDiv {...props} />;
}

export function AnimatedSection(props: AnimatedSectionProps) {
  return <MotionSection {...props} />;
}

export function AnimatedButton(props: AnimatedButtonProps) {
  return <MotionButton {...props} />;
}

export function AnimatedH1(props: AnimatedH1Props) {
  return <MotionH1 {...props} />;
}

export function AnimatedH2(props: AnimatedH2Props) {
  return <MotionH2 {...props} />;
}

export function AnimatedSpan(props: AnimatedSpanProps) {
  return <MotionSpan {...props} />;
}

export function AnimatedP(props: AnimatedPProps) {
  return <MotionP {...props} />;
}

export function AnimatedUl(props: AnimatedUlProps) {
  return <MotionUl {...props} />;
}

export function AnimatedLi(props: AnimatedLiProps) {
  return <MotionLi {...props} />;
}

export function AnimatedSvg(props: AnimatedSvgProps) {
  return <MotionSvg {...props} />;
}

export function AnimatedPath(props: AnimatedPathProps) {
  return <MotionPath {...props} />;
}

export function AnimatedCircle(props: AnimatedCircleProps) {
  return <MotionCircle {...props} />;
}

export function AnimatedImg(props: AnimatedImgProps) {
  return <MotionImg {...props} />;
}

export function AnimatedA(props: AnimatedAProps) {
  return <MotionA {...props} />;
}

export function AnimatedForm(props: AnimatedFormProps) {
  return <MotionForm {...props} />;
}

// Lazy load AnimatePresence separately
export const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false } // AnimatePresence should not SSR
);
