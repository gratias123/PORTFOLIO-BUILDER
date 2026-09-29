import React from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { formatDateRange, getButtonStyleClasses, getFontPresetClass } from '../../utils/helpers';
import { 
  ArrowUpRight, Mail, Phone, MapPin, Globe, 
  Linkedin, Github, MessageCircle, FileText, Download 
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
  isInteractive?: boolean;
}

export const TemplateMinimalist: React.FC<TemplateProps> = ({ data }) => {
  const { profile, skillCategories, experiences, educations, projects, certifications, tools, socialLinks, settings } = data;
  const visible = settings.visibleSections;
  const fontClass = getFontPresetClass(settings.fontPreset);
  const btnClass = getButtonStyleClasses(settings.buttonStyle);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const primaryColor = settings.primaryColor || '#0F172A';
  const validSocials = socialLinks.filter((s) => s.url && s.url.trim().length > 0);

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5" />;
      case 'github':
        return <Github className="w-3.5 h-3.5" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#FDFDFC] text-stone-900 ${fontClass} selection:bg-stone-200 selection:text-stone-900`}>
      {/* Quiet Minimalist Header */}
      {visible.profile && (
        <header className="border-b border-stone-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-6 py-8 md:py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {profile.photoUrl && (
                  <img
                    src={profile.photoUrl}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover grayscale contrast-110 border border-stone-300"
                  />
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900">
                    {fullName || 'Portfolio Minimaliste'}
                  </h1>
                  {profile.professionalTitle && (
                    <p className="text-xs font-mono text-stone-500 uppercase tracking-widest mt-0.5">
                      {profile.professionalTitle}
                    </p>
                  )}
                </div>
              </div>

              {profile.location && (
                <p className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{profile.location}</span>
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {settings.allowCvDownload !== false && (
                <a
                  href={`/#/p/${data.user.username}?view=cv`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 underline underline-offset-4 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>CV Document</span>
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium ${btnClass} transition-colors`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Stream */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Short Presentation / Bio */}
        {visible.bio && (profile.shortPresentation || profile.bio) && (
          <section className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600 block">
              À propos
            </span>
            {profile.shortPresentation && (
              <p className="text-lg sm:text-xl font-light text-stone-800 leading-relaxed max-w-3xl">
                {profile.shortPresentation}
              </p>
            )}
            {profile.bio && (
              <div className="text-xs text-stone-600 leading-relaxed space-y-2 whitespace-pre-line max-w-2xl">
                {profile.bio}
              </div>
            )}
          </section>
        )}

        {/* Selected Works / Projects */}
        {visible.projects && projects.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-stone-200">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600">
                Projets Sélectionnés
              </span>
              <span className="text-[10px] font-mono text-stone-600">{projects.length} travaux</span>
            </div>

            <div className="divide-y divide-stone-200/80">
              {projects.map((proj) => (
                <div key={proj.id} className="py-6 first:pt-0 last:pb-0 space-y-3 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-base font-medium text-stone-900 group-hover:text-stone-600 transition-colors flex items-center gap-1.5">
                      <span>{proj.title}</span>
                      {proj.liveUrl && <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600">
                      {proj.category && <span>{proj.category}</span>}
                      {proj.date && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{proj.date}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {proj.description && (
                    <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                      {proj.description}
                    </p>
                  )}

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-stone-600 pt-1">
                      {proj.technologies.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                  )}

                  {(proj.liveUrl || proj.githubUrl) && (
                    <div className="flex items-center gap-4 pt-1 text-xs font-mono">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-900 hover:underline underline-offset-4"
                        >
                          Visiter le projet ↗
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-600 hover:text-stone-900"
                        >
                          Code source ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Timeline */}
        {visible.experiences && experiences.length > 0 && (
          <section className="space-y-6 pt-4 border-t border-stone-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600 block">
              Parcours & Expériences
            </span>

            <div className="divide-y divide-stone-200/80">
              {experiences.map((exp) => (
                <div key={exp.id} className="py-5 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-900">{exp.jobTitle}</span>
                      <span className="text-xs text-stone-600">chez {exp.company}</span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-600">
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>

                  {exp.location && (
                    <span className="text-[11px] text-stone-600 block">{exp.location}</span>
                  )}

                  {exp.description && (
                    <p className="text-xs text-stone-600 leading-relaxed max-w-2xl whitespace-pre-line pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Tools Minimal List */}
        {(visible.skills || visible.tools) && (skillCategories.length > 0 || tools.length > 0) && (
          <section className="space-y-6 pt-4 border-t border-stone-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600 block">
              Compétences & Outils
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {visible.skills && skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <span className="text-xs font-mono font-medium text-stone-900 block pb-1 border-b border-stone-200">
                    {cat.name}
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {cat.skills.map((s) => (
                      <li key={s.id} className="flex items-center justify-between">
                        <span>{s.name}</span>
                        {s.level && <span className="text-[10px] text-stone-600 font-mono">Lvl {s.level}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {visible.tools && tools.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-medium text-stone-900 block pb-1 border-b border-stone-200">
                    Outils & Environnements
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {tools.map((tool) => (
                      <li key={tool.id} className="flex items-center justify-between">
                        <span>{tool.name}</span>
                        {tool.level && <span className="text-[10px] text-stone-600 font-mono">{tool.level}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Education & Certifications */}
        {(visible.educations || visible.certifications) && (educations.length > 0 || certifications.length > 0) && (
          <section className="space-y-6 pt-4 border-t border-stone-200">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-600 block">
              Formation & Certifications
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {visible.educations && educations.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-medium text-stone-900">{edu.degree}</span>
                    <span className="text-[10px] font-mono text-stone-600">{edu.endDate || edu.startDate}</span>
                  </div>
                  <p className="text-xs text-stone-600">{edu.institution} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ''}</p>
                </div>
              ))}

              {visible.certifications && certifications.map((cert) => (
                <div key={cert.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-medium text-stone-900">{cert.title}</span>
                    <span className="text-[10px] font-mono text-stone-600">{cert.date}</span>
                  </div>
                  <p className="text-xs text-stone-600">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quiet Minimal Footer */}
        <footer className="pt-12 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-600">
          <div>
            <span>{fullName || 'Portfolio'}</span>
            <span aria-hidden="true"> · </span>
            <span>{new Date().getFullYear()}</span>
          </div>

          {validSocials.length > 0 && (
            <div className="flex items-center gap-4">
              {validSocials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-stone-900 transition-colors capitalize"
                >
                  {s.label || s.platform} ↗
                </a>
              ))}
            </div>
          )}
        </footer>
      </main>
    </div>
  );
};
