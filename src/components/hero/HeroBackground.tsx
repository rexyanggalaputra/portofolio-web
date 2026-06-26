"use client";

import HeroNebulaBackground from "@/components/hero-nebula-background";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <HeroNebulaBackground className="hero-scene-background" density="full" />
      <div className="hero-starfield absolute inset-0" />
      <div className="hero-grid-pattern absolute inset-0" />
      <div className="hero-data-stream hero-data-stream-a" />
      <div className="hero-data-stream hero-data-stream-b" />
      <div className="hero-aurora hero-aurora-one" />
      <div className="hero-aurora hero-aurora-two" />
    </div>
  );
}
