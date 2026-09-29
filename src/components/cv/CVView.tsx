import React, { useState } from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { formatDateRange, downloadCVPdf } from '../../utils/helpers';
import { Printer, Download, FileText, CheckCircle2, MapPin, Mail, Phone, Globe, Layers, ArrowLeft } from 'lucide-react';

interface CVViewProps {
  data: FullPortfolioData;
  onBack?: () => void;
}

export const CVView: React.FC<CVViewProps> = ({ data, onBack }) => {
  const [cvMode, setCvMode] = useState<'synthetic' | 'complete'>('synthetic');
  const { profile, skillCategories, experiences, educations, projects, certifications, tools, socialLinks } = data;

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Curriculum Vitae';
  const validSocials = socialLinks.filter((s) => s.url && s.url.trim().length > 0);

  const handlePrintOrDownload = () => {
    downloadCVPdf(profile.firstName, profile.lastName);
  };

  // Filter skills for synthetic view (take top skills)
  const syntheticSkills = skillCategories.flatMap((c) => c.skills).slice(0, 10);
  const syntheticExperiences = cvMode === 'synthetic' ? experiences.slice(0, 3) : experiences;
  const syntheticEducations = cvMode === 'synthetic' ? educations.slice(0, 2) : educations;
  const displayProjects = cvMode === 'synthetic' ? projects.slice(0, 2) : projects;

  return (
    <div className="space-y-6">
      {/* Top action toolbar (Hidden during print) */}
      <div className="no-print bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-slate-900">Générateur de CV Professionnel</h2>
            <p className="text-xs text-slate-500">
              Généré automatiquement à partir de votre profil · Prêt pour export A4
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Segmented control: Synthetic vs Complete */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setCvMode('synthetic')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                cvMode === 'synthetic'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CV Synthétique (1 page)
            </button>
            <button
              onClick={() => setCvMode('complete')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                cvMode === 'complete'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CV Détaillé (Complet)
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={handlePrintOrDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger PDF (A4)</span>
          </button>
          <button
            onClick={handlePrintOrDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* CV Sheet Preview Container */}
      <div className="flex justify-center overflow-x-auto pb-12">
        <div 
          id="printable-cv-document"
          className="cv-a4-page w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 md:p-12 border border-slate-200 shadow-md font-sans text-slate-800"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Header */}
          <header className="pb-6 border-b-2 border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                {fullName}
              </h1>
              {profile.professionalTitle && (
                <p className="text-lg font-semibold text-indigo-600 mt-1">
                  {profile.professionalTitle}
                </p>
              )}
            </div>

            {/* Contact metadata */}
            <div className="text-xs text-slate-600 space-y-1 text-left md:text-right">
              {profile.email && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.websiteUrl && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.websiteUrl}</span>
                </div>
              )}
            </div>
          </header>

          {/* Presentation / Bio */}
          {(profile.shortPresentation || profile.bio) && (
            <section className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Profil Professionnel
              </h2>
              <p className="text-xs leading-relaxed text-slate-700">
                {profile.shortPresentation || profile.bio}
              </p>
            </section>
          )}

          {/* Body Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
            {/* Left Main Column: Experiences & Educations (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              {/* Experiences */}
              {syntheticExperiences.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Expériences Professionnelles
                  </h2>

                  <div className="space-y-4">
                    {syntheticExperiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-bold text-slate-900">{exp.jobTitle}</h3>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          {exp.company} {exp.location ? `· ${exp.location}` : ''}
                        </p>
                        {exp.description && (
                          <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line mt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Formations */}
              {syntheticEducations.length > 0 && (
                <section className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Formations & Diplômes
                  </h2>

                  <div className="space-y-3">
                    {syntheticEducations.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {formatDateRange(edu.startDate, edu.endDate)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">{edu.institution} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ''}</p>
                        {edu.description && (
                          <p className="text-[11px] text-slate-600">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects (Complete mode or synthetic top 2) */}
              {displayProjects.length > 0 && (
                <section className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Projets Notables
                  </h2>
                  <div className="space-y-3">
                    {displayProjects.map((p) => (
                      <div key={p.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-xs font-bold text-slate-900">{p.title}</h3>
                          {p.date && <span className="text-[11px] text-slate-400">{p.date}</span>}
                        </div>
                        {p.description && (
                          <p className="text-[11px] text-slate-600 leading-snug">{p.description}</p>
                        )}
                        {p.technologies && p.technologies.length > 0 && (
                          <p className="text-[10px] text-slate-500 font-mono">
                            Stack : {p.technologies.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar Column: Skills, Tools, Certifications, Links (4 cols) */}
            <div className="md:col-span-4 space-y-6 md:border-l md:border-slate-200 md:pl-6">
              {/* Skills */}
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                  Compétences
                </h2>

                {cvMode === 'synthetic' ? (
                  <div className="flex flex-wrap gap-1.5">
                    {syntheticSkills.map((s) => (
                      <span key={s.id} className="text-xs font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {skillCategories.filter((c) => c.skills.length > 0).map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <h3 className="text-[11px] font-bold text-slate-700 uppercase">{cat.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {cat.skills.map((s) => s.name).join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Tools */}
              {tools.length > 0 && (
                <section className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Outils & Logiciels
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tools.map((t) => t.name).join(', ')}
                  </p>
                </section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <section className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Certifications
                  </h2>
                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="text-xs">
                        <p className="font-semibold text-slate-800">{cert.title}</p>
                        <p className="text-[11px] text-slate-500">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Social Links */}
              {validSocials.length > 0 && (
                <section className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Liens & Réseaux
                  </h2>
                  <div className="space-y-1 text-xs">
                    {validSocials.map((soc) => (
                      <div key={soc.id} className="text-[11px] text-slate-600 truncate">
                        <span className="font-medium text-slate-800">{soc.label || soc.platform} :</span>{' '}
                        <span className="text-indigo-600">{soc.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Portfolio Link Watermark */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400">
                Portfolio en ligne :<br />
                <span className="text-slate-600 font-mono">
                  {window.location.origin}/#/p/{data.user.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
