import { FullPortfolioData, ButtonStyle, FontPreset } from '../types/portfolio';
import QRCode from 'qrcode';

export interface ChecklistItem {
  id: string;
  label: string;
  tab: string;
  isCompleted: boolean;
  hint: string;
}

export interface RecommendationItem {
  id: string;
  message: string;
  tab: string;
  actionLabel: string;
}

export function getPortfolioChecklist(portfolio: FullPortfolioData): ChecklistItem[] {
  if (!portfolio) return [];

  const hasProfile = Boolean(
    (portfolio.profile.firstName || portfolio.profile.lastName) &&
    portfolio.profile.professionalTitle
  );

  const hasPresentation = Boolean(
    portfolio.profile.shortPresentation || portfolio.profile.bio
  );

  const totalSkills = portfolio.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const hasSkills = totalSkills > 0;

  const hasExperiences = portfolio.experiences.length > 0;
  const hasEducations = portfolio.educations.length > 0;
  const hasProjects = portfolio.projects.length > 0;
  const hasCertifications = portfolio.certifications.length > 0;
  const hasSocials = portfolio.socialLinks.some((l) => l.url && l.url.trim().length > 0);
  const hasDesign = Boolean(portfolio.settings.templateId);
  const isPublished = Boolean(portfolio.settings.isPublished);

  return [
    {
      id: 'profile',
      label: 'Profil',
      tab: 'profile',
      isCompleted: hasProfile,
      hint: hasProfile ? 'Nom et titre professionnel renseignés' : 'Renseignez au minimum votre nom et titre',
    },
    {
      id: 'presentation',
      label: 'Présentation',
      tab: 'journey',
      isCompleted: hasPresentation,
      hint: hasPresentation ? 'Présentation ou biographie renseignée' : 'Ajoutez une courte phrase d\'accroche',
    },
    {
      id: 'skills',
      label: 'Compétences',
      tab: 'skills',
      isCompleted: hasSkills,
      hint: hasSkills ? `${totalSkills} compétence(s) enregistrée(s)` : 'Ajoutez vos compétences clés',
    },
    {
      id: 'experiences',
      label: 'Expériences',
      tab: 'experiences',
      isCompleted: hasExperiences,
      hint: hasExperiences ? `${portfolio.experiences.length} poste(s) enregistré(s)` : 'Ajoutez au moins une expérience',
    },
    {
      id: 'educations',
      label: 'Formations',
      tab: 'educations',
      isCompleted: hasEducations,
      hint: hasEducations ? `${portfolio.educations.length} diplôme(s) enregistré(s)` : 'Ajoutez votre parcours académique',
    },
    {
      id: 'projects',
      label: 'Projets',
      tab: 'projects',
      isCompleted: hasProjects,
      hint: hasProjects ? `${portfolio.projects.length} projet(s) ajouté(s)` : 'Présentez vos réalisations majeures',
    },
    {
      id: 'certifications',
      label: 'Certifications',
      tab: 'certifications',
      isCompleted: hasCertifications,
      hint: hasCertifications ? `${portfolio.certifications.length} certification(s)` : 'Facultatif : diplômes ou certifications',
    },
    {
      id: 'socials',
      label: 'Réseaux sociaux',
      tab: 'socials',
      isCompleted: hasSocials,
      hint: hasSocials ? 'Liens publics configurés' : 'Ajoutez LinkedIn, GitHub ou autre lien',
    },
    {
      id: 'design',
      label: 'Design',
      tab: 'appearance',
      isCompleted: hasDesign,
      hint: `Modèle : ${portfolio.settings.templateId}`,
    },
    {
      id: 'publication',
      label: 'Publication',
      tab: 'portfolio',
      isCompleted: isPublished,
      hint: isPublished ? 'Portfolio en ligne et accessible' : 'Portfolio non publié (mode brouillon)',
    },
  ];
}

export function calculatePortfolioProgress(portfolio: FullPortfolioData): number {
  if (!portfolio) return 0;
  const checklist = getPortfolioChecklist(portfolio);
  const completedCount = checklist.filter((item) => item.isCompleted).length;
  return Math.round((completedCount / checklist.length) * 100);
}

