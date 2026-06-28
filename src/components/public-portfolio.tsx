"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ChartColumnBig,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  FileSpreadsheet,
  ExternalLink,
  GraduationCap,
  Globe,
  Github,
  Gauge,
  GitBranch,
  LayoutDashboard,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Network,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sigma,
  Snowflake,
  Table2,
  X,
} from "lucide-react";
import type { ClientImpression, Experience, Faq, PortfolioData, Profile, Project, Skill } from "@/lib/types";
import HeroSection from "@/components/hero/HeroSection";
import { cn, formatDuration, initials } from "@/lib/utils";
import { Card, FieldLabel, inputClass } from "@/components/ui";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const services = [
  { title: "BI Dashboards", copy: "Interactive dashboards for monitoring business performance.", icon: LayoutDashboard, color: "text-violet-300" },
  { title: "Data Pipeline", copy: "Automated reporting flows that reduce manual work.", icon: GitBranch, color: "text-sky-300" },
  { title: "Data Analysis", copy: "Actionable insights from complex operational data.", icon: ChartColumnBig, color: "text-emerald-300" },
  { title: "Reporting Automation", copy: "Reliable recurring reports for faster decisions.", icon: FileSpreadsheet, color: "text-amber-300" },
  { title: "Web Development", copy: "Functional web apps and portfolio experiences built for real users.", icon: Globe, color: "text-cyan-300" },
  { title: "Teaching & Mentoring", copy: "Practical guidance for learners and teams growing in data and tech.", icon: GraduationCap, color: "text-rose-300" },
];

