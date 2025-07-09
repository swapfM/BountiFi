"use client";

import { useEffect, useRef } from "react";

export default function FuturisticBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 0.02;
      const yPercent = (clientY / innerHeight - 0.5) * 0.02;

      const gradientOverlay = container.querySelector(
        ".gradient-overlay"
      ) as HTMLElement;
      const grid = container.querySelector(".geometric-grid") as HTMLElement;

      if (gradientOverlay) {
        gradientOverlay.style.transform = `translate(${xPercent * 20}px, ${
          yPercent * 20
        }px)`;
      }

      if (grid) {
        grid.style.transform = `translate(${xPercent * 10}px, ${
          yPercent * 10
        }px)`;
      }
    };

    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="futuristic-bg" ref={containerRef}>
      <div className="gradient-overlay"></div>
      <div className="geometric-grid"></div>
      <div className="floating-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <div className="connection-lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </div>
  );
}
