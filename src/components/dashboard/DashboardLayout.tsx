import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  copyToClipboard, downloadCVPdf,
  getPortfolioRecommendations, generateQrCodeDataUrl, downloadQRCode 
} from '../../utils/helpers';
import { TemplateEngine } from '../templates/TemplateEngine';
import { CVView } from '../cv/CVView';
import {
  Layers, User as UserIcon, Sparkles, Code2, Briefcase, 
  GraduationCap, Award, FolderGit2, Wrench, Share2, Palette, 
  Globe, FileText, Settings, ExternalLink, Check, Copy, Eye, 
  Save, AlertCircle, RefreshCw, Plus, Trash2, ArrowUpRight,
  LogOut, ShieldAlert, QrCode, Smartphone, Tablet, Monitor,
  KeyRound, UserX, Upload, Download as DownloadIcon, CheckCircle2, MessageCircle, Twitter, Linkedin
} from 'lucide-react';
import { TemplateId, ButtonStyle, FontPreset, SkillCategory, Experience, Education, Project, Certification, ToolItem, SocialPlatform, FullPortfolioData } from '../../types/portfolio';
import { api } from '../../services/api';

export type DashboardTab = 
  | 'overview' 
  | 'profile' 
  | 'journey' 
  | 'skills' 
  | 'experiences' 
  | 'educations' 
  | 'projects' 
  | 'certifications' 
  | 'tools' 
  | 'socials' 
  | 'appearance' 
  | 'portfolio' 
  | 'cv' 
  | 'settings';

