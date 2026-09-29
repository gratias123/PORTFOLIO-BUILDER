import React, { useState } from 'react';
import { 
  ArrowRight, Check, Sparkles, Globe, FileText, Palette, 
  Layers, Shield, Laptop, Smartphone, Eye, Download,
  ShieldCheck, QrCode, Lock, ArrowUpRight, Menu, X, ChevronRight,
  Sliders, Share2, FileDown, Copy, Clock, Zap, CheckCircle2, UserCheck, CheckCheck,
  Monitor, Briefcase, Code2, RefreshCw
} from 'lucide-react';
import { FaqAccordion } from './FaqAccordion';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [selectedTemplateTab, setSelectedTemplateTab] = useState<'professional' | 'creative' | 'tech'>('professional');
  const [templateDevice, setTemplateDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [demoThemeColor, setDemoThemeColor] = useState<'indigo' | 'emerald' | 'violet' | 'amber'>('indigo');
  const [demoTemplate, setDemoTemplate] = useState<'professional' | 'creative' | 'tech'>('professional');
  const [copiedLink, setCopiedLink] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-[#EEF2FF] selection:text-[#4F46E5] antialiased">
      {/* 3-Zone Top Bar with refined glassmorphism, accent gradient top border, and high-end visual appeal */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
        {/* Subtle accent highlight line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-600/70 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[70px] flex items-center justify-between gap-4">
          {/* Zone 1: Premium Brand Mark & Logo */}
          <a
            href="#/"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-[1px] shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Portfolio<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Builder</span>
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-600 font-medium -mt-1 tracking-wide">
                Générateur de portfolios & CV
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links with polished hover interactions */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-slate-100/70 border border-slate-200/60 backdrop-blur-sm text-xs font-semibold text-slate-600">
            <a 
              href="#comment-ca-marche" 
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-white hover:shadow-2xs transition-all duration-200"
            >
              Fonctionnement
            </a>
            <a 
              href="#modeles" 
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-white hover:shadow-2xs transition-all duration-200"
            >
              Modèles
            </a>
            <a 
              href="#cv" 
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-white hover:shadow-2xs transition-all duration-200 inline-flex items-center gap-1.5"
            >
              <span>CV A4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </a>
            <a 
              href="#faq" 
              className="px-3 py-1.5 rounded-full hover:text-slate-900 hover:bg-white hover:shadow-2xs transition-all duration-200"
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: Actions & CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 sm:px-3.5 py-2 rounded-lg hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              Connexion
            </button>
            <button
              onClick={() => onNavigate('/register')}
              className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span>Créer mon portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
              <a
                href="#comment-ca-marche"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>Fonctionnement</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#modeles"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>Modèles</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#cv"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>Générateur CV A4</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>FAQ</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/login');
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/register');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>Créer mon portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] text-balance max-w-4xl mx-auto">
            Créez votre portfolio professionnel.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Présentez vos compétences, votre parcours et vos projets dans un portfolio moderne que vous pouvez personnaliser et publier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Créer mon portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#modeles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg border border-slate-200 transition-colors"
            >
              <span>Voir les modèles</span>
            </a>
          </div>

          {/* Hero Showcase Visual */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-900">
              <img
                src="/src/assets/images/hero_portfolio_mockup_1790710305900.jpg"
                alt="Interface Portfolio Builder"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça fonctionne (SaaS Interactive Workflow) */}
      <section id="comment-ca-marche" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>Workflow en 3 étapes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            De votre parcours brut à un portfolio d'exception
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Fini les journées perdues à configurer un hébergement ou à batailler avec le design. Un processus fluide et guidé pour briller auprès des recruteurs et clients.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-500 pt-1">
            <span>⏱️ Moins de 5 minutes</span>
            <span aria-hidden="true">·</span>
            <span>⚡ 0 ligne de code</span>
            <span aria-hidden="true">·</span>
            <span>📄 CV A4 généré en continu</span>
          </div>
        </div>

        {/* Interactive Step Switcher (Segmented SaaS Control) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 max-w-4xl mx-auto">
          {[
            {
              step: 0,
              num: '01',
              title: 'Renseignez votre profil',
              sub: 'Formulaire guidé & modulaire',
              icon: UserCheck
            },
            {
              step: 1,
              num: '02',
              title: 'Personnalisez le design',
              sub: 'Thèmes & typographies en direct',
              icon: Sliders
            },
            {
              step: 2,
              num: '03',
              title: 'Publiez & partagez',
              sub: 'Lien public & export CV A4',
              icon: Share2
            }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(item.step)}
                className={`relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-white shadow-sm border border-slate-200/90 text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-200/70 text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-600 font-mono tracking-wider">{item.num}</span>
                    <span className="text-xs sm:text-sm font-bold truncate text-slate-900">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.sub}</p>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Step Detail Stage with Interactive Simulator */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10">
          {activeStep === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: SaaS Narrative & Value */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Étape 01 — Saisie sans friction</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Renseignez vos accomplissements sans vous soucier de la mise en page
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed pt-1">
                    Notre assistant organise vos expériences professionnelles, projets phares, diplômes et compétences techniques dans une structure prête pour les algorithmes de recrutement et la lecture humaine.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    'Formulaire intelligent avec pré-remplissage et autosave local',
                    'Chaque champ est optionnel : masquez ce que vous voulez en 1 clic',
                    'Gestion automatique des dates, durées et technologies utilisées'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs text-slate-700 font-medium leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/register')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 group cursor-pointer"
                  >
                    <span>Commencer avec ce modèle guidé</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Profile Simulator */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-white text-sm">
                      AD
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        Alexandre Dupont
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </h4>
                      <p className="text-xs text-slate-400">Lead Développeur Full-Stack & Architecture Cloud</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Complétion</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">95% prêt</span>
                  </div>
                </div>

                {/* Progress Gauge */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-5">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[95%] transition-all duration-500" />
                </div>

                {/* Simulated Interactive Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Dernière expérience</span>
                    <p className="text-xs font-semibold text-slate-200">Tech Lead · Qonto</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">2022 — Présent · Paris</p>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Projet vedette</span>
                    <p className="text-xs font-semibold text-slate-200">Plateforme FinTech Microservices</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">150k requêtes/sec · Go & React</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/40">
                  <span className="text-[10px] font-mono text-slate-400 block mb-2">Compétences & Outils (Tags dynamiques)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AWS'].map((tag) => (
                      <span key={tag} className="text-[11px] font-mono px-2 py-1 rounded bg-slate-700/80 text-slate-200 border border-slate-600/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Style narrative */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Étape 02 — Identité de marque</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Changez de style en 1 clic selon votre secteur d'activité
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed pt-1">
                    Choisissez parmi nos trois modèles signatures conçus par des directeurs artistiques. Changez instantanément la teinte principale et les polices sans retoucher au contenu.
                  </p>
                </div>

                {/* Interactive Controls in the description */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Palette interactive (Testez en direct) :</label>
                    <div className="flex items-center gap-2">
                      {[
                        { id: 'indigo', name: 'Indigo Royal', bg: 'bg-indigo-600' },
                        { id: 'emerald', name: 'Émeraude Pro', bg: 'bg-emerald-600' },
                        { id: 'violet', name: 'Violet Studio', bg: 'bg-violet-600' },
                        { id: 'amber', name: 'Ambre Moderne', bg: 'bg-amber-600' }
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setDemoThemeColor(c.id as any)}
                          className={`w-8 h-8 rounded-full ${c.bg} transition-transform flex items-center justify-center cursor-pointer ${
                            demoThemeColor === c.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105 opacity-80'
                          }`}
                          title={c.name}
                        >
                          {demoThemeColor === c.id && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-700 block mb-2">Modèle de présentation :</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'professional', label: 'Professionnel' },
                        { id: 'creative', label: 'Créatif' },
                        { id: 'tech', label: 'Tech / Développeur' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setDemoTemplate(t.id as any)}
                          className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                            demoTemplate === t.id 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#modeles"
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 group cursor-pointer"
                  >
                    <span>Explorer la galerie complète des thèmes</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Column: Live Responsive Theme Preview Simulator */}
              <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-inner">
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300">
                  {/* Fake Browser Toolbar */}
                  <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                      portfolio-builder.com/p/alexandre
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {demoTemplate}
                    </span>
                  </div>

                  {/* Simulated Portfolio Header */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          demoThemeColor === 'indigo' ? 'text-indigo-600' :
                          demoThemeColor === 'emerald' ? 'text-emerald-600' :
                          demoThemeColor === 'violet' ? 'text-violet-600' : 'text-amber-600'
                        }`}>
                          Disponible pour de nouvelles opportunités
                        </span>
                        <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Alexandre Dupont
                        </h4>
                        <p className="text-xs text-slate-600 max-w-sm">
                          Conception de produits digitaux scalables et direction technique pour startups ambitieuses.
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl text-white font-black flex items-center justify-center shadow-md transition-colors ${
                        demoThemeColor === 'indigo' ? 'bg-indigo-600 shadow-indigo-500/25' :
                        demoThemeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-500/25' :
                        demoThemeColor === 'violet' ? 'bg-violet-600 shadow-violet-500/25' : 'bg-amber-600 shadow-amber-500/25'
                      }`}>
                        AD
                      </div>
                    </div>

                    {/* Dynamic Action Buttons on Preview */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-colors ${
                        demoThemeColor === 'indigo' ? 'bg-indigo-600' :
                        demoThemeColor === 'emerald' ? 'bg-emerald-600' :
                        demoThemeColor === 'violet' ? 'bg-violet-600' : 'bg-amber-600'
                      }`}>
                        Me contacter
                      </span>
                      <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg">
                        Télécharger CV
                      </span>
                    </div>

                    {/* Simulated Cards inside theme */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Expérience</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">8+ ans d'expertise</p>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Projets livrés</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">24 produits en prod</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Publish & Share value */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Étape 03 — Diffusion maximale</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Partagez votre lien public et exportez votre CV PDF A4 en 1 clic
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed pt-1">
                    Votre portfolio est instantanément accessible via une URL propre et partageable. Vos données alimentent également une mise en page CV au standard A4 parfaite pour les candidatures formelles.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    'URL personnelle indexable (ex: /p/votre-nom) sans publicité',
                    'Exportation PDF haute définition adaptée aux ATS et recruteurs',
                    'QR Code généré automatiquement à insérer sur vos cartes de visite'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs text-slate-700 font-medium leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/register')}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    Obtenir mon lien public maintenant
                  </button>
                </div>
              </div>

              {/* Right Column: Live Public Share Hub Simulator */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                {/* Active Link Box with Copy Button */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Votre lien public en ligne :</span>
                    <span className="text-emerald-600 flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Statut : En ligne
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-mono font-medium text-slate-800 truncate flex-1">
                      https://portfolio-builder.com/p/alexandre-dupont
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCopiedLink(true);
                        navigator.clipboard?.writeText('https://portfolio-builder.com/p/alexandre-dupont');
                        setTimeout(() => setCopiedLink(false), 2500);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Two Action Cards: CV Download & QR code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <FileDown className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">Format CV A4 Prêt à imprimer</h5>
                    <p className="text-[11px] text-slate-500">Mise en page optimisée 1 page, sans découpe hasardeuse, idéale pour les RH.</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                      PDF vectoriel haute fidélité
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">QR Code de profil intégré</h5>
                    <p className="text-[11px] text-slate-500">Scannable immédiatement sur mobile pour conférences et entretiens physiques.</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                      Généré sans configuration
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3 Pillars of SaaS Excellence (Value Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Zéro technique, 100% de résultat</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pas de Git, pas de CSS à déboguer, pas d'hébergeur à payer. Concentrez-vous sur ce qui compte : raconter votre impact.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Rendu Retina & Mobile First</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos projets et parcours s'affichent avec fluidité sur tous les écrans d'iPhone, Android, tablettes et moniteurs 4K.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Mises à jour instantanées</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Une nouvelle certification ou un projet terminé ? Mettez à jour votre tableau de bord, votre portfolio en ligne reflète le changement sans délai.
            </p>
          </div>
        </div>
      </section>

      {/* Templates Showcase — Studio & Architectures Visuelles */}
      <section id="modeles" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200/80 rounded-full text-indigo-700 text-xs font-bold tracking-wide shadow-2xs">
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            <span className="uppercase tracking-widest text-[11px]">Architectures Visuelles & Design Systems</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Trois directions esthétiques taillées pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">donner l'avantage</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Chaque modèle intègre sa propre psychologie de conversion et son système typographique. Vos données restent centralisées : basculez d'un univers à l'autre en un clic sans jamais perdre une virgule.
          </p>

          {/* Value indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/70 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              100% Responsive & Écrans Retina
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/70 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Score ATS maximal sur le CV A4 lié
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/70 text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Rendu 60 FPS sans code à écrire
            </span>
          </div>
        </div>

        {/* Interactive Architecture Selector Tabs */}
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 max-w-3xl w-full shadow-inner">
            {[
              { 
                id: 'professional' as const, 
                label: '01. Exécutif & Pro', 
                subtitle: 'Cadres, Direction & Conseil', 
                icon: Briefcase,
                colorBadge: 'bg-indigo-600'
              },
              { 
                id: 'creative' as const, 
                label: '02. Studio Créatif', 
                subtitle: 'Designers, DA & Créatifs', 
                icon: Palette,
                colorBadge: 'bg-rose-500'
              },
              { 
                id: 'tech' as const, 
                label: '03. Ingénierie & Tech', 
                subtitle: 'Devs, Cloud & Ingénieurs', 
                icon: Code2,
                colorBadge: 'bg-emerald-500'
              },
            ].map((t) => {
              const TabIcon = t.icon;
              const isActive = selectedTemplateTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplateTab(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left relative ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-200/60 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200/80 text-slate-500'
                  }`}>
                    <TabIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate text-slate-900">
                      {t.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate font-medium">
                      {t.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Device Toggle */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-400">Simulation d'affichage :</span>
            <button
              onClick={() => setTemplateDevice('desktop')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer text-xs ${
                templateDevice === 'desktop'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setTemplateDevice('mobile')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors cursor-pointer text-xs ${
                templateDevice === 'mobile'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Showcase Studio Card (Grid Split) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Column: Strategic Advantages & Copy */}
          <div className="lg:col-span-5 space-y-6">
            {selectedTemplateTab === 'professional' && (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200/80 text-indigo-700 rounded-full text-xs font-extrabold">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Cadres · Management · Conseil & B2B</span>
                </div>
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    The Executive Blueprint
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Un design rigoureux et structuré qui valorise votre leadership, la progression logique de vos postes et vos réalisations chiffrées. Conçu selon les grilles de lecture des comités de direction et cabinets de recrutement.
                  </p>
                </div>

                {/* 4 Strategic Pillars */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Chronologie de carrière continue :</strong>
                      <span className="text-slate-500">Postes, responsabilités clés et résultats d'entreprise sans surcharge inutile.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Matrice de compétences pondérée :</strong>
                      <span className="text-slate-500">Organisation par domaine fonctionnel avec niveaux clairs et éprouvés.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Certifications officielles vérifiables :</strong>
                      <span className="text-slate-500">Mise en avant immédiate des accréditations, écoles et MBA.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Boutons de prise de contact direct :</strong>
                      <span className="text-slate-500">Appel direct, profil LinkedIn et téléchargement instantané du CV format A4.</span>
                    </div>
                  </div>
                </div>

                {/* Design Tokens Pill */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Fonderie : <strong>Plus Jakarta Sans</strong></span>
                  <span className="text-slate-400">·</span>
                  <span>Harmonie : <strong>Corporate Clean</strong></span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-600 font-bold">Score ATS : 99%</span>
                </div>
              </div>
            )}

            {selectedTemplateTab === 'creative' && (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200/80 text-rose-700 rounded-full text-xs font-extrabold">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Product Designers · Graphistes · Directeurs Artistiques</span>
                </div>
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    The Creative Canvas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Une esthétique éditoriale immersive où vos maquettes, illustrations et études de cas sont les héros. Conçu pour retenir l'œil des agences, studios de design et marques exigeantes.
                  </p>
                </div>

                {/* 4 Strategic Pillars */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Galerie de projets haute définition :</strong>
                      <span className="text-slate-500">Aperçus visuels grand format, captures léchées et tags de concepts créatifs.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Manifeste & Démarche de design :</strong>
                      <span className="text-slate-500">Espace dédié pour raconter votre vision artistique et votre méthodologie de projet.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Typographie de caractère :</strong>
                      <span className="text-slate-500">Titres percutants en Cabinet Grotesk pour une identité forte et mémorable.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Boîte à outils créative :</strong>
                      <span className="text-slate-500">Badges visuels pour Figma, Suite Adobe, Blender, Motion & Webflow.</span>
                    </div>
                  </div>
                </div>

                {/* Design Tokens Pill */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Fonderie : <strong>Cabinet Grotesk</strong></span>
                  <span className="text-slate-400">·</span>
                  <span>Harmonie : <strong>Editorial Modern</strong></span>
                  <span className="text-slate-400">·</span>
                  <span className="text-rose-600 font-bold">Impact Visuel : 10/10</span>
                </div>
              </div>
            )}

            {selectedTemplateTab === 'tech' && (
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 rounded-full text-xs font-extrabold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Devs Fullstack · DevOps · Data Scientists · Lead Tech</span>
                </div>
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    The Developer Terminal
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Inspiré des meilleurs environnements de développement et consoles CLI. Conçu pour mettre en avant votre stack technique, vos dépôts GitHub et la réalité de vos réalisations logicielles.
                  </p>
                </div>

                {/* 4 Strategic Pillars */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Header typé console de commande :</strong>
                      <span className="text-slate-500">Ambiance sombre contemporaine avec prompt interactif et métriques système.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Stack technique compartimentée :</strong>
                      <span className="text-slate-500">Distinction nette entre Frontend, Backend, Base de données et DevOps.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Accès direct aux dépôts & Démos :</strong>
                      <span className="text-slate-500">Liens GitHub en un clic, stacks des projets et boutons de démo en direct.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="font-bold text-slate-900 block">Typographie technique monospace :</strong>
                      <span className="text-slate-500">Police IBM Plex Mono pour une lisibilité parfaite du code et des architectures.</span>
                    </div>
                  </div>
                </div>

                {/* Design Tokens Pill */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Fonderie : <strong>IBM Plex Mono</strong></span>
                  <span className="text-slate-400">·</span>
                  <span>Harmonie : <strong>Dark Console</strong></span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-600 font-bold">Lighthouse : 100/100</span>
                </div>
              </div>
            )}

            {/* Action CTA with Guarantee */}
            <div className="pt-2 space-y-3">
              <button
                onClick={() => onNavigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer group"
              >
                <span>Adopter ce modèle pour mon profil</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Aucune carte bancaire requise · Prêt en moins de 3 minutes</span>
              </p>
            </div>
          </div>

          {/* Right Column: Realistic Browser / Device Studio Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            {templateDevice === 'desktop' ? (
              /* Desktop Mac Window Mockup */
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900 transition-all duration-300">
                {/* Browser Header Bar */}
                <div className="h-10 bg-slate-800/90 border-b border-slate-700/60 px-4 flex items-center justify-between gap-3 text-slate-400 text-xs">
                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                  </div>

                  {/* Browser URL bar */}
                  <div className="flex-1 max-w-sm mx-auto h-6 bg-slate-900/80 rounded-md border border-slate-700/60 px-2.5 flex items-center justify-between gap-2 text-[11px] font-mono text-slate-300 truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        portfoliobuilder.pro/p/{
                          selectedTemplateTab === 'professional' ? 'alexandre-dubois' :
                          selectedTemplateTab === 'creative' ? 'chloe-valentin' : 'lucas-dev'
                        }
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-400 uppercase font-bold shrink-0 tracking-wider">SSL · 60fps</span>
                  </div>

                  {/* Right Browser Action */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span className="hidden sm:inline font-sans text-[10px]">Aperçu HD</span>
                  </div>
                </div>

                {/* Screenshot Container with floating badge */}
                <div className="relative group overflow-hidden bg-slate-950">
                  <img
                    src={
                      selectedTemplateTab === 'professional'
                        ? '/src/assets/images/preview_professional_1790710316199.jpg'
                        : selectedTemplateTab === 'creative'
                        ? '/src/assets/images/preview_creative_1790710325937.jpg'
                        : '/src/assets/images/preview_tech_1790710338057.jpg'
                    }
                    alt={`Aperçu du modèle ${selectedTemplateTab}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover max-h-[440px] transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Floating Advantage Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-white shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      {selectedTemplateTab === 'professional' ? <Briefcase className="w-4 h-4" /> :
                       selectedTemplateTab === 'creative' ? <Palette className="w-4 h-4" /> :
                       <Code2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-100 flex items-center gap-1.5">
                        <span>
                          {selectedTemplateTab === 'professional' ? 'Optimisé pour convaincre les recruteurs' :
                           selectedTemplateTab === 'creative' ? 'Mise en page éditoriale de haute précision' :
                           'Architecture terminal axée sur la stack réelle'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Synchronisé avec le générateur de CV A4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Device Frame Mockup */
              <div className="w-full max-w-[280px] rounded-[36px] overflow-hidden border-[6px] border-slate-800 shadow-2xl bg-slate-900">
                {/* Mobile Speaker / Camera Notch */}
                <div className="h-6 bg-slate-900 flex items-center justify-center">
                  <div className="w-16 h-3.5 bg-black rounded-full" />
                </div>

                {/* Mobile Content */}
                <div className="relative overflow-hidden bg-slate-950">
                  <img
                    src={
                      selectedTemplateTab === 'professional'
                        ? '/src/assets/images/preview_professional_1790710316199.jpg'
                        : selectedTemplateTab === 'creative'
                        ? '/src/assets/images/preview_creative_1790710325937.jpg'
                        : '/src/assets/images/preview_tech_1790710338057.jpg'
                    }
                    alt={`Aperçu mobile ${selectedTemplateTab}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover max-h-[460px]"
                  />
                  <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-center text-white">
                    <span className="text-[10px] font-bold text-slate-300 block">Rendu Mobile First Réactif</span>
                    <span className="text-[9px] text-slate-500 font-mono">Affichage fluide sur iPhone & Android</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3 Comparative Cards — Direct Visual Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[
            {
              id: 'professional' as const,
              name: 'Modèle Professionnel',
              image: '/src/assets/images/preview_professional_1790710316199.jpg',
              target: 'Cadres, Directeurs, Consultants',
              font: 'Plus Jakarta Sans',
              advantage: 'Clarté absolue du parcours & impact RH immédiat',
              icon: Briefcase,
              accentColor: 'indigo'
            },
            {
              id: 'creative' as const,
              name: 'Modèle Créatif',
              image: '/src/assets/images/preview_creative_1790710325937.jpg',
              target: 'Designers, Graphistes, Directeurs Artistiques',
              font: 'Cabinet Grotesk',
              advantage: 'Galerie de réalisations visuelles grand format',
              icon: Palette,
              accentColor: 'rose'
            },
            {
              id: 'tech' as const,
              name: 'Modèle Tech',
              image: '/src/assets/images/preview_tech_1790710338057.jpg',
              target: 'Devs Fullstack, DevOps, Data & Cloud',
              font: 'IBM Plex Mono',
              advantage: 'Console sombre, badges de stack et repos GitHub',
              icon: Code2,
              accentColor: 'emerald'
            },
          ].map((card) => {
            const CardIcon = card.icon;
            const isSelected = selectedTemplateTab === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedTemplateTab(card.id)}
                className={`bg-white rounded-2xl border p-5 space-y-4 cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/10'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Header of card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <CardIcon className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{card.name}</h4>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      Actif
                    </span>
                  )}
                </div>

                {/* Miniature Thumbnail */}
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100 relative group">
                  <img
                    src={card.image}
                    alt={card.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-mono text-white font-semibold">
                      Police : {card.font}
                    </span>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Idéal pour : <strong className="text-slate-800">{card.target}</strong>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    {card.advantage}
                  </div>
                </div>

                {/* Select button */}
                <div className="pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplateTab(card.id);
                    }}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Sélectionné dans le studio' : 'Inspecter ce modèle'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Zero Lock-in Assurance Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Garantie Liberté & Découplage Total</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Vous hésitez encore ? Changez de thème à tout instant sans ressaisir vos données.
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Vos expériences, compétences et projets restent stockés de manière universelle. Vous pouvez tester le style Professionnel aujourd'hui pour un entretien en cabinet, puis basculer en Créatif ou Tech le soir même en un clic.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/register')}
            className="shrink-0 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <span>Créer mon profil gratuitement</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
          </button>
        </div>
      </section>

      {/* CV Generation Spotlight */}
      <section id="cv" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-indigo-50/60 to-slate-50 p-8 md:p-12 rounded-3xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-md">
                <FileText className="w-3.5 h-3.5" />
                <span>Format A4 Imprimable</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Votre CV créé sans double saisie
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toutes les informations que vous renseignez pour votre portfolio sont instantanément mises en page pour générer un CV au format standard A4. Choisissez entre une version synthétique d'une page ou une version complète, prête pour export PDF (CV-[Nom]-[Prénom].pdf).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/register')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tester le générateur de CV</span>
                </button>
              </div>
            </div>

            <div className="w-full md:w-72 bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-3 font-sans">
              <div className="w-12 h-1 bg-indigo-600 rounded" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
              <div className="h-2 bg-slate-100 rounded w-1/2" />
              <div className="pt-2 space-y-1.5">
                <div className="h-2 bg-slate-100 rounded" />
                <div className="h-2 bg-slate-100 rounded w-5/6" />
                <div className="h-2 bg-slate-100 rounded w-4/6" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>A4 · 210 × 297 mm</span>
                <span className="text-emerald-600 font-bold">Vectoriel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-4xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Questions Fréquentes</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Foire aux questions
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Trouvez rapidement toutes les réponses à propos de la gestion de votre profil, des modèles et de vos exports.
          </p>
        </div>

        <FaqAccordion />
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Prêt à valoriser votre parcours professionnel ?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Rejoignez Portfolio Builder et créez un portfolio élégant et un CV au format PDF en quelques minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <span>Créer mon portfolio gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand & Tagline */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm text-sm">
                  PB
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  Portfolio Builder
                </span>
              </div>
              <span className="hidden sm:inline text-slate-700">|</span>
              <p className="text-xs text-slate-400">
                Créez, personnalisez et publiez votre portfolio professionnel et CV en quelques minutes.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 text-xs">
              <button 
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 font-medium transition-colors cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => onNavigate('/register')}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer text-xs shadow-xs"
              >
                Créer mon portfolio
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} <strong className="text-slate-400 font-normal">Portfolio Builder</strong>. Tous droits réservés.
            </p>
            <p className="text-[11px] text-slate-600">
              Conçu pour freelances, développeurs & créateurs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