export function getSmartRecommendations(portfolio: FullPortfolioData): RecommendationItem[] {
  if (!portfolio) return [];
  const recs: RecommendationItem[] = [];

  if (!portfolio.profile.photoUrl) {
    recs.push({
      id: 'rec-photo',
      message: 'Ajoutez une photo de profil pour compléter votre présentation et humaniser votre portfolio.',
      tab: 'profile',
      actionLabel: 'Ajouter une photo',
    });
  }

  const totalSkills = portfolio.skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  if (totalSkills === 0) {
    recs.push({
      id: 'rec-skills',
      message: 'Votre liste de compétences est vide. Ajoutez vos expertises pour valoriser votre profil.',
      tab: 'skills',
      actionLabel: 'Ajouter des compétences',
    });
  }

  if (portfolio.projects.length === 0) {
    recs.push({
      id: 'rec-projects',
      message: 'Votre section Projets est encore vide. Présentez au moins une réalisation pour susciter l\'intérêt.',
      tab: 'projects',
      actionLabel: 'Ajouter mon premier projet',
    });
  }

  if (portfolio.experiences.length === 0) {
    recs.push({
      id: 'rec-exp',
      message: 'Aucune expérience professionnelle renseignée. Ajoutez votre parcours pour crédibiliser votre profil.',
      tab: 'experiences',
      actionLabel: 'Ajouter une expérience',
    });
  }

  const hasLinkedinOrGh = portfolio.socialLinks.some((l) => (l.platform === 'linkedin' || l.platform === 'github') && l.url.trim().length > 0);
  if (!hasLinkedinOrGh) {
    recs.push({
      id: 'rec-social',
      message: 'Ajoutez un lien LinkedIn ou GitHub pour faciliter le contact professionnel avec les recruteurs.',
      tab: 'socials',
      actionLabel: 'Ajouter mes réseaux',
    });
  }

  if (!portfolio.settings.isPublished && calculatePortfolioProgress(portfolio) >= 60) {
    recs.push({
      id: 'rec-publish',
      message: 'Votre portfolio est bien complété ! Vous pouvez dès à présent le publier pour le partager.',
      tab: 'portfolio',
      actionLabel: 'Publier mon portfolio',
    });
  }

  return recs;
}

export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 360,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR Code', err);
    return '';
  }
}

export const generateQrCodeDataUrl = generateQRCodeDataUrl;
export const getPortfolioRecommendations = getSmartRecommendations;

export function downloadQRCode(dataUrl: string, username: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `QRCode-Portfolio-${username || 'builder'}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDateRange(startDate?: string, endDate?: string, isCurrent?: boolean): string {
  if (!startDate && !endDate) return '';
  const formatSingle = (val?: string) => {
    if (!val) return '';
    try {
      const parts = val.split('-');
      if (parts.length >= 2) {
        const monthNames = ['Jan.', 'Fév.', 'Mar.', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
        const m = parseInt(parts[1], 10) - 1;
        return `${monthNames[m] || ''} ${parts[0]}`.trim();
      }
      return val;
    } catch {
      return val;
    }
  };

  const startStr = formatSingle(startDate);
  if (isCurrent) {
    return startStr ? `${startStr} — Présent` : 'Poste actuel';
  }
  const endStr = formatSingle(endDate);
  if (startStr && endStr) return `${startStr} — ${endStr}`;
  if (startStr) return `${startStr} — ...`;
  if (endStr) return `Jusqu'en ${endStr}`;
  return '';
}

export function getButtonStyleClasses(style: ButtonStyle, primaryColor?: string): string {
  switch (style) {
    case 'pill':
      return 'rounded-full';
    case 'sharp':
      return 'rounded-none';
    case 'rounded':
    default:
      return 'rounded-lg';
  }
}

export function getFontPresetClass(preset: FontPreset): string {
  switch (preset) {
    case 'cabinet':
      return 'font-display font-[family-name:Cabinet_Grotesk,sans-serif]';
    case 'ibm-mono':
      return 'font-mono font-[family-name:IBM_Plex_Mono,monospace]';
    case 'plus-jakarta':
    default:
      return 'font-sans font-[family-name:Plus_Jakarta_Sans,sans-serif]';
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export function downloadCVPdf(firstName?: string, lastName?: string) {
  const cleanFirst = (firstName || '').trim().replace(/\s+/g, '_');
  const cleanLast = (lastName || '').trim().replace(/\s+/g, '_');
  let filename = 'CV.pdf';
  if (cleanLast || cleanFirst) {
    filename = `CV-${cleanLast || 'Portfolio'}-${cleanFirst || 'Candidat'}.pdf`;
  }
  
  const originalTitle = document.title;
  document.title = filename.replace('.pdf', '');
  
  window.print();
  
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
