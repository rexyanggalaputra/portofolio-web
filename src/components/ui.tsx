"use client";

import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  eyebrow,
  children,
  className,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24", className)}>
      <div className="mb-10 max-w-3xl">
        {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-sky-300"
          : "border border-border bg-white/5 text-foreground hover:border-primary/70 hover:bg-primary/10",
      )}
    >
      {children}
    </a>
  );
}

export function Card({ children, className, interactive = true }: { children: React.ReactNode; className?: string; interactive?: boolean }) {
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--card-rotate-x", `${(0.5 - y) * 5}deg`);
    event.currentTarget.style.setProperty("--card-rotate-y", `${(x - 0.5) * 7}deg`);
    event.currentTarget.style.setProperty("--card-glow-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--card-glow-y", `${y * 100}%`);
  }

  function resetTilt(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--card-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--card-rotate-y", "0deg");
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className={cn("motion-card premium-card rounded-xl border border-violet-400/15 bg-[#0b1024]/78 shadow-glow backdrop-blur", className)}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-200">{children}</label>;
}

export const inputClass =
  "mt-2 min-h-11 w-full rounded-md border border-border bg-white/5 px-3 text-sm text-foreground outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/25";
