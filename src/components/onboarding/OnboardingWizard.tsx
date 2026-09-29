import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TemplateEngine } from '../templates/TemplateEngine';
import { 
  User as UserIcon, Sparkles, Code2, Briefcase, GraduationCap, 
  FolderGit2, Award, Share2, Palette, Sliders, Eye, Send, 
  ChevronRight, ChevronLeft, Save, Check, Plus, Trash2 
} from 'lucide-react';
import { TemplateId, ButtonStyle, FontPreset } from '../../types/portfolio';

interface OnboardingWizardProps {
  onComplete: () => void;
  onExit: () => void;
}

const STEPS = [
  { id: 1, label: 'Profil', icon: UserIcon, desc: 'Identité et coordonnées professionnelles' },
  { id: 2, label: 'Parcours', icon: Sparkles, desc: 'Courte présentation et biographie' },
  { id: 3, label: 'Compétences', icon: Code2, desc: 'Expertises et savoir-faire' },
  { id: 4, label: 'Expériences', icon: Briefcase, desc: 'Postes occupés et réalisations' },
  { id: 5, label: 'Formations', icon: GraduationCap, desc: 'Diplômes et parcours académique' },
  { id: 6, label: 'Projets', icon: FolderGit2, desc: 'Vos créations et réalisations' },
  { id: 7, label: 'Certifications', icon: Award, desc: 'Diplômes pro et attestations' },
  { id: 8, label: 'Réseaux', icon: Share2, desc: 'Liens vers vos profils publics' },
  { id: 9, label: 'Modèle', icon: Palette, desc: 'Choix de votre template initial' },
  { id: 10, label: 'Apparence', icon: Sliders, desc: 'Couleur, typographie et boutons' },
  { id: 11, label: 'Aperçu', icon: Eye, desc: 'Vérification du résultat en direct' },
  { id: 12, label: 'Publication', icon: Send, desc: 'Mise en ligne de votre portfolio' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onExit }) => {
  const { portfolio, updatePortfolio, saveNow, isSaving } = usePortfolio();
  const [currentStep, setCurrentStep] = useState<number>(portfolio?.onboarding.currentStep || 1);

  if (!portfolio) return null;

  const totalSteps = STEPS.length;
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      updatePortfolio((prev) => ({
        ...prev,
        onboarding: {
          ...prev.onboarding,
          currentStep: next,
          completedSteps: Array.from(new Set([...prev.onboarding.completedSteps, currentStep])),
        },
      }));
    } else {
      updatePortfolio((prev) => ({
        ...prev,
        onboarding: {
          ...prev.onboarding,
          isCompleted: true,
          completedSteps: Array.from(new Set([...prev.onboarding.completedSteps, 12])),
        },
      }));
      saveNow();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = async () => {
    await saveNow();
    onExit();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-900 tracking-tight">Portfolio Builder</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Parcours guidé · Étape {currentStep} sur {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAndExit}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>Sauvegarder et quitter</span>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="max-w-5xl mx-auto mt-3">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Step Card */}
      <main className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 md:p-10 space-y-8">
          {/* Step Title Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Étape {currentStep} · {STEPS[currentStep - 1].label}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {STEPS[currentStep - 1].desc}
              </h2>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              {React.createElement(STEPS[currentStep - 1].icon, { className: 'w-6 h-6' })}
            </div>
          </div>

          {/* Step Form Body */}
          <div className="space-y-6">
            {/* Step 1: Profil */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Prénom</label>
                  <input
                    type="text"
                    placeholder="Ex : Alex"
                    value={portfolio.profile.firstName}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, firstName: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nom</label>
                  <input
                    type="text"
                    placeholder="Ex : Dupont"
                    value={portfolio.profile.lastName}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, lastName: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Titre professionnel</label>
                  <input
                    type="text"
                    placeholder="Ex : Développeur Full-Stack & Consultant Cloud"
                    value={portfolio.profile.professionalTitle}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, professionalTitle: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Localisation</label>
                  <input
                    type="text"
                    placeholder="Ex : Paris, France / Télétravail"
                    value={portfolio.profile.location}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, location: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email professionnel</label>
                  <input
                    type="email"
                    placeholder="Ex : contact@example.com"
                    value={portfolio.profile.email}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, email: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Téléphone (facultatif)</label>
                  <input
                    type="tel"
                    placeholder="Ex : +33 6 00 00 00 00"
                    value={portfolio.profile.phone}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, phone: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">URL photo de profil (facultatif)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={portfolio.profile.photoUrl}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, photoUrl: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Parcours */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Présentation courte (1 à 2 phrases)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Ingénieur passionné par la conception de produits numériques performants et évolutifs."
                    value={portfolio.profile.shortPresentation}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, shortPresentation: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Biographie détaillée
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Décrivez votre vision, votre parcours, vos points forts et ce qui vous motive..."
                    value={portfolio.profile.bio}
                    onChange={(e) => updatePortfolio((p) => ({ ...p, profile: { ...p.profile, bio: e.target.value } }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-indigo-600 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Compétences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-xs text-slate-500">
                  Organisez vos compétences par catégories. Vous pouvez ajouter des compétences spécifiques dans chaque domaine.
                </p>
                {portfolio.skillCategories.map((cat, catIdx) => (
                  <div key={cat.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
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
                        className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none"
                      />
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
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cat.skills.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Aucune compétence ajoutée dans cette catégorie.</span>
                      ) : (
                        cat.skills.map((skill, sIdx) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs"
                          >
                            <span>{skill.name}</span>
                            <button
                              onClick={() => {
                                updatePortfolio((p) => ({
                                  ...p,
                                  skillCategories: p.skillCategories.map((c, i) =>
                                    i === catIdx
                                      ? { ...c, skills: c.skills.filter((_, idx) => idx !== sIdx) }
                                      : c
                                  ),
                                }));
                              }}
                              className="text-slate-400 hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Expériences */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Ajoutez vos postes et réalisations marquantes.</p>
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
                            isCurrent: true,
                            description: '',
                          },
                        ],
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une expérience</span>
                  </button>
                </div>

                {portfolio.experiences.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Aucune expérience renseignée. Cliquez sur "Ajouter une expérience" pour commencer.
                  </div>
                ) : (
                  portfolio.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expérience #{idx + 1}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              experiences: p.experiences.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Intitulé du poste (ex : Lead Développeur)"
                          value={exp.jobTitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              experiences: p.experiences.map((item, i) => i === idx ? { ...item, jobTitle: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Entreprise (ex : Acme Corp)"
                          value={exp.company}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              experiences: p.experiences.map((item, i) => i === idx ? { ...item, company: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Date de début (ex : 2022-01 ou Janv. 2022)"
                          value={exp.startDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              experiences: p.experiences.map((item, i) => i === idx ? { ...item, startDate: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder="Date de fin"
                            disabled={exp.isCurrent}
                            value={exp.isCurrent ? 'Poste actuel' : exp.endDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePortfolio((p) => ({
                                ...p,
                                experiences: p.experiences.map((item, i) => i === idx ? { ...item, endDate: val } : item),
                              }));
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs disabled:opacity-60"
                          />
                          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
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

                      <textarea
                        rows={3}
                        placeholder="Missions principales, réalisations clés, impact..."
                        value={exp.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updatePortfolio((p) => ({
                            ...p,
                            experiences: p.experiences.map((item, i) => i === idx ? { ...item, description: val } : item),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Step 5: Formations */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Ajoutez vos diplômes ou études supérieures.</p>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une formation</span>
                  </button>
                </div>

                {portfolio.educations.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Aucune formation renseignée.
                  </div>
                ) : (
                  portfolio.educations.map((edu, idx) => (
                    <div key={edu.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Formation #{idx + 1}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Diplôme (ex : Master 2 / Licence)"
                          value={edu.degree}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.map((item, i) => i === idx ? { ...item, degree: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Établissement (ex : Université Paris-Saclay)"
                          value={edu.institution}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.map((item, i) => i === idx ? { ...item, institution: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Domaine (ex : Informatique & Télécom)"
                          value={edu.fieldOfStudy}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              educations: p.educations.map((item, i) => i === idx ? { ...item, fieldOfStudy: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Step 6: Projets */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Présentez vos réalisations les plus représentatives.</p>
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
                            category: 'Web',
                            liveUrl: '',
                            githubUrl: '',
                            date: new Date().getFullYear().toString(),
                          },
                        ],
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouveau projet</span>
                  </button>
                </div>

                {portfolio.projects.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Aucun projet ajouté pour le moment.
                  </div>
                ) : (
                  portfolio.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projet #{idx + 1}</span>
                        <button
                          onClick={() => {
                            updatePortfolio((p) => ({
                              ...p,
                              projects: p.projects.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Titre du projet"
                          value={proj.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              projects: p.projects.map((item, i) => i === idx ? { ...item, title: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Catégorie (ex : Application Web, Mobile, Open-Source)"
                          value={proj.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              projects: p.projects.map((item, i) => i === idx ? { ...item, category: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Description du projet et résultats obtenus..."
                        value={proj.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updatePortfolio((p) => ({
                            ...p,
                            projects: p.projects.map((item, i) => i === idx ? { ...item, description: val } : item),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="url"
                          placeholder="Lien en ligne (Live URL)"
                          value={proj.liveUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              projects: p.projects.map((item, i) => i === idx ? { ...item, liveUrl: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="url"
                          placeholder="Lien GitHub / Code source"
                          value={proj.githubUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              projects: p.projects.map((item, i) => i === idx ? { ...item, githubUrl: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Step 7: Certifications */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">
                    Ajoutez vos certifications avec URL de vérification. (Le bouton de vérification n'apparaît que si une URL est renseignée).
                  </p>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {portfolio.certifications.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Aucune certification renseignée.
                  </div>
                ) : (
                  portfolio.certifications.map((cert, idx) => (
                    <div key={cert.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nom de la certification"
                          value={cert.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              certifications: p.certifications.map((item, i) => i === idx ? { ...item, title: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Organisme émetteur"
                          value={cert.issuer}
                          onChange={(e) => {
                            const val = e.target.value;
                            updatePortfolio((p) => ({
                              ...p,
                              certifications: p.certifications.map((item, i) => i === idx ? { ...item, issuer: val } : item),
                            }));
                          }}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <input
                        type="url"
                        placeholder="URL de vérification publique (facultatif)"
                        value={cert.verificationUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          updatePortfolio((p) => ({
                            ...p,
                            certifications: p.certifications.map((item, i) => i === idx ? { ...item, verificationUrl: val } : item),
                          }));
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Step 8: Réseaux Sociaux */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Renseignez uniquement les liens que vous souhaitez faire apparaître. Les champs vides ne seront pas affichés.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.socialLinks.map((soc, idx) => (
                    <div key={soc.id} className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 capitalize">
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
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 9: Choix du Template */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <p className="text-xs text-slate-500">
                  Choisissez votre modèle. Vous pouvez changer à tout moment sans jamais perdre aucune donnée.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'professional' as TemplateId, title: 'Modèle 01 — Professionnel', desc: 'Design sobre, structuré et orienté recrutement.' },
                    { id: 'creative' as TemplateId, title: 'Modèle 02 — Créatif', desc: 'Design visuel et audacieux pour designers & créateurs.' },
                    { id: 'tech' as TemplateId, title: 'Modèle 03 — Tech', desc: 'Design axé développeurs, stack technique et dépôts.' },
                  ].map((tpl) => {
                    const isSelected = portfolio.settings.templateId === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          updatePortfolio((p) => ({
                            ...p,
                            settings: { ...p.settings, templateId: tpl.id },
                          }));
                        }}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-sm text-slate-900">{tpl.title}</h3>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{tpl.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 10: Personnalisation */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Couleur d'accent
                  </label>
                  <div className="flex items-center gap-3">
                    {['#4F46E5', '#2563EB', '#0D9488', '#D97706', '#E11D48', '#0F172A'].map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          updatePortfolio((p) => ({
                            ...p,
                            settings: { ...p.settings, primaryColor: col },
                          }));
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          portfolio.settings.primaryColor === col ? 'scale-110 border-slate-900 shadow-xs' : 'border-white'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Style des boutons
                  </label>
                  <div className="flex gap-3">
                    {(['rounded', 'pill', 'sharp'] as ButtonStyle[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updatePortfolio((p) => ({
                            ...p,
                            settings: { ...p.settings, buttonStyle: st },
                          }));
                        }}
                        className={`px-4 py-2 text-xs font-semibold border ${
                          st === 'pill' ? 'rounded-full' : st === 'sharp' ? 'rounded-none' : 'rounded-lg'
                        } ${portfolio.settings.buttonStyle === st ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
                      >
                        {st === 'rounded' ? 'Arrondi doux' : st === 'pill' ? 'Pilule' : 'Droit'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 11: Prévisualisation */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Voici l'aperçu réel de votre portfolio avec vos données et votre style.
                </p>
                <div className="rounded-xl border border-slate-200 overflow-hidden max-h-[500px] overflow-y-auto">
                  <TemplateEngine data={portfolio} isInteractive={false} />
                </div>
              </div>
            )}

            {/* Step 12: Publication */}
            {currentStep === 12 && (
              <div className="space-y-6 text-center max-w-md mx-auto py-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Votre portfolio est prêt !</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Activez la publication pour le rendre accessible en ligne à l'adresse suivante :
                  </p>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-indigo-700">
                  {window.location.origin}/#/p/{portfolio.user.username}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      updatePortfolio((p) => ({
                        ...p,
                        settings: { ...p.settings, isPublished: true },
                      }));
                    }}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white transition-colors ${
                      portfolio.settings.isPublished ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {portfolio.settings.isPublished ? '✓ Publié en ligne' : 'Publier mon portfolio maintenant'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
              >
                <span>{currentStep === totalSteps ? 'Terminer et ouvrir mon portfolio' : 'Suivant'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