export default function PublicPortfolio({ data }: { data: PortfolioData }) {
  const { profile, socials, skills, projects, impressions, experiences, faqs } = data;

  useSectionReveal();

  return (
    <main id="home" className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection profile={profile} socials={socials} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Services />
      <Testimonials impressions={impressions} />
      <Experience experiences={experiences} />
      <Faq faqs={faqs} />
      <Contact profile={profile} />
      <Footer profile={profile} />
      <SessionTimer />
    </main>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const targets = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -68% 0px", threshold: [0, 0.2, 0.5] },
    );
    targets.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#050917]/88 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3 font-semibold">
          <span className="grid size-9 place-items-center rounded-lg border border-violet-400/50 bg-violet-500/15 text-violet-200">
            <ShieldCheck className="size-5" />
          </span>
          <span>RexyPort</span>
        </a>
        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={cn("nav-link rounded-md px-3 py-2 text-sm text-slate-300 transition hover:text-white", activeSection === item.href.slice(1) && "nav-link-active text-white")}>
              {item.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="hidden min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-5 text-sm font-semibold text-white shadow-glow lg:inline-flex">
          Hire Me <Rocket className="size-4" />
        </a>
        <button type="button" aria-label="Open navigation" onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-md border border-border bg-white/5 lg:hidden">
          <Menu className="size-5" />
        </button>
      </nav>
      {open ? (
        <div className="fixed inset-0 z-50 bg-[#020617]/90 p-3 backdrop-blur-md lg:hidden" onClick={() => setOpen(false)}>
          <div className="ml-auto flex max-h-[calc(100svh-1.5rem)] w-[min(20rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#071225] shadow-[0_24px_80px_rgba(0,0,0,0.55)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <a href="#home" onClick={() => setOpen(false)} className="flex items-center gap-2 font-semibold">
                <span className="grid size-8 place-items-center rounded-lg border border-violet-400/50 bg-violet-500/20 text-violet-100">
                  <ShieldCheck className="size-4" />
                </span>
                <span>RexyPort</span>
              </a>
              <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-lg border border-white/15 bg-white/7 text-slate-100">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-1.5 overflow-y-auto p-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-sm font-semibold transition",
                    activeSection === item.href.slice(1)
                      ? "border-cyan-300/35 bg-cyan-400/12 text-white"
                      : "border-white/8 bg-white/[0.03] text-slate-300 hover:border-violet-300/40 hover:bg-white/7 hover:text-white",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a href="#contact" onClick={() => setOpen(false)} className="m-3 mt-0 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 px-4 text-sm font-semibold text-white shadow-glow">
              Hire Me <Rocket className="size-4" />
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function useSectionReveal() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]:not(#home)"));
    sections.forEach((section) => section.classList.add("section-reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="grid gap-8 p-6 md:grid-cols-[220px_1fr_0.85fr] md:items-center">
        <div className="mx-auto grid size-44 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 p-2 md:mx-0">
          <div className="relative size-40 overflow-hidden rounded-full border border-white/20 bg-[#111936]">
            <Image
              src={profile.photoUrl ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"}
              alt="Small profile portrait"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold">
            About <span className="text-violet-300">Me</span>
          </h2>
          <p className="mt-4 leading-7 text-slate-300">{profile.bio}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["4+", "Years Experience"],
              ["30+", "Projects Completed"],
              ["20+", "Dashboards & Reports"],
            ].map(([value, label]) => (
              <div key={label} className="min-h-20 rounded-md border border-violet-400/20 bg-white/5 p-3 sm:p-4">
                <p className="text-xl font-bold leading-tight sm:text-2xl">{value}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-400 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <dl className="grid gap-4 text-sm">
          {[
            ["Name:", profile.fullName],
            ["Role:", profile.headline],
            ["Experience:", "4+ Years"],
            ["Location:", profile.location],
            ["Email:", profile.email],
            ["Availability:", "Available for Hire"],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[110px_1fr] gap-3">
              <dt className="font-semibold text-white">{label}</dt>
              <dd className={label === "Availability:" ? "text-emerald-300" : "text-slate-300"}>{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </section>
  );
}

function Skills({ skills }: { skills: Skill[] }) {
  const initialCount = useSkillInitialCount();
  const [expanded, setExpanded] = useState(false);
  const visibleSkills = expanded ? skills : skills.slice(0, initialCount);

  return (
    <section id="skills" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle title="My Skills" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {visibleSkills.map((skill) => (
          <Card key={skill.id} className="grid min-h-28 place-items-center p-4 text-center transition hover:-translate-y-1 hover:border-violet-300/60">
            <div>
              <div className="mx-auto mb-3 grid size-11 place-items-center rounded-md bg-gradient-to-br from-violet-500/25 to-sky-500/20 text-primary">
                <SkillIcon skill={skill} className="size-6" />
              </div>
              <p className="text-sm font-semibold">{skill.name}</p>
            </div>
          </Card>
        ))}
      </div>
      {skills.length > initialCount ? (
        <ViewToggle expanded={expanded} onClick={() => setExpanded((value) => !value)} moreLabel="View More Skills" />
      ) : null}
    </section>
  );
}

function SkillIcon({ skill, className }: { skill: Skill; className?: string }) {
  const normalized = skill.name.toLowerCase();

  if (normalized.includes("python")) return <PythonIcon className={className} />;
  if (normalized === "sql") return <SqlIcon className={className} />;
  if (normalized.includes("looker")) return <LookerIcon className={className} />;
  if (normalized.includes("microstrategy")) return <MicroStrategyIcon className={className} />;
  if (normalized.includes("tableau")) return <TableauIcon className={className} />;
  if (normalized.includes("metabase")) return <Gauge className={className} />;
  if (normalized.includes("google sheets")) return <SheetsIcon className={className} />;
  if (normalized.includes("excel")) return <ExcelIcon className={className} />;
  if (normalized.includes("snowflake")) return <Snowflake className={className} />;
  if (normalized.includes("greenplum")) return <Network className={className} />;
  if (normalized.includes("postgres")) return <PostgresIcon className={className} />;
  if (normalized.includes("dashboard")) return <LayoutDashboard className={className} />;
  if (normalized.includes("reporting")) return <FileSpreadsheet className={className} />;
  if (normalized.includes("pipeline")) return <GitBranch className={className} />;
  if (normalized.includes("business")) return <ChartColumnBig className={className} />;
  if (normalized.includes("scraping")) return <Code2 className={className} />;
  if (normalized.includes("statistics")) return <Sigma className={className} />;
  if (normalized.includes("wrangling")) return <Table2 className={className} />;

  return skill.category.toLowerCase().includes("database") ? <Database className={className} /> : <Code2 className={className} />;
}

function useSkillInitialCount() {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setCount(10);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setCount(6);
      } else {
        setCount(4);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function useCarouselVisibleCount(desktopCount: number) {
  const [count, setCount] = useState(desktopCount);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setCount(desktopCount);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setCount(Math.min(2, desktopCount));
      } else {
        setCount(1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desktopCount]);

  return count;
}

function Projects({ projects }: { projects: Project[] }) {
  const [count, setCount] = useState(4);
  const [activeCategory, setActiveCategory] = useState("All");
  const projectCategories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];
  const filteredProjects = activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory);
  const visible = filteredProjects.slice(0, count);
  const expanded = count >= filteredProjects.length;

  useEffect(() => {
    setCount(4);
  }, [activeCategory]);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="text-3xl font-bold">
          Featured <span className="text-violet-300">Projects</span>
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition",
                activeCategory === category
                  ? "border-violet-300/70 bg-violet-500/25 text-white shadow-glow"
                  : "border-violet-300/25 bg-white/5 text-slate-300 hover:border-violet-300/60 hover:text-white",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {visible.length ? visible.map((project) => (
          <Card key={project.id} className="overflow-hidden transition hover:-translate-y-1 hover:border-violet-300/60">
            <div className="relative aspect-[16/10] xl:aspect-[16/9]">
              <Image src={project.imageUrl} alt={`${project.title} project preview`} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-4 xl:p-3.5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">{project.category}</p>
              <h3 className="font-semibold xl:text-sm">{project.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400 xl:min-h-0 xl:text-xs xl:leading-5">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 xl:mt-3">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-violet-200">{tag}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3 xl:mt-4 xl:gap-2">
                {project.portfolioUrl ? (
                  <a
                    href={project.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-violet-300/35 bg-violet-500/10 px-4 text-sm font-semibold text-white transition hover:border-violet-300/70 hover:bg-violet-500/20 xl:min-h-9 xl:px-3 xl:text-xs"
                  >
                    View Demo <ExternalLink className="size-4" />
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:border-sky-300/70 xl:min-h-9 xl:px-3 xl:text-xs"
                  >
                    View Github <Github className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </Card>
        )) : (
          <Card className="p-6 md:col-span-2 xl:col-span-4">
            <p className="text-sm leading-7 text-slate-300">No project has been added to this category yet.</p>
          </Card>
        )}
      </div>
      {filteredProjects.length > 4 ? (
        <ViewToggle expanded={expanded} onClick={() => setCount(expanded ? 4 : filteredProjects.length)} moreLabel="View More Projects" />
      ) : null}
    </section>
  );
}

function Services() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const visibleCount = useCarouselVisibleCount(4);
  const visible = getLoopItems(services, active, visibleCount);

  function move(nextDirection: "next" | "prev") {
    setDirection(nextDirection);
    setActive((value) => loopIndex(value + (nextDirection === "next" ? 1 : -1), services.length));
  }

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle title="My Services" />
      <CarouselFrame
        label="services"
        activeKey={active}
        direction={direction}
        columnsClass="sm:grid-cols-2 lg:grid-cols-4"
        onPrevious={() => move("prev")}
        onNext={() => move("next")}
      >
        {visible.map((service, index) => {
          const Icon = service.item.icon;
          return (
            <Card key={`${service.item.title}-${service.realIndex}-${index}`} className="flex min-h-32 items-center gap-4 p-5">
              <span className={cn("grid size-14 shrink-0 place-items-center rounded-full bg-white/7", service.item.color)}>
                <Icon className="size-8" />
              </span>
              <div>
                <h3 className="font-semibold">{service.item.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-400">{service.item.copy}</p>
              </div>
            </Card>
          );
        })}
      </CarouselFrame>
    </section>
  );
}

function Testimonials({ impressions }: { impressions: ClientImpression[] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const visibleCount = useCarouselVisibleCount(Math.min(3, Math.max(impressions.length, 1)));
  const visible = impressions.length ? getLoopItems(impressions, active, visibleCount) : [];

  function move(nextDirection: "next" | "prev") {
    setDirection(nextDirection);
    setActive((value) => loopIndex(value + (nextDirection === "next" ? 1 : -1), Math.max(impressions.length, 1)));
  }

  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle title="What Clients Say" />
      {visible.length ? (
        <CarouselFrame
          label="testimonials"
          activeKey={active}
          direction={direction}
          columnsClass="sm:grid-cols-2 lg:grid-cols-3"
          onPrevious={() => move("prev")}
          onNext={() => move("next")}
        >
          {visible.map((testimonial, index) => (
            <Card key={`${testimonial.item.displayName}-${testimonial.realIndex}-${index}`} className="p-6">
              <p className="leading-7 text-slate-300">&ldquo;{testimonial.item.impression}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-sky-400 text-sm font-bold text-white">{initials(testimonial.item.displayName)}</span>
                <div>
                  <p className="font-semibold">{testimonial.item.displayName}</p>
                  <p className="text-sm text-slate-400">{testimonial.item.roleDivision}</p>
                </div>
              </div>
            </Card>
          ))}
        </CarouselFrame>
      ) : (
        <Card className="p-6">
          <p className="leading-7 text-slate-300">Positive impressions from visitors will appear here after they submit feedback.</p>
        </Card>
      )}
      <div className="mt-5 flex justify-center">
        <a href="/feedback" className="inline-flex min-h-11 items-center justify-center rounded-full border border-violet-300/35 bg-violet-500/10 px-5 text-sm font-semibold text-white transition hover:border-violet-300/70 hover:bg-violet-500/20">
          Give Your Impression to Rexy
        </a>
      </div>
    </section>
  );
}

function Experience({ experiences }: { experiences: Experience[] }) {
  const [count, setCount] = useState(3);
  const visible = experiences.slice(0, count);

  return (
    <section id="experience" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle title="Experience" />
      <div className="grid gap-4">
        {visible.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">{item.role}</h3>
                <p className="text-sm text-slate-400">{item.company} - {item.location}</p>
                <p className="mt-2 inline-flex w-fit rounded-md border border-border bg-white/5 px-3 py-2 text-sm text-slate-300 md:hidden">{item.period}</p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
              <p className="hidden shrink-0 rounded-md border border-border bg-white/5 px-3 py-2 text-sm text-slate-300 md:block">{item.period}</p>
            </div>
          </Card>
        ))}
      </div>
      {experiences.length > 3 ? (
        count < experiences.length ? (
          <button type="button" onClick={() => setCount((value) => value + 3)} className="mt-5 inline-flex min-h-10 items-center rounded-full border border-violet-300/45 px-5 text-sm font-semibold hover:bg-violet-500/15">
            View More
          </button>
        ) : (
          <button type="button" onClick={() => setCount(3)} className="mt-5 inline-flex min-h-10 items-center rounded-full border border-violet-300/45 px-5 text-sm font-semibold hover:bg-violet-500/15">
            Show Less
          </button>
        )
      ) : null}
    </section>
  );
}

function Faq({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(faqs[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const filtered = faqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(query.toLowerCase()));
  const visibleFaqs = expanded || query ? filtered : filtered.slice(0, 3);

  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle title="FAQ" />
      <div className="relative mb-5 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" className={cn(inputClass, "mt-0 pl-10")} />
      </div>
      <div className="grid gap-3">
        {visibleFaqs.map((item) => {
          const isOpen = open === item.id;
          return (
            <Card key={item.id} className="p-0">
              <button type="button" onClick={() => setOpen(isOpen ? "" : item.id)} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-left font-semibold">
                {item.question}
                <span className="text-violet-300">{isOpen ? "-" : "+"}</span>
              </button>
              <div className={cn("faq-answer-grid", isOpen && "faq-answer-open")}>
                <div>
                  <p className="border-t border-border px-5 py-4 leading-7 text-slate-300">{item.answer}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {!query && filtered.length > 3 ? (
        <ViewToggle expanded={expanded} onClick={() => setExpanded((value) => !value)} moreLabel="View More FAQ" />
      ) : null}
    </section>
  );
}

function Contact({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; content?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const content = String(form.get("content") ?? "").trim();
    const nextErrors = {
      name: name ? undefined : "Name is required.",
      email: email ? undefined : "Email is required.",
      content: content ? undefined : "Message is required.",
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.content) {
      setStatus("");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const minimumDelay = new Promise((resolve) => window.setTimeout(resolve, 700));
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, content }),
      });
      await minimumDelay;

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus(payload?.error ?? "Message could not be sent. Please try again.");
        return;
      }

      formElement.reset();
      setStatus("Message sent successfully. Thank you for reaching out.");
    } catch {
      setStatus("Message could not be sent. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 rounded-lg border border-violet-400/20 bg-gradient-to-r from-violet-600/80 to-sky-600/75 p-6 shadow-glow lg:grid-cols-[1fr_1.2fr] lg:p-8">
        <div>
          <h2 className="text-3xl font-bold">Let&apos;s Work Together</h2>
          <p className="mt-3 text-sky-50/90">I&apos;m always open to discussing new projects and opportunities.</p>
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <ContactFact icon={Mail} label="Email" value={profile.email} />
            <ContactFact icon={Linkedin} label="LinkedIn" value="linkedin.com/in/rexyanggalaputra" />
            <ContactFact icon={MapPin} label="Location" value={profile.location} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-white/15 bg-[#050917]/45 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Name</FieldLabel>
              <input name="name" className={inputClass} placeholder="Your name" />
              {errors.name ? <p className="mt-2 text-sm text-red-200">{errors.name}</p> : null}
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <input name="email" type="email" required className={inputClass} placeholder="you@example.com" />
              {errors.email ? <p className="mt-2 text-sm text-red-200">{errors.email}</p> : null}
            </div>
          </div>
          <div>
            <FieldLabel>Message</FieldLabel>
            <textarea name="content" rows={4} className={cn(inputClass, "py-3")} placeholder="Tell me about your project" />
            {errors.content ? <p className="mt-2 text-sm text-red-200">{errors.content}</p> : null}
          </div>
          <button type="submit" disabled={submitting} className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-[#111936] disabled:cursor-not-allowed disabled:opacity-65">
            {submitting ? "Sending..." : "Get In Touch"} <Send className="size-4" />
          </button>
          {status ? <p className="rounded-md border border-white/20 bg-white/10 p-3 text-sm text-white">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}

function ContactFact({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-7 text-sky-100" />
      <div>
        <p className="font-semibold text-white">{label}</p>
        <p className="text-sky-50/85">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  const [first, ...rest] = title.split(" ");
  return (
    <div className="mb-5 flex items-center justify-center gap-4 text-center">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-violet-400/55" />
      <h2 className="text-3xl font-bold">
        {first} {rest.length ? <span className="text-violet-300">{rest.join(" ")}</span> : null}
      </h2>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-violet-400/55" />
    </div>
  );
}

function ViewToggle({ expanded, onClick, moreLabel }: { expanded: boolean; onClick: () => void; moreLabel: string }) {
  return (
    <button type="button" onClick={onClick} className="mt-5 inline-flex min-h-10 items-center rounded-full border border-violet-300/45 px-5 text-sm font-semibold hover:bg-violet-500/15">
      {expanded ? "Show Less" : moreLabel}
    </button>
  );
}

function CarouselFrame({
  label,
  activeKey,
  direction,
  columnsClass,
  children,
  onPrevious,
  onNext,
}: {
  label: string;
  activeKey: number;
  direction: "next" | "prev";
  columnsClass: string;
  children: React.ReactNode;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Previous ${label}`}
        onClick={onPrevious}
        className="absolute -left-2 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-violet-300/45 bg-[#111936]/90 text-white shadow-glow transition hover:bg-violet-500/25 sm:-left-5"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="overflow-hidden px-10">
        <div key={activeKey} className={cn("carousel-slide grid grid-cols-1 gap-5", direction === "prev" && "carousel-slide-prev", columnsClass)}>{children}</div>
      </div>
      <button
        type="button"
        aria-label={`Next ${label}`}
        onClick={onNext}
        className="absolute -right-2 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-violet-300/45 bg-[#111936]/90 text-white shadow-glow transition hover:bg-violet-500/25 sm:-right-5"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function loopIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getLoopItems<T>(items: T[], start: number, count: number) {
  return Array.from({ length: Math.min(count, items.length) }, (_, offset) => {
    const realIndex = loopIndex(start + offset, items.length);
    return { item: items[realIndex], realIndex };
  });
}

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path fill="#60A5FA" d="M16 3c-5.1 0-6 2.2-6 4.8V11h6.3v1.5H7.8C5.2 12.5 3 14 3 17s2 4.8 4.7 4.8H10v-3.4c0-2.8 2.4-5.1 5.2-5.1h5.6c2.4 0 4.2-2 4.2-4.3V7.8C25 5.2 22.8 3 16 3Z" />
      <path fill="#FACC15" d="M16 29c5.1 0 6-2.2 6-4.8V21h-6.3v-1.5h8.5C26.8 19.5 29 18 29 15s-2-4.8-4.7-4.8H22v3.4c0 2.8-2.4 5.1-5.2 5.1h-5.6C8.8 18.7 7 20.7 7 23v1.2C7 26.8 9.2 29 16 29Z" />
      <circle cx="13" cy="7.8" r="1.1" fill="#E0F2FE" />
      <circle cx="19" cy="24.2" r="1.1" fill="#78350F" />
    </svg>
  );
}

function SqlIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <ellipse cx="16" cy="7.5" rx="10" ry="4.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M6 7.5v9c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5v-9" stroke="currentColor" strokeWidth="2.2" />
      <path d="M6 16.5v8c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5v-8" stroke="currentColor" strokeWidth="2.2" />
      <path d="M10.5 24.5c1.6.7 3.4 1 5.5 1s3.9-.3 5.5-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LookerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <circle cx="11" cy="12" r="5" fill="#38BDF8" />
      <circle cx="21" cy="12" r="5" fill="#A78BFA" />
      <circle cx="16" cy="21" r="5" fill="#34D399" />
      <circle cx="16" cy="15" r="3.5" fill="#F8FAFC" opacity=".9" />
    </svg>
  );
}

function MicroStrategyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path d="M5 24 13 6l4.5 10L22 6l5 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 24h12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function TableauIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      {[
        [16, 6], [10, 11], [22, 11], [16, 16], [8, 20], [24, 20], [16, 26],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d={`M${cx - 3} ${cy}h6`} />
          <path d={`M${cx} ${cy - 3}v6`} />
        </g>
      ))}
    </svg>
  );
}

function SheetsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path d="M8 4h12l5 5v19H8V4Z" fill="#22C55E" />
      <path d="M20 4v5h5" fill="#BBF7D0" />
      <path d="M11 14h10M11 18h10M11 22h10M15 12v12" stroke="#ECFDF5" strokeWidth="1.6" />
    </svg>
  );
}

function ExcelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path d="M5 7.5 18 5v22L5 24.5v-17Z" fill="#16A34A" />
      <path d="M18 8h9v16h-9" fill="#22C55E" />
      <path d="m9.5 12 5 8M14.5 12l-5 8" stroke="#F0FDF4" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20.5 12h4M20.5 16h4M20.5 20h4" stroke="#DCFCE7" strokeWidth="1.5" />
    </svg>
  );
}

function PostgresIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path d="M16 3C10 3 5.5 7.2 5.5 13.8c0 4.1 1.6 7.8 4.2 10.1 1.2 1 2.3.4 2.2-1.2-.1-1.1 0-2.3.5-3 1 .3 2.2.5 3.6.5 5.9 0 10.5-3.9 10.5-9.1C26.5 6.3 22 3 16 3Z" fill="#38BDF8" opacity=".9" />
      <path d="M13 15c1.5 1.1 4.5 1.1 6 0M12 10.5h.1M20 10.5h.1M15.5 18.5c-.8 1.4-1 3.1-.7 5.1" stroke="#082F49" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-white/8 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
        <a href="#home" className="flex items-center gap-3 font-semibold text-white">
          <span className="grid size-8 place-items-center rounded-lg border border-violet-400/50 bg-violet-500/15 text-violet-200">
            <ShieldCheck className="size-4" />
          </span>
          RexyPort
        </a>
        <p>Copyright 2026 {profile.fullName}. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-3">
          {navItems.slice(0, 5).map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">{item.label}</a>
          ))}
          <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid size-10 place-items-center rounded-full border border-violet-300/45 text-white">
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [hidden, setHidden] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const activeMsRef = useRef(0);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    let cancelled = false;

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId,
        path: window.location.pathname + window.location.hash,
        referrer: document.referrer,
      }),
    })
      .then((response) => response.json())
      .then((payload: { sessionId?: string }) => {
        if (!cancelled && payload.sessionId) {
          sessionIdRef.current = payload.sessionId;
        }
      })
      .catch(() => {
        sessionIdRef.current = null;
      });

    const flushDuration = () => {
      if (!sessionIdRef.current) return;
      const payload = JSON.stringify({
        sessionId: sessionIdRef.current,
        durationMs: activeMsRef.current,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/duration", new Blob([payload], { type: "application/json" }));
        return;
      }

      void fetch("/api/analytics/duration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        keepalive: true,
      });
    };

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        activeMsRef.current += 1000;
        setSeconds((value) => value + 1);
      }
    }, 1000);

    const heartbeat = window.setInterval(flushDuration, 15000);
    window.addEventListener("visibilitychange", flushDuration);
    window.addEventListener("pagehide", flushDuration);

    return () => {
      cancelled = true;
      flushDuration();
      window.clearInterval(interval);
      window.clearInterval(heartbeat);
      window.removeEventListener("visibilitychange", flushDuration);
      window.removeEventListener("pagehide", flushDuration);
    };
  }, []);

  if (hidden) {
    return (
      <button
        type="button"
        aria-label="Show session timer"
        onClick={() => setHidden(false)}
        className="fixed bottom-4 right-4 z-30 grid size-12 place-items-center rounded-full border border-violet-400/30 bg-[#111936]/90 text-violet-200 shadow-glow backdrop-blur transition hover:bg-violet-500/20"
      >
        <Rocket className="size-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-violet-400/25 bg-[#111936]/90 px-4 py-3 text-sm shadow-glow backdrop-blur">
      <Rocket className="size-4 shrink-0 text-violet-300" />
      <span className="truncate">Exploring for {formatDuration(seconds)}</span>
      <button type="button" aria-label="Hide session timer" onClick={() => setHidden(true)} className="rounded-full p-1 text-slate-400 hover:text-white">
        <X className="size-4" />
      </button>
    </div>
  );
}

function getOrCreateVisitorId() {
  const storageKey = "portfolio_visitor_id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;

  const id = crypto.randomUUID();
  window.localStorage.setItem(storageKey, id);
  return id;
}
