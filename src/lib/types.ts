export type SocialLink = {
  label: string;
  href: string;
  kind: "whatsapp" | "linkedin" | "email" | "github";
};

export type Profile = {
  fullName: string;
  headline: string;
  tagline: string;
  bio: string;
  photoUrl?: string;
  location: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  cvUrl?: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  portfolioUrl: string;
  repoUrl?: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
};

export type PortfolioData = {
  profile: Profile;
  socials: SocialLink[];
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  impressions: ClientImpression[];
  faqs: Faq[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type Message = {
  id: string;
  name: string;
  email?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type ClientImpression = {
  id: string;
  displayName: string;
  roleDivision: string;
  impression: string;
};

export type AnalyticsPoint = {
  label: string;
  visits: number;
  duration: number;
};
