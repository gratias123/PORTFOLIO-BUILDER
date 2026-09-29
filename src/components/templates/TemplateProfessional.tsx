import React from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { formatDateRange, getButtonStyleClasses, getFontPresetClass } from '../../utils/helpers';
import { 
  Briefcase, GraduationCap, Award, Wrench, Globe, ExternalLink, 
  Mail, Phone, MapPin, CheckCircle2, Linkedin, Github, MessageCircle 
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
  isInteractive?: boolean;
}

export const TemplateProfessional: React.FC<TemplateProps> = ({ data }) => {
  const { profile, skillCategories, experiences, educations, projects, certifications, tools, socialLinks, settings } = data;
  const visible = settings.visibleSections;
  const fontClass = getFontPresetClass(settings.fontPreset);
  const btnClass = getButtonStyleClasses(settings.buttonStyle);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const primaryColor = settings.primaryColor || '#4F46E5';

  const validSocials = socialLinks.filter((s) => s.url && s.url.trim().length > 0);

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${fontClass} selection:bg-indigo-100`}>
      {/* Top Professional Header */}
      {visible.profile && (
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={fullName || 'Photo de profil'}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                  />
                ) : (
                  <div 
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {profile.firstName?.[0] || ''}{profile.lastName?.[0] || 'P'}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                    {fullName || 'Portfolio Professionnel'}
                  </h1>
                  {profile.professionalTitle && (
                    <p className="text-lg md:text-xl font-medium mt-1" style={{ color: primaryColor }}>
                      {profile.professionalTitle}
                    </p>
                  )}
                  {profile.location && (
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{profile.location}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Contact actions */}
              <div className="flex flex-wrap items-center gap-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 ${btnClass}`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contacter</span>
                  </a>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors ${btnClass}`}
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{profile.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Short presentation */}
            {profile.shortPresentation && (
              <p className="mt-8 text-base md:text-lg text-slate-700 max-w-3xl leading-relaxed border-l-2 pl-4" style={{ borderColor: primaryColor }}>
                {profile.shortPresentation}
              </p>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Bio / Parcours */}
        {visible.bio && profile.bio && (
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500">
              À propos & Parcours
            </h2>
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed text-base">
                {profile.bio}
              </p>
            </div>
          </section>
        )}

        {/* Expériences */}
        {visible.experiences && experiences.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
              <Briefcase className="w-5 h-5" style={{ color: primaryColor }} />
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Expériences Professionnelles
              </h2>
            </div>

            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{exp.jobTitle}</h3>
                      <p className="text-sm font-semibold text-slate-700">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-slate-100 px-2.5 py-1 rounded">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-4 text-sm text-slate-600 whitespace-pre-line leading-relaxed">
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
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
              <GraduationCap className="w-5 h-5" style={{ color: primaryColor }} />
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Formations & Diplômes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educations.map((edu) => (
                <div key={edu.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-sm font-medium text-slate-700">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-xs text-slate-500 mt-0.5">{edu.fieldOfStudy}</p>
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences */}
        {visible.skills && skillCategories.some((cat) => cat.skills.length > 0) && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 pb-3 border-b border-slate-200">
              Compétences & Domaines d'Expertise
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.filter((c) => c.skills.length > 0).map((cat) => (
                <div key={cat.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4 pb-2 border-b border-slate-100">
                    {cat.name}
                  </h3>
                  <ul className="space-y-2.5">
                    {cat.skills.map((skill) => (
                      <li key={skill.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-800">{skill.name}</span>
                        {skill.level && (
                          <div className="flex gap-1" aria-label={`Niveau ${skill.level} sur 5`}>
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <div
                                key={lvl}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  lvl <= (skill.level || 0) ? 'bg-indigo-600' : 'bg-slate-200'
                                }`}
                                style={lvl <= (skill.level || 0) ? { backgroundColor: primaryColor } : {}}
                              />
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projets */}
        {visible.projects && projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 pb-3 border-b border-slate-200">
              Projets Réalisés
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  {proj.imageUrl && (
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-48 object-cover border-b border-slate-100"
                    />
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                        {proj.category && <span className="font-semibold uppercase tracking-wider">{proj.category}</span>}
                        {proj.date && <span>{proj.date}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                      {proj.role && (
                        <p className="text-xs font-semibold mt-0.5" style={{ color: primaryColor }}>
                          {proj.role}
                        </p>
                      )}
                      {proj.description && (
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                          {proj.description}
                        </p>
                      )}

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 text-xs text-slate-500">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx}>
                              {t}{idx < proj.technologies.length - 1 ? ' ·' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-semibold">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 transition-colors hover:underline"
                          style={{ color: primaryColor }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Voir le projet</span>
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors hover:underline"
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

        {/* Certifications & Outils */}
        {((visible.certifications && certifications.length > 0) || (visible.tools && tools.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Certifications */}
            {visible.certifications && certifications.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  <h2 className="text-lg font-bold text-slate-900">Certifications</h2>
                </div>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{cert.title}</h3>
                        <p className="text-xs text-slate-600">{cert.issuer} {cert.date ? `· ${cert.date}` : ''}</p>
                        {cert.description && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cert.description}</p>
                        )}
                      </div>
                      {cert.verificationUrl && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs px-3 py-1.5 font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 ${btnClass}`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Vérifier</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outils */}
            {visible.tools && tools.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Wrench className="w-4 h-4" style={{ color: primaryColor }} />
                  <h2 className="text-lg font-bold text-slate-900">Outils & Environnements</h2>
                </div>
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <span
                        key={tool.id}
                        className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-800 rounded border border-slate-200"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Réseaux sociaux & Contact final */}
        {(visible.socials || visible.contact) && (
          <footer className="pt-12 border-t border-slate-200 space-y-8">
            {visible.contact && (profile.email || profile.phone || profile.location) && (
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900">
                  Échangeons ensemble
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Disponible pour de nouvelles opportunités professionnelles ou collaborations.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 ${btnClass}`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors ${btnClass}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{profile.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {visible.socials && validSocials.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {validSocials.map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium shadow-2xs hover:border-slate-300 transition-colors"
                    title={soc.label || soc.platform}
                  >
                    {renderSocialIcon(soc.platform)}
                    <span className="capitalize">{soc.label || soc.platform}</span>
                  </a>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <p>© {new Date().getFullYear()} {fullName || 'Portfolio'}. Tous droits réservés.</p>
              <p className="text-[11px] text-slate-400">Portfolio professionnel</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};
