import React from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { formatDateRange, getButtonStyleClasses, getFontPresetClass } from '../../utils/helpers';
import { 
  ArrowUpRight, Sparkles, FolderGit2, Mail, MapPin, 
  Linkedin, Github, Globe, MessageCircle, ExternalLink, Award 
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
  isInteractive?: boolean;
}

export const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {
  const { profile, skillCategories, experiences, educations, projects, certifications, tools, socialLinks, settings } = data;
  const visible = settings.visibleSections;
  const fontClass = getFontPresetClass(settings.fontPreset);
  const btnClass = getButtonStyleClasses(settings.buttonStyle);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const primaryColor = settings.primaryColor || '#4F46E5';
  const validSocials = socialLinks.filter((s) => s.url && s.url.trim().length > 0);

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-slate-900 ${fontClass} selection:bg-slate-900 selection:text-white`}>
      {/* Creative Hero */}
      {visible.profile && (
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  <span>Creative & Design Portfolio</span>
                </div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
                  {fullName ? (
                    <>
                      <span>{fullName}</span>
                      <span className="text-indigo-600">.</span>
                    </>
                  ) : (
                    'Portfolio Créatif.'
                  )}
                </h1>

                {profile.professionalTitle && (
                  <p className="text-xl sm:text-2xl font-semibold text-slate-700">
                    {profile.professionalTitle}
                  </p>
                )}

                {profile.shortPresentation && (
                  <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                    {profile.shortPresentation}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-[1.02] ${btnClass}`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Me contacter</span>
                    </a>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium px-4 py-2 bg-slate-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Photo or Artistic Monogram */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                {profile.photoUrl ? (
                  <div className="relative group">
                    <div 
                      className="absolute -inset-2 rounded-2xl opacity-20 blur-lg transition duration-500 group-hover:opacity-40"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <img
                      src={profile.photoUrl}
                      alt={fullName}
                      referrerPolicy="no-referrer"
                      className="relative w-64 h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-64 h-80 rounded-2xl flex flex-col items-center justify-center p-8 text-white shadow-xl relative overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-7xl font-black opacity-30 select-none">
                      {profile.firstName?.[0] || 'C'}{profile.lastName?.[0] || 'R'}
                    </span>
                    <span className="mt-4 text-sm font-bold tracking-wider uppercase opacity-80">
                      {profile.professionalTitle || 'Designer'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* Projects Showcase (Central in Creative Template) */}
        {visible.projects && projects.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sélection de réalisations</span>
                <h2 className="text-3xl font-black text-slate-900 mt-1">Projets & Créations</h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">{projects.length} projet{projects.length > 1 ? 's' : ''} présenté{projects.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden aspect-video bg-slate-100">
                    {proj.imageUrl ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <FolderGit2 className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                    {proj.category && (
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                        {proj.category}
                      </span>
                    )}
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {proj.title}
                          </h3>
                          {proj.role && (
                            <span className="text-xs font-semibold block mt-0.5" style={{ color: primaryColor }}>
                              {proj.role}
                            </span>
                          )}
                        </div>
                        {proj.date && <span className="text-xs text-slate-400 shrink-0">{proj.date}</span>}
                      </div>

                      {proj.description && (
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          {proj.description}
                        </p>
                      )}

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {proj.technologies.map((t, idx) => (
                            <span 
                              key={idx}
                              className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-4">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 ${btnClass}`}
                          style={{ backgroundColor: primaryColor }}
                        >
                          <span>Voir le projet</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bio / Démarche créative */}
        {visible.bio && profile.bio && (
          <section className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">À propos</span>
            <h2 className="text-2xl font-black text-slate-900">Vision & Démarche</h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-4xl">
              {profile.bio}
            </p>
          </section>
        )}

        {/* Expériences & Formations en 2 Colonnes */}
        {((visible.experiences && experiences.length > 0) || (visible.educations && educations.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Expériences */}
            {visible.experiences && experiences.length > 0 && (
              <section className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Parcours</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Expériences</h2>
                </div>

                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200 space-y-2">
                      <div 
                        className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{exp.jobTitle}</h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                      {exp.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Formations */}
            {visible.educations && educations.length > 0 && (
              <section className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Études</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Formations</h2>
                </div>

                <div className="space-y-6">
                  {educations.map((edu) => (
                    <div key={edu.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDateRange(edu.startDate, edu.endDate)}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-xs text-slate-500">{edu.fieldOfStudy}</p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Compétences & Outils */}
        {(visible.skills || visible.tools) && (
          <section className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
            {visible.skills && skillCategories.some((c) => c.skills.length > 0) && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900">Compétences</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {skillCategories.filter((c) => c.skills.length > 0).map((cat) => (
                    <div key={cat.id} className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{cat.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((skill) => (
                          <span 
                            key={skill.id}
                            className="text-xs font-bold px-3 py-1.5 bg-slate-50 text-slate-800 rounded-lg border border-slate-200"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visible.tools && tools.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Boîte à Outils</h3>
                <div className="flex flex-wrap gap-2.5">
                  {tools.map((t) => (
                    <span 
                      key={t.id} 
                      className="text-xs font-semibold px-3 py-1 bg-indigo-50/70 text-indigo-950 rounded-md border border-indigo-100"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Certifications */}
        {visible.certifications && certifications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cert.title}</h3>
                    <p className="text-xs text-slate-500">{cert.issuer} {cert.date ? `· ${cert.date}` : ''}</p>
                  </div>
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 ${btnClass}`}
                    >
                      <span>Vérifier</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer & Réseaux */}
        {(visible.socials || visible.contact) && (
          <footer className="pt-16 border-t border-slate-200 space-y-10">
            {visible.contact && profile.email && (
              <div className="text-center space-y-4 max-w-xl mx-auto">
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 block">
                  Contact & Projets
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Envie de donner vie à un projet ?
                </h3>
                <div className="pt-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className={`inline-flex items-center gap-2 px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-105 ${btnClass}`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Démarrer une conversation</span>
                  </a>
                </div>
              </div>
            )}

            {visible.socials && validSocials.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                {validSocials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:border-slate-400 hover:shadow-xs transition-all"
                  >
                    {soc.label || soc.platform} ↗
                  </a>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
              <p>© {new Date().getFullYear()} {fullName || 'Portfolio'}. Tous droits réservés.</p>
              <p className="text-[11px] font-mono text-slate-400">Creative Portfolio</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};
