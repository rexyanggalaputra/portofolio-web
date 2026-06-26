"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Download, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import type { Profile, SocialLink } from "@/lib/types";
import HeroBackground from "@/components/hero/HeroBackground";

const FuturisticRobotScene = dynamic(() => import("@/components/hero/FuturisticRobotScene"), {
  ssr: false,
  loading: () => <RobotSceneLoader />,
});

const iconMap: Record<SocialLink["kind"], React.ComponentType<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  linkedin: Linkedin,
  email: Mail,
  github: Github,
};

export default function HeroSection({ profile, socials }: { profile: Profile; socials: SocialLink[] }) {
  return (
    <section className="hero-section relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-cyan-300/10">
      <HeroBackground />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="hero-copy relative z-10">
          <p className="hero-reveal hero-reveal-1 mb-5 inline-flex rounded-full border border-violet-400/35 bg-violet-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100 backdrop-blur-xl">
            Profile &amp; Portfolio
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="hero-reveal hero-reveal-2 block">Hi, I&apos;m <span className="hero-name-gradient">{profile.fullName.split(" ")[0]}</span></span>
            <span className="hero-reveal hero-reveal-3 block">I Build Data Solutions</span>
            <span className="hero-reveal hero-reveal-4 block text-slate-200">that Drive Decisions.</span>
          </h1>
          <p className="hero-reveal hero-reveal-5 mt-6 max-w-xl text-base leading-8 text-slate-300">{profile.tagline}</p>
          <div className="hero-reveal hero-reveal-6 mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 px-6 text-sm font-semibold text-white shadow-glow">
              Explore My Work <ExternalLink className="size-4" />
            </a>
            <a href="/api/cv" target="_blank" rel="noreferrer" className="glass-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white">
              Download CV <Download className="size-4" />
            </a>
          </div>
          <div className="hero-reveal hero-reveal-7 mt-7 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-300">Connect with me</span>
            {socials.map((social) => {
              const Icon = iconMap[social.kind];
              return (
                <a key={social.label} aria-label={social.label} href={social.href} className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/5 text-slate-200 transition hover:border-violet-300/70 hover:text-white">
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="hero-visual-enter relative z-[2] min-h-[420px] sm:min-h-[520px] lg:min-h-[610px]">
          <div className="robot-stage absolute inset-0 overflow-hidden rounded-[2rem] border border-cyan-300/10">
            <Suspense fallback={<RobotSceneLoader />}>
              <FuturisticRobotScene />
            </Suspense>
          </div>
          <div className="floating-data-card floating-data-card-a"><span className="data-card-icon">AI</span><span><strong>+38.4%</strong><small>Insight velocity</small></span></div>
          <div className="floating-data-card floating-data-card-b"><span className="data-pulse" /><span><strong>LIVE DATA</strong><small>Pipeline healthy</small></span></div>
          <div className="floating-data-card floating-data-card-c"><span className="mini-bars"><i /><i /><i /><i /></span><span><strong>24.8K</strong><small>Records analyzed</small></span></div>
        </div>
      </div>
    </section>
  );
}

function RobotSceneLoader() {
  return (
    <div className="robot-scene-loader" aria-label="Loading interactive 3D robot">
      <span className="robot-loader-core" />
      <span>Initializing AI data core...</span>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path fill="currentColor" d="M16.02 3.2A12.36 12.36 0 0 0 5.47 22.02L4.1 28.35l6.48-1.34A12.36 12.36 0 1 0 16.02 3.2Zm0 2.3a10.06 10.06 0 0 1 8.56 15.34 10.06 10.06 0 0 1-13.72 3.58l-.38-.23-3.54.74.76-3.45-.25-.4A10.06 10.06 0 0 1 16.02 5.5Z" />
      <path fill="currentColor" d="M12.18 10.1c-.23 0-.6.08-.92.44-.32.35-1.22 1.18-1.22 2.88 0 1.7 1.25 3.36 1.42 3.58.17.23 2.42 3.86 6.03 5.25 2.99 1.16 3.61.93 4.26.87.65-.06 2.1-.86 2.4-1.7.3-.83.3-1.55.21-1.7-.09-.15-.33-.24-.69-.42-.36-.18-2.12-1.05-2.45-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.89-1.79-1.07-.95-1.79-2.12-2-2.48-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.96-1.11-2.68-.29-.7-.59-.6-.81-.61l-.69-.02Z" />
    </svg>
  );
}