interface DashboardLayoutProps {
  initialTab?: DashboardTab;
  onLogout: () => void;
  onOpenPublicPortfolio: (username: string) => void;
  onStartOnboarding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  initialTab,
  onLogout,
  onOpenPublicPortfolio,
  onStartOnboarding,
}) => {
  const { 
    portfolio, user, updatePortfolio, saveNow, isSaving, saveStatus, 
    lastSaved, logout, updateUsername, publishPortfolio, unpublishPortfolio,
    changePassword, deleteAccount
  } = usePortfolio();
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || 'overview');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewViewMode, setPreviewViewMode] = useState<'portfolio' | 'cv'>('portfolio');

  // QR Code state
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Password change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Backup import/export state
  const [importStatus, setImportStatus] = useState<{ success?: string; error?: string } | null>(null);

  // Username edit state for settings tab
  const [newUsernameInput, setNewUsernameInput] = useState<string>(user?.username || '');
  const [usernameStatus, setUsernameStatus] = useState<{ checked: boolean; available?: boolean; error?: string }>({ checked: false });
  const [usernameSaving, setUsernameSaving] = useState<boolean>(false);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.username) {
      setNewUsernameInput(user.username);
    }
  }, [user?.username]);

  // Generate QR code when portfolio or user username changes
  useEffect(() => {
    if (portfolio?.user?.username) {
      const url = `${window.location.origin}/#/p/${portfolio.user.username}`;
      generateQrCodeDataUrl(url).then((dataUrl) => {
        setQrCodeDataUrl(dataUrl);
      });
    }
  }, [portfolio?.user?.username]);

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/#/p/${portfolio.user.username}`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const navItems: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Espace Création', icon: Layers },
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'journey', label: 'Parcours', icon: Sparkles },
    { id: 'skills', label: 'Compétences', icon: Code2 },
    { id: 'experiences', label: 'Expériences', icon: Briefcase },
    { id: 'educations', label: 'Formations', icon: GraduationCap },
    { id: 'projects', label: 'Projets', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'tools', label: 'Outils', icon: Wrench },
    { id: 'socials', label: 'Réseaux', icon: Share2 },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'portfolio', label: 'Portfolio & Partage', icon: Globe },
    { id: 'cv', label: 'CV', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Portfolio Builder
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Espace de gestion</p>
            </div>
          </div>

          {/* User profile quick view */}
          <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="truncate pr-2">
              <span className="font-semibold text-slate-800 block truncate">
                {[portfolio.profile.firstName, portfolio.profile.lastName].filter(Boolean).join(' ') || 'Mon Profil'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono block truncate">
                @{portfolio.user.username}
              </span>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                portfolio.settings.isPublished ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              title={portfolio.settings.isPublished ? 'Publié' : 'Brouillon'}
            />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => onStartOnboarding()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Guide étape par étape</span>
          </button>
          <button
            onClick={async () => {
              await logout();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar contract */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Mon Portfolio</span>
            <span>/</span>
            <span className="text-slate-500 font-medium">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-save status feedback */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Enregistrement...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Modifications sauvegardées</span>
                </>
              ) : null}
            </div>

            {/* Quick Preview Button */}
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Aperçu</span>
            </button>

            {/* Public Link Action */}
            <button
              onClick={() => onOpenPublicPortfolio(portfolio.user.username)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Voir en ligne</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-8 flex-1 max-w-6xl w-full mx-auto space-y-8">
          {/* TAB 1: OVERVIEW / ESPACE CRÉATION */}
          {activeTab === 'overview' && (() => {
            const recommendations = getPortfolioRecommendations(portfolio);

            return (
              <div className="space-y-8">
                {/* Centre de Diffusion & Partage (Sans métriques statistiques) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Carte Statut & Visibilité */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-500">Statut de diffusion</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          portfolio.settings.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${portfolio.settings.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        {portfolio.settings.isPublished ? 'En ligne et accessible' : 'Brouillon privé'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Visibilité publique</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {portfolio.settings.isPublished ? 'Visible par les recruteurs via votre lien unique' : 'Privé, visible uniquement par vous'}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          if (portfolio.settings.isPublished) {
                            await unpublishPortfolio();
                          } else {
                            await publishPortfolio();
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ml-3 ${
                          portfolio.settings.isPublished ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                        title={portfolio.settings.isPublished ? 'Passer en brouillon privé' : 'Publier en ligne'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                            portfolio.settings.isPublished ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                      <span>Format d'export rapide :</span>
                      <button
                        onClick={() => downloadCVPdf(portfolio.profile.firstName, portfolio.profile.lastName)}
                        className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" />
                        <span>Télécharger le CV A4</span>
                      </button>
                    </div>
                  </div>

                  {/* Carte Lien Public & Partage */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="font-bold uppercase tracking-wider text-slate-500">Lien Public Unique</span>
                        <button
                          onClick={handleCopyLink}
                          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-semibold text-xs cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copié !' : 'Copier le lien'}</span>
                        </button>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 font-mono text-xs text-slate-800 truncate flex items-center justify-between gap-2">
                        <span className="truncate">/#/p/{portfolio.user.username}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-sans font-medium">Lien web</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        onClick={() => onOpenPublicPortfolio(portfolio.user.username)}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visiter mon portfolio</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveTab('portfolio')}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        title="Ouvrir le QR Code et les options de partage"
                      >
                        <QrCode className="w-3.5 h-3.5 text-slate-600" />
                        <span className="hidden sm:inline">QR Code</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Accès Direct aux Rubriques & Conseils */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Modules d'édition directe (7 cols) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Rubriques du Portfolio</h3>
                      <p className="text-xs text-slate-500">Accédez directement à chaque section pour modifier votre contenu.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {[
                        { tab: 'profile' as DashboardTab, label: 'Profil & Bio', hint: 'Nom, fonction, photo et présentation', icon: UserIcon },
                        { tab: 'experiences' as DashboardTab, label: 'Expériences', hint: 'Postes, missions et entreprises', icon: Briefcase },
                        { tab: 'projects' as DashboardTab, label: 'Projets', hint: 'Réalisations, captures et liens', icon: FolderGit2 },
                        { tab: 'skills' as DashboardTab, label: 'Compétences', hint: 'Technologies et savoir-faire', icon: Code2 },
                        { tab: 'educations' as DashboardTab, label: 'Formations', hint: 'Diplômes et parcours académique', icon: GraduationCap },
                        { tab: 'certifications' as DashboardTab, label: 'Certifications', hint: 'Titres officiels et diplômes pro', icon: Award },
                        { tab: 'tools' as DashboardTab, label: 'Outils', hint: 'Logiciels et stack technique', icon: Wrench },
                        { tab: 'appearance' as DashboardTab, label: 'Apparence & Style', hint: 'Thèmes, couleurs et typographies', icon: Palette },
                      ].map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <div
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/40 hover:border-indigo-300 text-xs flex items-center justify-between cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 text-slate-600">
                                <ItemIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <span className="font-semibold text-slate-800 block truncate">{item.label}</span>
                                <span className="text-[10px] text-slate-500 block truncate">{item.hint}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-indigo-600 shrink-0 ml-2">
                              Éditer →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Smart Recommendations (5 cols) */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                          Conseils & Bonnes Pratiques
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Recommandations pour maximiser l'impact de votre portfolio auprès des recruteurs et clients :
                      </p>
                      <div className="space-y-2.5 pt-1">
                        {recommendations.slice(0, 3).map((rec) => (
                          <div 
                            key={rec.id}
                            onClick={() => setActiveTab(rec.tab as DashboardTab)}
                            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 text-xs transition-colors cursor-pointer flex items-center justify-between gap-3"
                          >
                            <span className="text-slate-200 leading-snug">{rec.message}</span>
                            <span className="text-[11px] font-bold text-indigo-300 shrink-0">
                              {rec.actionLabel} →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span>Prêt à tester ?</span>
                      <button
                        onClick={() => onOpenPublicPortfolio(portfolio.user.username)}
                        className="text-white hover:text-indigo-300 font-bold inline-flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <span>Tester en tant que visiteur</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Navigation Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Accès rapide aux modules clés
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { tab: 'profile' as DashboardTab, title: 'Profil & Bio', subtitle: 'Identité et présentation', icon: UserIcon },
                      { tab: 'experiences' as DashboardTab, title: 'Expériences', subtitle: 'Parcours en entreprise', icon: Briefcase },
                      { tab: 'projects' as DashboardTab, title: 'Projets', subtitle: 'Vitrine et réalisations', icon: FolderGit2 },
                      { tab: 'cv' as DashboardTab, title: 'CV Généré', subtitle: 'Export A4 vectoriel', icon: FileText },
                    ].map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.tab}
                          onClick={() => setActiveTab(card.tab)}
                          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-sm text-slate-900">{card.title}</span>
                            <Icon className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{card.subtitle}</span>
                            <span className="text-indigo-600 font-semibold">Gérer →</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              {/* Real-time Preview Miniature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Aperçu instantané (Modèle : {portfolio.settings.templateId})
                  </h3>
                  <button
                    onClick={() => setActiveTab('appearance')}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Changer de template ou de couleur
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-1">
                  <div className="max-h-[500px] overflow-y-auto rounded-xl">
                    <TemplateEngine data={portfolio} isInteractive={false} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

          {/* TAB 2: PROFIL */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Informations Personnelles & Professionnelles</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Les champs vides ne sont jamais affichés sur votre page publique.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Prénom</label>
                  <input
                    type="text"
                    value={portfolio.profile.firstName}
                    placeholder="Ex : Jean"
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, firstName: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={portfolio.profile.lastName}
                    placeholder="Ex : Martin"
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, lastName: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Titre professionnel</label>
                  <input
                    type="text"
                    value={portfolio.profile.professionalTitle}
                    placeholder="Ex : Développeur Full-Stack Senior / Lead Architect"
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, professionalTitle: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Localisation</label>
                  <input
                    type="text"
                    value={portfolio.profile.location}
                    placeholder="Ex : Lyon, France"
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, location: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email de contact</label>
                  <input
                    type="email"
                    value={portfolio.profile.email}
                    placeholder="Ex : contact@domaine.com"
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, email: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={portfolio.profile.phone}
                    placeholder="Ex : +33 6 12 34 56 78"
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, phone: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL photo de profil</label>
                  <input
                    type="url"
                    value={portfolio.profile.photoUrl}
                    placeholder="https://..."
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, photoUrl: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARCOURS */}
          {activeTab === 'journey' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Parcours & Biographie</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mettez en valeur votre trajectoire professionnelle et votre proposition de valeur.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Présentation courte d'accroche (1 à 2 phrases)
                  </label>
                  <input
                    type="text"
                    value={portfolio.profile.shortPresentation}
                    placeholder="Ex : Développeur web spécialisé dans la conception d'applications haute performance."
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, shortPresentation: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Biographie détaillée
                  </label>
                  <textarea
                    rows={8}
                    value={portfolio.profile.bio}
                    placeholder="Présentez votre parcours, vos convictions professionnelles, vos succès et ce qui caractérise votre méthode de travail..."
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, bio: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPÉTENCES */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Compétences & Domaines</h2>
                  <p className="text-xs text-slate-500">
                    Créez des catégories personnalisées et regroupez vos savoir-faire.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const catName = prompt('Nom de la nouvelle catégorie :');
                    if (catName && catName.trim()) {
                      updatePortfolio((p) => ({
                        ...p,
                        skillCategories: [
                          ...p.skillCategories,
                          {
                            id: `cat-${Date.now()}`,
                            name: catName.trim(),
                            order: p.skillCategories.length + 1,
                            skills: [],
                          },
                        ],
                      }));
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle catégorie</span>
                </button>
              </div>

              <div className="space-y-6">
                {portfolio.skillCategories.map((cat, catIdx) => (
                  <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              skillCategories: p.skillCategories.map((c, i) => i === catIdx ? { ...c, name: newName } : c),
                            }));
                          }}
                          className="font-bold text-slate-900 text-base bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none"
                        />
                        <span className="text-xs text-slate-400">({cat.skills.length})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const skillName = prompt('Nom de la compétence :');
                            if (skillName && skillName.trim()) {
                              updatePortfolio((p) => ({
                                ...p,
                                skillCategories: p.skillCategories.map((c, i) =>
                                  i === catIdx
                                    ? {
                                        ...c,
                                        skills: [
                                          ...c.skills,
                                          { id: `sk-${Date.now()}`, name: skillName.trim(), level: 4 },
                                        ],
                                      }
                                    : c
                                ),
                              }));
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 bg-indigo-50 rounded-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter compétence</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer la catégorie "${cat.name}" et ses compétences ?`)) {
                              updatePortfolio((p) => ({
                                ...p,
                                skillCategories: p.skillCategories.filter((_, i) => i !== catIdx),
                              }));
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Supprimer la catégorie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {cat.skills.length === 0 ? (
                        <p className="text-xs text-slate-400 italic col-span-full">
                          Aucune compétence dans cette catégorie. Cliquez sur "+ Ajouter compétence".
                        </p>
                      ) : (
                        cat.skills.map((skill, sIdx) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                          >
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                updatePortfolio((p) => ({
                                  ...p,
                                  skillCategories: p.skillCategories.map((c, i) =>
                                    i === catIdx
                                      ? {
                                          ...c,
                                          skills: c.skills.map((s, si) => si === sIdx ? { ...s, name: newName } : s),
                                        }
                                      : c
                                  ),
                                }));
                              }}
                              className="font-semibold text-slate-800 bg-transparent focus:outline-none flex-1 mr-2"
                            />
                            <div className="flex items-center gap-2">
                              <select
                                value={skill.level || 4}
                                onChange={(e) => {
                                  const lvl = parseInt(e.target.value, 10);
                                  updatePortfolio((p) => ({
                                    ...p,
                                    skillCategories: p.skillCategories.map((c, i) =>
                                      i === catIdx
                                        ? {
                                            ...c,
                                            skills: c.skills.map((s, si) => si === sIdx ? { ...s, level: lvl } : s),
                                          }
                                        : c
                                    ),
                                  }));
                                }}
                                className="text-[11px] bg-white border border-slate-200 rounded px-1.5 py-0.5"
                                title="Niveau 1 à 5"
                              >
                                {[1, 2, 3, 4, 5].map((l) => (
                                  <option key={l} value={l}>{l}/5</option>
                                ))}
                              </select>
                              <button
                                onClick={() => {
                                  updatePortfolio((p) => ({
                                    ...p,
                                    skillCategories: p.skillCategories.map((c, i) =>
                                      i === catIdx
                                        ? { ...c, skills: c.skills.filter((_, si) => si !== sIdx) }
                                        : c
                                    ),
                                  }));
                                }}
                                className="text-slate-400 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EXPÉRIENCES */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Expériences Professionnelles</h2>
                  <p className="text-xs text-slate-500">Parcours chronologique de vos postes et missions.</p>
                </div>
                <button
                  onClick={() => {
                    updatePortfolio((p) => ({
                      ...p,
                      experiences: [
                        ...p.experiences,
                        {
                          id: `exp-${Date.now()}`,
                          jobTitle: '',
                          company: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          isCurrent: false,
                          description: '',
                        },
                      ],
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une expérience</span>
                </button>
              </div>

              {portfolio.experiences.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-3">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">Aucune expérience ajoutée pour l'instant.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.experiences.map((exp, idx) => (
                    <div key={exp.id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expérience #{idx + 1}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              experiences: p.experiences.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Poste</label>
                          <input
                            type="text"
                            placeholder="Ex : Responsable Produit"
                            value={exp.jobTitle}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                experiences: p.experiences.map((item, i) => i === idx ? { ...item, jobTitle: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Entreprise</label>
                          <input
                            type="text"
                            placeholder="Ex : Startup SAS"
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                experiences: p.experiences.map((item, i) => i === idx ? { ...item, company: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Localisation</label>
                          <input
                            type="text"
                            placeholder="Ex : Paris / Remote"
                            value={exp.location}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                experiences: p.experiences.map((item, i) => i === idx ? { ...item, location: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Date début</label>
                          <input
                            type="text"
                            placeholder="Ex : 2021-03"
                            value={exp.startDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                experiences: p.experiences.map((item, i) => i === idx ? { ...item, startDate: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Date fin</label>
                          <input
                            type="text"
                            placeholder="Ex : 2023-09"
                            disabled={exp.isCurrent}
                            value={exp.isCurrent ? 'Poste actuel' : exp.endDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                experiences: p.experiences.map((item, i) => i === idx ? { ...item, endDate: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs disabled:opacity-50"
                          />
                        </div>
                        <div className="flex items-end pb-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.isCurrent}
                              onChange={(e) => {
                                const chk = e.target.checked;
                                updatePortfolio((p) => ({
                                  ...p,
                                  experiences: p.experiences.map((item, i) => i === idx ? { ...item, isCurrent: chk } : item),
                                }));
                              }}
                            />
                            <span>Poste actuel</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Description des réalisations</label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          placeholder="Missions menées, technologies employées, indicateurs de performance atteints..."
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              experiences: p.experiences.map((item, i) => i === idx ? { ...item, description: val } : item),
                            }));
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FORMATIONS */}
          {activeTab === 'educations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Formations & Diplômes</h2>
                  <p className="text-xs text-slate-500">Parcours académique, écoles, universités.</p>
                </div>
                <button
                  onClick={() => {
                    updatePortfolio((p) => ({
                      ...p,
                      educations: [
                        ...p.educations,
                        {
                          id: `edu-${Date.now()}`,
                          institution: '',
                          degree: '',
                          fieldOfStudy: '',
                          startDate: '',
                          endDate: '',
                          description: '',
                        },
                      ],
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une formation</span>
                </button>
              </div>

              {portfolio.educations.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-3">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">Aucune formation enregistrée.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.educations.map((edu, idx) => (
                    <div key={edu.id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Formation #{idx + 1}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Diplôme</label>
                          <input
                            type="text"
                            placeholder="Ex : Ingénieur d'État / Master"
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                educations: p.educations.map((item, i) => i === idx ? { ...item, degree: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Établissement</label>
                          <input
                            type="text"
                            placeholder="Ex : École Centrale / Sorbonne"
                            value={edu.institution}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                educations: p.educations.map((item, i) => i === idx ? { ...item, institution: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Domaine</label>
                          <input
                            type="text"
                            placeholder="Ex : Informatique & Intelligence Artificielle"
                            value={edu.fieldOfStudy}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                educations: p.educations.map((item, i) => i === idx ? { ...item, fieldOfStudy: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Date début (ex : 2018)"
                          value={edu.startDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.map((item, i) => i === idx ? { ...item, startDate: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Date fin ou obtention (ex : 2021)"
                          value={edu.endDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.map((item, i) => i === idx ? { ...item, endDate: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PROJETS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Projets & Réalisations</h2>
                  <p className="text-xs text-slate-500">Ajoutez des projets avec liens live et dépôts GitHub.</p>
                </div>
                <button
                  onClick={() => {
                    updatePortfolio((p) => ({
                      ...p,
                      projects: [
                        ...p.projects,
                        {
                          id: `proj-${Date.now()}`,
                          title: '',
                          description: '',
                          imageUrl: '',
                          technologies: [],
                          category: '',
                          liveUrl: '',
                          githubUrl: '',
                          date: new Date().getFullYear().toString(),
                        },
                      ],
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau projet</span>
                </button>
              </div>

              {portfolio.projects.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-3">
                  <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">Aucun projet ajouté.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.projects.map((proj, idx) => (
                    <div key={proj.id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projet #{idx + 1}</span>
                          <button
                            onClick={() => {
                              updatePortfolio((p) => ({
                                ...p,
                                projects: p.projects.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Titre du projet</label>
                          <input
                            type="text"
                            placeholder="Ex : Plateforme E-commerce SaaS"
                            value={proj.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                projects: p.projects.map((item, i) => i === idx ? { ...item, title: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Catégorie</label>
                            <input
                              type="text"
                              placeholder="Ex : Web, Mobile, API"
                              value={proj.category}
                              onChange={(e) => {
                                const val = e.target.value;
                                updatePortfolio((p) => ({
                                  ...p,
                                  projects: p.projects.map((item, i) => i === idx ? { ...item, category: val } : item),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Rôle / Poste</label>
                            <input
                              type="text"
                              placeholder="Ex : Lead Développeur"
                              value={proj.role || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updatePortfolio((p) => ({
                                  ...p,
                                  projects: p.projects.map((item, i) => i === idx ? { ...item, role: val } : item),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Date</label>
                            <input
                              type="text"
                              placeholder="Ex : 2024"
                              value={proj.date}
                              onChange={(e) => {
                                const val = e.target.value;
                                updatePortfolio((p) => ({
                                  ...p,
                                  projects: p.projects.map((item, i) => i === idx ? { ...item, date: val } : item),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Technologies (séparées par des virgules)</label>
                          <input
                            type="text"
                            placeholder="Ex : React, TypeScript, Node.js, PostgreSQL"
                            value={proj.technologies.join(', ')}
                            onChange={(e) => {
                              const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              updatePortfolio((p) => ({
                                ...p,
                                projects: p.projects.map((item, i) => i === idx ? { ...item, technologies: arr } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Description</label>
                          <textarea
                            rows={3}
                            placeholder="Description synthétique des fonctionnalités, du défi et de l'impact..."
                            value={proj.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                projects: p.projects.map((item, i) => i === idx ? { ...item, description: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Image URL (facultatif)</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={proj.imageUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                projects: p.projects.map((item, i) => i === idx ? { ...item, imageUrl: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Lien direct (Live)</label>
                            <input
                              type="url"
                              placeholder="https://monprojet.com"
                              value={proj.liveUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                updatePortfolio((p) => ({
                                  ...p,
                                  projects: p.projects.map((item, i) => i === idx ? { ...item, liveUrl: val } : item),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Lien GitHub</label>
                            <input
                              type="url"
                              placeholder="https://github.com/..."
                              value={proj.githubUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                updatePortfolio((p) => ({
                                  ...p,
                                  projects: p.projects.map((item, i) => i === idx ? { ...item, githubUrl: val } : item),
                                }));
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Certifications & Accréditations</h2>
                  <p className="text-xs text-slate-500">
                    Important : Le bouton "Vérifier" n'apparaît que lorsqu'une URL de vérification réelle existe.
                  </p>
                </div>
                <button
                  onClick={() => {
                    updatePortfolio((p) => ({
                      ...p,
                      certifications: [
                        ...p.certifications,
                        {
                          id: `cert-${Date.now()}`,
                          title: '',
                          issuer: '',
                          date: new Date().getFullYear().toString(),
                          documentUrl: '',
                          verificationUrl: '',
                        },
                      ],
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une certification</span>
                </button>
              </div>

              {portfolio.certifications.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 space-y-3">
                  <Award className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">Aucune certification enregistrée.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.certifications.map((cert, idx) => (
                    <div key={cert.id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Certification #{idx + 1}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              certifications: p.certifications.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Titre de la certification</label>
                          <input
                            type="text"
                            placeholder="Ex : AWS Certified Solutions Architect"
                            value={cert.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                certifications: p.certifications.map((item, i) => i === idx ? { ...item, title: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Organisme émetteur</label>
                          <input
                            type="text"
                            placeholder="Ex : Amazon Web Services"
                            value={cert.issuer}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                certifications: p.certifications.map((item, i) => i === idx ? { ...item, issuer: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Date</label>
                          <input
                            type="text"
                            placeholder="Ex : 2024"
                            value={cert.date}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                certifications: p.certifications.map((item, i) => i === idx ? { ...item, date: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Description (compétences validées, contexte)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex : Validation des architectures cloud distribuées et sécurisées"
                          value={cert.description || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              certifications: p.certifications.map((item, i) => i === idx ? { ...item, description: val } : item),
                            }));
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          URL publique de vérification (Le bouton "Vérifier" apparaît si ce champ est renseigné)
                        </label>
                        <input
                          type="url"
                          placeholder="https://credly.com/badges/..."
                          value={cert.verificationUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              certifications: p.certifications.map((item, i) => i === idx ? { ...item, verificationUrl: val } : item),
                            }));
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: OUTILS */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Outils & Environnements</h2>
                  <p className="text-xs text-slate-500">Logiciels, bibliothèques, IDEs, outils du quotidien.</p>
                </div>
                <button
                  onClick={() => {
                    const toolName = prompt("Nom de l'outil (ex : Docker, Figma, Git, VS Code) :");
                    if (toolName && toolName.trim()) {
                      updatePortfolio((p) => ({
                        ...p,
                        tools: [
                          ...p.tools,
                          {
                            id: `tool-${Date.now()}`,
                            name: toolName.trim(),
                            category: 'Général',
                            iconName: '',
                          },
                        ],
                      }));
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un outil</span>
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                {portfolio.tools.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun outil renseigné. Cliquez sur "+ Ajouter un outil".</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {portfolio.tools.map((tool, idx) => (
                      <div
                        key={tool.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                      >
                        <span>{tool.name}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              tools: p.tools.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10: RÉSEAUX SOCIAUX */}
          {activeTab === 'socials' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Réseaux Sociaux & Liens Externes</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Les réseaux non renseignés ne seront pas affichés sur votre portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {portfolio.socialLinks.map((soc, idx) => (
                  <div key={soc.id} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 capitalize">
                      {soc.label || soc.platform}
                    </label>
                    <input
                      type="url"
                      placeholder={`https://${soc.platform}.com/...`}
                      value={soc.url}
                      onChange={(e) => {
                        const val = e.target.value;
                        updatePortfolio((p) => ({
                          ...p,
                          socialLinks: p.socialLinks.map((item, i) => i === idx ? { ...item, url: val } : item),
                        }));
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: APPARENCE & PERSONNALISATION */}
          {activeTab === 'appearance' && (
            <div className="space-y-8">
              {/* Template Choice */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Choix du Modèle (Template)</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Vos données sont 100% indépendantes du design. Changer de modèle ne supprime aucune donnée.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { id: 'minimalist' as TemplateId, title: '01. Minimaliste', sub: 'Minimalist', desc: 'Épuré, typographique, espace blanc généreux et distraction visuelle réduite.' },
                    { id: 'creative' as TemplateId, title: '02. Créatif', sub: 'Creative', desc: 'Typographique, audacieux et visuel avec mise en avant des galeries et créations.' },
                    { id: 'corporate' as TemplateId, title: '03. Corporate', sub: 'Corporate / Pro', desc: 'Sélectif, sobre et axé recrutement pour profils exécutifs et consultants.' },
                    { id: 'tech' as TemplateId, title: '04. Tech', sub: 'Engineering / Dark', desc: 'Inspiré des consoles d\'ingénierie logicielle, stack technique et dépôts Git.' },
                  ].map((tpl) => {
                    const isSelected = portfolio.settings.templateId === tpl.id || (tpl.id === 'corporate' && portfolio.settings.templateId === 'professional');
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          updatePortfolio((p) => ({
                            ...p,
                            settings: { ...p.settings, templateId: tpl.id },
                          }));
                        }}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-extrabold text-sm text-slate-900">{tpl.title}</h3>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[10px] font-mono text-indigo-600 font-semibold block mb-2">{tpl.sub}</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{tpl.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Theme Settings: Color, Typography, Buttons */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Style & Identité Visuelle</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Ajustez la couleur d'accentuation, la typographie et la forme des boutons.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Primary Color Palette */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Couleur Principale
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {[
                        { hex: '#4F46E5', name: 'Indigo (Défaut)' },
                        { hex: '#2563EB', name: 'Bleu Royal' },
                        { hex: '#0D9488', name: 'Sarcelle' },
                        { hex: '#D97706', name: 'Ambre' },
                        { hex: '#0F172A', name: 'Ardoise Sombre' },
                        { hex: '#E11D48', name: 'Rubis' },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              settings: { ...p.settings, primaryColor: c.hex },
                            }));
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                            portfolio.settings.primaryColor === c.hex ? 'scale-115 border-slate-900 shadow-xs' : 'border-white'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Typography Font Preset */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Typographie
                    </label>
                    <select
                      value={portfolio.settings.fontPreset}
                      onChange={(e) => {
                        const font = e.target.value as FontPreset;
                        updatePortfolio((p) => ({
                          ...p,
                          settings: { ...p.settings, fontPreset: font },
                        }));
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    >
                      <option value="plus-jakarta">Plus Jakarta Sans (Moderne & Net)</option>
                      <option value="cabinet">Cabinet Grotesk (Expressif & Éditorial)</option>
                      <option value="ibm-mono">IBM Plex Mono (Technique & Minimal)</option>
                    </select>
                  </div>

                  {/* Button Style */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Boutons
                    </label>
                    <div className="flex gap-2">
                      {(['rounded', 'pill', 'sharp'] as ButtonStyle[]).map((btn) => (
                        <button
                          key={btn}
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              settings: { ...p.settings, buttonStyle: btn },
                            }));
                          }}
                          className={`flex-1 py-2 text-xs font-semibold border ${
                            btn === 'pill' ? 'rounded-full' : btn === 'sharp' ? 'rounded-none' : 'rounded-lg'
                          } ${
                            portfolio.settings.buttonStyle === btn
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {btn === 'rounded' ? 'Arrondi' : btn === 'pill' ? 'Pilule' : 'Droit'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Visibility Toggles */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Affichage des Sections</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Activez ou masquez les sections selon vos besoins de présentation.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { key: 'profile', label: 'En-tête Profil' },
                    { key: 'bio', label: 'Bio / Parcours' },
                    { key: 'skills', label: 'Compétences' },
                    { key: 'experiences', label: 'Expériences' },
                    { key: 'educations', label: 'Formations' },
                    { key: 'projects', label: 'Projets' },
                    { key: 'certifications', label: 'Certifications' },
                    { key: 'tools', label: 'Outils' },
                    { key: 'socials', label: 'Réseaux' },
                    { key: 'contact', label: 'Contact' },
                  ].map((sec) => {
                    const isVisible = (portfolio.settings.visibleSections as any)[sec.key];
                    return (
                      <label
                        key={sec.key}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                          isVisible ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <span>{sec.label}</span>
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={(e) => {
                            const val = e.target.checked;
                            updatePortfolio((p) => ({
                              ...p,
                              settings: {
                                ...p.settings,
                                visibleSections: {
                                  ...p.settings.visibleSections,
                                  [sec.key]: val,
                                },
                              },
                            }));
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: PORTFOLIO (Publishing & Live URL & Sharing) */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Publication & Diffusion</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Gérez la visibilité de votre portfolio sur Internet et partagez votre lien avec vos recruteurs ou clients.
                  </p>
                </div>

                {/* Status Toggle Card */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          État : {portfolio.settings.isPublished ? 'En ligne (Accessible à tous)' : 'Brouillon (Privé)'}
                        </span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            portfolio.settings.isPublished ? 'bg-emerald-500' : 'bg-amber-400'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {portfolio.settings.isPublished
                          ? `Publié et accessible à tous via votre lien permanent. ${portfolio.settings.publishedAt ? `(Depuis le ${new Date(portfolio.settings.publishedAt).toLocaleDateString()})` : ''}`
                          : 'Votre page n\'est pas encore accessible publiquement.'}
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        if (portfolio.settings.isPublished) {
                          await unpublishPortfolio();
                        } else {
                          await publishPortfolio();
                        }
                      }}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer ${
                        portfolio.settings.isPublished
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {portfolio.settings.isPublished ? 'Repasser en Brouillon' : 'Publier mon portfolio en ligne'}
                    </button>
                  </div>

                  {/* Public link input & buttons */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="font-mono text-xs text-slate-700 truncate max-w-md bg-white p-2.5 rounded-lg border border-slate-200">
                      {publicUrl}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copié !' : 'Copier le lien'}</span>
                      </button>
                      <button
                        onClick={() => onOpenPublicPortfolio(portfolio.user.username)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>Ouvrir la page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sharing & QR Code Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* QR Code */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 flex flex-col items-center text-center">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900">QR Code Personnalisé</h3>
                      <p className="text-xs text-slate-500">Idéal pour vos cartes de visite, CV imprimés ou présentations.</p>
                    </div>

                    {qrCodeDataUrl ? (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                        <img src={qrCodeDataUrl} alt="QR Code Portfolio" className="w-44 h-44 object-contain" />
                      </div>
                    ) : (
                      <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <QrCode className="w-12 h-12" />
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (qrCodeDataUrl) downloadQRCode(qrCodeDataUrl, portfolio.user.username);
                      }}
                      disabled={!qrCodeDataUrl}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      <span>Télécharger le QR Code (PNG)</span>
                    </button>
                  </div>

                  {/* Social share shortcuts */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-900">Partager sur vos Réseaux</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Diffusez votre portfolio en un clic auprès de vos contacts professionnels :
                      </p>

                      <div className="space-y-2.5 pt-2">
                        {/* LinkedIn */}
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                            <span>Partager sur LinkedIn</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </a>

                        {/* Twitter / X */}
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvrez mon portfolio professionnel : ${publicUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Twitter className="w-4 h-4 text-slate-900" />
                            <span>Partager sur X (Twitter)</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </a>

                        {/* WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Voici mon portfolio : ${publicUrl}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>Envoyer par WhatsApp</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                      Conseil : Intégrez ce lien dans votre signature email et dans la section contact de votre profil LinkedIn.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: CV GENERATOR */}
          {activeTab === 'cv' && (
            <CVView data={portfolio} />
          )}

          {/* TAB 14: PARAMÈTRES */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Paramètres du Compte & Configuration</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Gestion du style visuel de votre portfolio public, identifiant unique, sécurité d'accès et sauvegarde de vos données.
                </p>
              </div>

              {/* 1. Theme & Visual Style Selector */}
              <div className="p-6 md:p-7 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Style Visuel du Portfolio Public (Thème)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Basculez à tout moment entre les différentes directions artistiques pour votre page publique (<code>/#/p/{user?.username}</code>). Vos données restent inchangées.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Aperçu en direct</span>
                    </button>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Ouvrir la page</span>
                    </a>
                  </div>
                </div>

                {/* Theme Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'minimalist' as TemplateId,
                      name: 'Minimalist',
                      sub: 'Épuré & Typographique',
                      badge: 'Design Suisse',
                      idealFor: 'Auteurs, Chercheurs, Architectes',
                      desc: 'Espace généreux, esthétique monochrome épurée et mise en avant pure de vos réalisations.',
                      previewBg: 'bg-[#FDFDFC] border-stone-200',
                      previewAccent: 'bg-stone-900 text-white',
                      previewText: 'text-stone-800'
                    },
                    {
                      id: 'creative' as TemplateId,
                      name: 'Creative',
                      sub: 'Studio & Galerie',
                      badge: 'Fort Impact Visuel',
                      idealFor: 'Designers, Créatifs, Photographes',
                      desc: 'Compositions audacieuses, dégradés d\'ambiance et cartes projets visuelles haute définition.',
                      previewBg: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200',
                      previewAccent: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white',
                      previewText: 'text-indigo-900'
                    },
                    {
                      id: 'corporate' as TemplateId,
                      name: 'Corporate',
                      sub: 'Exécutif & Conseil',
                      badge: 'Standard RH / Grands Comptes',
                      idealFor: 'Consultants, Managers, Finance',
                      desc: 'Structure sobre, rigueur typographique et hiérarchie de confiance calibrée pour le recrutement.',
                      previewBg: 'bg-white border-slate-200',
                      previewAccent: 'bg-indigo-600 text-white',
                      previewText: 'text-slate-900'
                    },
                    {
                      id: 'tech' as TemplateId,
                      name: 'Tech & Console',
                      sub: 'Terminal & DevOps',
                      badge: 'Dark Mode / Code',
                      idealFor: 'Développeurs, Cloud, Ingénieurs',
                      desc: 'Palette sombre, typographie monospacée, dépôts Git et valorisation de la stack technique.',
                      previewBg: 'bg-slate-950 border-slate-800',
                      previewAccent: 'bg-emerald-500 text-slate-950 font-mono',
                      previewText: 'text-emerald-400 font-mono'
                    }
                  ].map((tpl) => {
                    const isSelected = portfolio.settings.templateId === tpl.id || 
                      (tpl.id === 'corporate' && portfolio.settings.templateId === 'professional');

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          updatePortfolio((p) => ({
                            ...p,
                            settings: { ...p.settings, templateId: tpl.id },
                          }));
                        }}
                        className={`relative rounded-xl p-4.5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        {/* Mini Visual Preview Mockup */}
                        <div className={`h-24 rounded-lg p-2.5 border flex flex-col justify-between ${tpl.previewBg}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-slate-300/80" />
                              <div className="h-1.5 w-10 bg-slate-300/80 rounded" />
                            </div>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${tpl.previewAccent}`}>
                              {tpl.name}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="h-2 w-20 bg-slate-400/60 rounded" />
                            <div className="h-1.5 w-14 bg-slate-300/60 rounded" />
                          </div>
                          <div className="flex gap-1">
                            <div className="h-2 w-6 rounded bg-slate-300/50" />
                            <div className="h-2 w-6 rounded bg-slate-300/50" />
                            <div className="h-2 w-6 rounded bg-slate-300/50" />
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-sm text-slate-900">{tpl.name}</h4>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                                <span>Actif</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400">Choisir</span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-indigo-600">{tpl.sub}</p>
                          <p className="text-xs text-slate-500 leading-snug pt-0.5">{tpl.desc}</p>
                        </div>

                        {/* Footer info */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate">{tpl.idealFor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Primary Color quick adjustment */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Couleur d'accentuation rapide :</span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { hex: '#4F46E5', name: 'Indigo' },
                        { hex: '#0D9488', name: 'Émeraude' },
                        { hex: '#2563EB', name: 'Bleu Royal' },
                        { hex: '#7C3AED', name: 'Violet' },
                        { hex: '#D97706', name: 'Ambre' },
                        { hex: '#0F172A', name: 'Ardoise' },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              settings: { ...p.settings, primaryColor: c.hex },
                            }));
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            portfolio.settings.primaryColor === c.hex ? 'scale-115 border-slate-900 shadow-xs' : 'border-white'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Modèle sélectionné : <strong className="text-slate-800 capitalize">{portfolio.settings.templateId}</strong>
                  </span>
                </div>
              </div>

              {/* 2. Slug URL customizer */}
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 max-w-xl">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Modifier votre identifiant public (slug URL)
                  </label>
                  <p className="text-xs text-slate-500">
                    Détermine l'adresse web de votre portfolio : <code>/#/p/{user?.username}</code>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">/p/</span>
                  <input
                    type="text"
                    value={newUsernameInput}
                    onChange={(e) => {
                      setNewUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                      setUsernameStatus({ checked: false });
                      setUsernameSuccess(null);
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="mon-identifiant"
                  />
                  <button
                    onClick={async () => {
                      if (!newUsernameInput || newUsernameInput === user?.username) return;
                      setUsernameSaving(true);
                      setUsernameSuccess(null);
                      try {
                        const check = await api.checkUsername(newUsernameInput, user?.id);
                        if (!check.available) {
                          setUsernameStatus({ checked: true, available: false, error: check.error || 'Cet identifiant est déjà pris.' });
                          return;
                        }
                        await updateUsername(newUsernameInput);
                        setUsernameStatus({ checked: true, available: true });
                        setUsernameSuccess('Identifiant public mis à jour !');
                      } catch (err: any) {
                        setUsernameStatus({ checked: true, available: false, error: err.message });
                      } finally {
                        setUsernameSaving(false);
                      }
                    }}
                    disabled={usernameSaving || !newUsernameInput || newUsernameInput === user?.username}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {usernameSaving ? 'Vérification...' : 'Enregistrer'}
                  </button>
                </div>

                {usernameStatus.checked && !usernameStatus.available && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{usernameStatus.error || 'Identifiant indisponible'}</span>
                  </p>
                )}

                {usernameSuccess && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{usernameSuccess}</span>
                  </p>
                )}
              </div>

              {/* 2. Password change form */}
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 max-w-xl">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Changer de Mot de Passe
                  </h3>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPasswordError(null);
                    setPasswordSuccess(null);

                    if (newPasswordInput.length < 6) {
                      setPasswordError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
                      return;
                    }
                    if (newPasswordInput !== confirmPasswordInput) {
                      setPasswordError('Les deux nouveaux mots de passe ne correspondent pas.');
                      return;
                    }

                    setPasswordLoading(true);
                    try {
                      await changePassword(currentPasswordInput, newPasswordInput);
                      setPasswordSuccess('Votre mot de passe a été modifié avec succès.');
                      setCurrentPasswordInput('');
                      setNewPasswordInput('');
                      setConfirmPasswordInput('');
                    } catch (err: any) {
                      setPasswordError(err.message || 'Erreur lors de la modification du mot de passe.');
                    } finally {
                      setPasswordLoading(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Au moins 6 caractères"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Confirmer</label>
                      <input
                        type="password"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Répéter le mot de passe"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{passwordError}</span>
                    </p>
                  )}

                  {passwordSuccess && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>{passwordSuccess}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={passwordLoading || !currentPasswordInput || !newPasswordInput}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {passwordLoading ? 'Modification...' : 'Mettre à jour le mot de passe'}
                  </button>
                </form>
              </div>

              {/* 3. Data Backup: Export & Import JSON */}
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 max-w-xl">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Sauvegarde & Restauration des Données (JSON)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Exportez l'intégralité de vos informations professionnelles pour les archiver ou les importer dans un autre compte.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* Export button */}
                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolio, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `portfolio-${portfolio.user.username}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <DownloadIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Exporter mes données</span>
                  </button>

                  {/* Import file input */}
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Restaurer depuis un fichier JSON</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                          try {
                            const parsed = JSON.parse(ev.target?.result as string);
                            if (!parsed.profile || !parsed.settings) {
                              setImportStatus({ error: 'Le fichier JSON sélectionné n\'est pas un portfolio valide.' });
                              return;
                            }
                            updatePortfolio((prev) => ({
                              ...prev,
                              profile: parsed.profile,
                              skillCategories: parsed.skillCategories || prev.skillCategories,
                              experiences: parsed.experiences || prev.experiences,
                              educations: parsed.educations || prev.educations,
                              projects: parsed.projects || prev.projects,
                              certifications: parsed.certifications || prev.certifications,
                              tools: parsed.tools || prev.tools,
                              socialLinks: parsed.socialLinks || prev.socialLinks,
                              settings: { ...prev.settings, ...parsed.settings },
                            }));
                            setImportStatus({ success: 'Données restaurées et enregistrées avec succès !' });
                          } catch (err: any) {
                            setImportStatus({ error: 'Erreur lors de la lecture du fichier JSON.' });
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>

                {importStatus?.success && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>{importStatus.success}</span>
                  </p>
                )}
                {importStatus?.error && (
                  <p className="text-xs text-red-600 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{importStatus.error}</span>
                  </p>
                )}
              </div>

              {/* 4. Danger zone: Delete Account */}
              <div className="p-6 bg-red-50/50 rounded-xl border border-red-200 space-y-4 max-w-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-red-700">
                    <UserX className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Zone de Danger · Suppression du Compte
                    </h3>
                  </div>
                  <p className="text-xs text-red-600/80 leading-relaxed">
                    La suppression de votre compte supprime définitivement toutes vos données professionnelles et votre URL publique. Cette action est irréversible.
                  </p>
                </div>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Supprimer définitivement mon compte
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-red-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirmer la suppression</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Toutes vos données (profil, projets, CV, URL @{portfolio.user.username}) seront supprimées immédiatement.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Tapez <strong className="text-red-600 font-mono">SUPPRIMER</strong> pour confirmer :
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            {deleteError && (
              <p className="text-xs text-red-600 font-medium">{deleteError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeleteError(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                disabled={deleteConfirmText !== 'SUPPRIMER' || deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  try {
                    await deleteAccount();
                    onLogout();
                  } catch (err: any) {
                    setDeleteError(err.message || 'Erreur lors de la suppression.');
                    setDeleteLoading(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {deleteLoading ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal with Device Switcher & CV Toggle */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col p-2 md:p-6">
          <div className="bg-slate-900 rounded-2xl flex flex-col flex-1 overflow-hidden shadow-2xl border border-slate-800">
            {/* Modal header with Device Switcher */}
            <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mode Aperçu</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-indigo-400">Template : {portfolio.settings.templateId}</span>

                {/* Switch between Portfolio and CV */}
                <div className="flex items-center p-0.5 bg-slate-800 rounded-lg text-xs font-semibold ml-2">
                  <button
                    onClick={() => setPreviewViewMode('portfolio')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      previewViewMode === 'portfolio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setPreviewViewMode('cv')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      previewViewMode === 'cv' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CV (A4)
                  </button>
                </div>
              </div>

              {/* Device Selector (Desktop, Tablet, Mobile) */}
              {previewViewMode === 'portfolio' && (
                <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Ordinateur de bureau"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Tablette (768px)"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md transition-colors ${
                      previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Mobile (375px)"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenPublicPortfolio(portfolio.user.username)}
                  className="text-xs font-bold text-white hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Ouvrir dans un nouvel onglet</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal body with device container */}
            <div className="flex-1 overflow-y-auto bg-slate-950/60 p-2 md:p-6 flex justify-center items-start">
              {previewViewMode === 'cv' ? (
                <div className="w-full max-w-4xl bg-white rounded-xl p-4 overflow-x-auto">
                  <CVView data={portfolio} />
                </div>
              ) : (
                <div
                  className={`bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    previewDevice === 'mobile'
                      ? 'w-[375px] min-h-[667px] border-8 border-slate-800 rounded-3xl'
                      : previewDevice === 'tablet'
                      ? 'w-[768px] min-h-[1024px] border-8 border-slate-800 rounded-2xl'
                      : 'w-full'
                  }`}
                >
                  <TemplateEngine data={portfolio} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
