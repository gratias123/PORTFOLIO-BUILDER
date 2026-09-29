export type TemplateId = 'professional' | 'creative' | 'tech' | 'minimalist' | 'corporate';
export type ButtonStyle = 'rounded' | 'pill' | 'sharp';
export type FontPreset = 'plus-jakarta' | 'cabinet' | 'ibm-mono';

export interface User {
  id: string;
  email: string;
  username: string; // Public slug e.g. /p/username
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  photoUrl: string;
  professionalTitle: string;
  location: string;
  email: string;
  phone: string;
  shortPresentation: string;
  bio: string;
  websiteUrl: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: number; // 1-5 optional
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  category: string;
  role?: string;
  liveUrl: string;
  githubUrl: string;
  date: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  documentUrl: string;
  verificationUrl: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  iconName?: string; // Lucide icon name or generic code
  level?: string; // e.g. Avancé, Intermédiaire, Quotidien
  description?: string;
}

export type SocialPlatform =
  | 'linkedin'
  | 'github'
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'whatsapp'
  | 'website'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface VisibleSections {
  profile: boolean;
  bio: boolean;
  skills: boolean;
  experiences: boolean;
  educations: boolean;
  projects: boolean;
  certifications: boolean;
  tools: boolean;
  socials: boolean;
  contact: boolean;
}

export interface PortfolioSettings {
  templateId: TemplateId;
  primaryColor: string;
  secondaryColor?: string;
  fontPreset: FontPreset;
  buttonStyle: ButtonStyle;
  isPublished: boolean;
  publishedAt?: string;
  visibleSections: VisibleSections;
  customHeading?: string;
  allowCvDownload?: boolean;
  updatedAt: string;
}

export interface PortfolioAnalytics {
  viewsCount: number;
  cvDownloadsCount: number;
  linkClicksCount: number;
  recentVisits: { timestamp: string; referrer?: string }[];
  lastVisitedAt?: string;
}

export interface OnboardingState {
  isCompleted: boolean;
  currentStep: number; // 1 to 12
  completedSteps: number[];
}

export interface FullPortfolioData {
  user: User;
  profile: Profile;
  skillCategories: SkillCategory[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  certifications: Certification[];
  tools: ToolItem[];
  socialLinks: SocialLink[];
  settings: PortfolioSettings;
  analytics: PortfolioAnalytics;
  onboarding: OnboardingState;
}

export const DEFAULT_VISIBLE_SECTIONS: VisibleSections = {
  profile: true,
  bio: true,
  skills: true,
  experiences: true,
  educations: true,
  projects: true,
  certifications: true,
  tools: true,
  socials: true,
  contact: true,
};

export const DEFAULT_SETTINGS: PortfolioSettings = {
  templateId: 'professional',
  primaryColor: '#4F46E5',
  secondaryColor: '#6366F1',
  fontPreset: 'plus-jakarta',
  buttonStyle: 'rounded',
  isPublished: false,
  allowCvDownload: true,
  visibleSections: DEFAULT_VISIBLE_SECTIONS,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ANALYTICS: PortfolioAnalytics = {
  viewsCount: 0,
  cvDownloadsCount: 0,
  linkClicksCount: 0,
  recentVisits: [],
};

/**
 * Creates a clean, empty generic portfolio structure with NO fictitious or personal data.
 */
export function createEmptyPortfolio(user: User): FullPortfolioData {
  return {
    user,
    profile: {
      firstName: '',
      lastName: '',
      photoUrl: '',
      professionalTitle: '',
      location: '',
      email: user.email || '',
      phone: '',
      shortPresentation: '',
      bio: '',
      websiteUrl: '',
    },
    skillCategories: [
      {
        id: 'cat-dev',
        name: 'Développement',
        order: 1,
        skills: [],
      },
      {
        id: 'cat-design',
        name: 'Design',
        order: 2,
        skills: [],
      },
      {
        id: 'cat-management',
        name: 'Gestion de projet',
        order: 3,
        skills: [],
      },
    ],
    experiences: [],
    educations: [],
    projects: [],
    certifications: [],
    tools: [],
    socialLinks: [
      { id: 'soc-li', platform: 'linkedin', label: 'LinkedIn', url: '' },
      { id: 'soc-gh', platform: 'github', label: 'GitHub', url: '' },
      { id: 'soc-x', platform: 'x', label: 'X (Twitter)', url: '' },
      { id: 'soc-wa', platform: 'whatsapp', label: 'WhatsApp', url: '' },
    ],
    settings: {
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString(),
    },
    analytics: {
      ...DEFAULT_ANALYTICS,
    },
    onboarding: {
      isCompleted: false,
      currentStep: 1,
      completedSteps: [],
    },
  };
}
