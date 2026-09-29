import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, Search, HelpCircle, Layers, FileText, 
  ShieldCheck, Sparkles, Check 
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'general' | 'templates' | 'cv' | 'security';
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'Dois-je savoir coder pour utiliser Portfolio Builder ?',
    answer: 'Absolument pas. Vous remplissez vos informations dans une interface structurée et intuitive. Le système génère automatiquement votre site web moderne et votre CV au format PDF A4 en temps réel, sans aucune ligne de code requise.',
  },
  {
    id: 'faq-2',
    category: 'templates',
    question: 'Puis-je changer de modèle sans perdre mes données saisies ?',
    answer: 'Oui, à tout moment et instantanément. L\'architecture de Portfolio Builder sépare rigoureusement vos données de contenu du moteur graphique. Vous pouvez basculer entre le style Professionnel, Créatif et Tech en un clic sans risque de perte ni besoin de ressaisie.',
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Comment fonctionne l\'URL publique de mon portfolio ?',
    answer: 'Chaque compte utilisateur dispose d\'un identifiant public unique (slug). Votre portfolio est immédiatement accessible sans authentification requise à l\'adresse personnalisée de votre choix (ex: /#/p/votre-nom), idéale pour vos profils LinkedIn, candidatures ou cartes de visite.',
  },
  {
    id: 'faq-4',
    category: 'cv',
    question: 'Comment est généré et exporté le CV PDF ?',
    answer: 'Votre CV au format A4 est compilé directement à partir des informations déjà enregistrées dans votre portfolio. Vous pouvez prévisualiser la mise en page, basculer entre version synthétique (1 page) ou détaillée, et l\'exporter instantanément en PDF prêt à l\'emploi pour vos recruteurs.',
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'Mes données sont-elles sécurisées et privées ?',
    answer: 'Oui. Tant que vous n\'activez pas expressément le commutateur de diffusion publique, votre portfolio reste strictement en mode brouillon privé, accessible uniquement via votre session sécurisée. Vous gardez le contrôle total de vos publications et pouvez dépublier à tout moment.',
  },
  {
    id: 'faq-6',
    category: 'templates',
    question: 'Le portfolio est-il adapté aux smartphones et tablettes ?',
    answer: 'Oui, chaque modèle a été conçu selon les règles du responsive design moderne. Qu\'un recruteur consulte votre lien sur mobile, tablette ou écran 4K, la mise en page, la typographie et la galerie de projets s\'adaptent avec fluidité.',
  },
  {
    id: 'faq-7',
    category: 'general',
    question: 'Puis-je sauvegarder et exporter toutes mes données ?',
    answer: 'Oui, un outil de sauvegarde complet en format JSON est disponible dans les paramètres. Vous pouvez télécharger une archive complète de votre profil et de vos projets en un clic, ou la réimporter ultérieurement.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Toutes les questions', icon: Sparkles },
  { id: 'general', label: 'Général', icon: HelpCircle },
  { id: 'templates', label: 'Modèles & Design', icon: Layers },
  { id: 'cv', label: 'Génération CV', icon: FileText },
  { id: 'security', label: 'Sécurité & Accès', icon: ShieldCheck },
] as const;

export const FaqAccordion: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['faq-1']));

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const areAllExpanded = filteredFaqs.length > 0 && filteredFaqs.every((f) => openIds.has(f.id));

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      setOpenIds(new Set());
    } else {
      setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Global Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Real-time search filter */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
          />
        </div>

        {/* Category Pills & Expand/Collapse All */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={toggleExpandAll}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-lg transition-colors cursor-pointer border border-slate-200/80 bg-white"
          >
            {areAllExpanded ? 'Tout replier' : 'Tout déplier'}
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion Container */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Aucune question correspondante</p>
            <p className="text-xs text-slate-500">Essayez de modifier votre mot-clé de recherche.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredFaqs.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-200 shadow-md ring-1 ring-indigo-500/10'
                    : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 flex items-center justify-between text-left gap-4 cursor-pointer select-none transition-colors group"
                >
                  <span className={`text-sm font-bold transition-colors ${
                    isOpen ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'
                  }`}>
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-indigo-50 text-indigo-600 rotate-180'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth Expand/Collapse Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
