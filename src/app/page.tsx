import PublicPortfolio from "@/components/public-portfolio";
import { prisma } from "@/lib/server/prisma";
import type { Experience, PortfolioData, Profile, Project, Skill } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPortfolioData();
  return <PublicPortfolio data={data} />;
}

async function getPortfolioData(): Promise<PortfolioData> {
  const [dbProfile, dbSkills, dbExperiences, dbProjects, dbFaqs] = await Promise.all([
    prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }] }),
    prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }, { id: "asc" }] }),
    prisma.project.findMany({
      where: { isVisible: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }, { id: "asc" }],
    }),
    prisma.faq.findMany({ where: { isVisible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
  ]);

  const profile: Profile = {
    fullName: dbProfile?.fullName ?? "Portfolio Owner",
    headline: dbProfile?.headline ?? "Business Intelligence Specialist",
    tagline: dbProfile?.tagline ?? "I build data solutions that turn complex information into actionable decisions.",
    bio: dbProfile?.bio ?? "Portfolio profile is not configured yet.",
    photoUrl: dbProfile?.photoUrl ?? undefined,
    location: dbProfile?.location ?? "Indonesia",
    email: dbProfile?.email ?? "hello@example.com",
    whatsapp: dbProfile?.whatsapp ?? "https://wa.me/",
    linkedin: dbProfile?.linkedin ?? "https://www.linkedin.com",
    github: dbProfile?.github ?? "https://github.com",
    cvUrl: dbProfile?.cvUrl ?? undefined,
  };

  const skills: Skill[] = dbSkills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    category: skill.category ?? "Tools",
    level: skill.level ?? 3,
  }));

  const experiences: Experience[] = dbExperiences.map((experience) => ({
    id: experience.id,
    role: experience.role,
    company: experience.company,
    location: experience.location ?? "Remote",
    period: formatPeriod(experience.startDate, experience.endDate, experience.isCurrent),
    description: experience.description ?? "",
    highlights: [],
  }));

  const projects: Project[] = dbProjects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description ?? "",
    category: project.category ?? "Web Development",
    portfolioUrl: project.portfolioUrl ?? "#",
    repoUrl: project.repoUrl ?? undefined,
    imageUrl: project.imageUrl ?? "/assets/hero-robot-dashboard.png",
    tags: project.tags,
    featured: project.featured,
  }));

  return {
    profile,
    socials: [
      { label: "WhatsApp", href: profile.whatsapp, kind: "whatsapp" },
      { label: "LinkedIn", href: profile.linkedin, kind: "linkedin" },
      { label: "Email", href: `mailto:${profile.email}`, kind: "email" },
      { label: "GitHub", href: profile.github, kind: "github" },
    ],
    skills,
    experiences,
    projects,
    faqs: dbFaqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    })),
  };
}

function formatPeriod(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const formatter = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });
  const start = formatter.format(startDate);
  const end = isCurrent || !endDate ? "Present" : formatter.format(endDate);
  return `${start} - ${end}`;
}
