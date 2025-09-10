"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; size: number; speed: number };

export default function Starfield({ density = 100, speed = 0.4 }: { density?: number; speed?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize stars
    const initStars = () => {
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), density);
      starsRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1 + 0.2,
        size: Math.random() * 1.7 + 0.3,
        speed: (Math.random() * 0.6 + 0.2) * speed,
      }));
    };
    initStars();

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67; // clamp dt
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // fully transparent; let page background show

      for (const s of starsRef.current) {
        s.x += s.speed * s.z * dt;
        if (s.x > canvas.width + 2) s.x = -2;

        ctx.beginPath();
        const alpha = 0.15 + s.z * 0.15;
        ctx.fillStyle = `rgba(17,17,17,${alpha})`;
        ctx.arc(s.x, s.y, s.size * s.z, 0, Math.PI * 2);
        ctx.fill();

        // trailing glow
        ctx.beginPath();
        const trail = s.size * 4 * s.z;
        const grad = ctx.createLinearGradient(s.x - trail, s.y, s.x, s.y);
        grad.addColorStop(0, "rgba(17,17,17, 0.0)");
        grad.addColorStop(1, "rgba(17,17,17, 0.15)");
        ctx.strokeStyle = grad;
        ctx.moveTo(s.x - trail, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 star-mask"
      aria-hidden
    />
  );
}
