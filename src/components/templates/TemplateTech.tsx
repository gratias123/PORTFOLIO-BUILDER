import React from 'react';
import { FullPortfolioData } from '../../types/portfolio';
import { formatDateRange, getButtonStyleClasses, getFontPresetClass } from '../../utils/helpers';
import { 
  Terminal, Code2, Cpu, GitFork, ExternalLink, Github, 
  Linkedin, Mail, MapPin, CheckCircle, ShieldCheck, Layers 
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
  isInteractive?: boolean;
}

export const TemplateTech: React.FC<TemplateProps> = ({ data }) => {
  const { profile, skillCategories, experiences, educations, projects, certifications, tools, socialLinks, settings } = data;
  const visible = settings.visibleSections;
  const fontClass = getFontPresetClass(settings.fontPreset);
  const btnClass = getButtonStyleClasses(settings.buttonStyle);

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const primaryColor = settings.primaryColor || '#4F46E5';
  const validSocials = socialLinks.filter((s) => s.url && s.url.trim().length > 0);

  return (
    <div className={`min-h-screen bg-[#0B0F19] text-slate-100 ${fontClass} selection:bg-indigo-600 selection:text-white`}>
      {/* Terminal / Modern Tech Hero */}
      {visible.profile && (
        <header className="border-b border-slate-800/80 bg-[#0F172A]/70 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={fullName}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-slate-700 shadow-md"
                  />
                ) : (
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center font-mono font-bold text-xl text-white shadow-md border border-slate-700"
                    style={{ backgroundColor: primaryColor }}
                  >
                    &lt;{profile.firstName?.[0] || 'D'}/&gt;
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {fullName || 'Developer Profile'}
                    </h1>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Available" />
                  </div>
                  {profile.professionalTitle && (
                    <p className="text-sm md:text-base font-mono mt-1 text-slate-300">
                      {profile.professionalTitle}
                    </p>
                  )}
                  {profile.location && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{profile.location}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-white shadow-sm transition-all hover:opacity-90 ${btnClass}`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>$ contact --email</span>
                  </a>
                )}
                {validSocials.find((s) => s.platform === 'github') && (
                  <a
                    href={validSocials.find((s) => s.platform === 'github')!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors ${btnClass}`}
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {profile.shortPresentation && (
              <div className="mt-6 p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 max-w-3xl leading-relaxed">
                <span className="text-indigo-400 mr-2">&gt;</span>
                {profile.shortPresentation}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Bio */}
        {visible.bio && profile.bio && (
          <section className="bg-slate-900/60 p-6 md:p-8 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>README.md</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-line font-normal">
              {profile.bio}
            </p>
          </section>
        )}

        {/* Skills & Tech Stack Matrix */}
        {visible.skills && skillCategories.some((c) => c.skills.length > 0) && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Stack & Compétences Techniques</span>
              </div>
              <span className="text-xs font-mono text-slate-500">ENGINEERING</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {skillCategories.filter((c) => c.skills.length > 0).map((cat) => (
                <div key={cat.id} className="bg-slate-900/80 p-5 rounded-xl border border-slate-800/90 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 mb-3 flex items-center justify-between">
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-600">[{cat.skills.length}]</span>
                    </h3>
                    <div className="space-y-2">
                      {cat.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-200">{skill.name}</span>
                          {skill.level && (
                            <span className="text-[11px] text-indigo-400">
                              {'★'.repeat(skill.level)}{'☆'.repeat(5 - skill.level)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projets & Repositories */}
        {visible.projects && projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <GitFork className="w-4 h-4 text-indigo-400" />
                <span>Projets Développés</span>
              </div>
              <span className="text-xs font-mono text-slate-500">BUILD_LOG</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-colors">
                  {proj.imageUrl && (
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover border-b border-slate-800"
                    />
                  )}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 mb-2">
                        {proj.category && <span className="text-indigo-400 font-semibold">{proj.category}</span>}
                        {proj.date && <span>{proj.date}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {proj.title}
                      </h3>
                      {proj.role && (
                        <p className="text-xs font-mono text-emerald-400 mt-0.5">
                          $ role: {proj.role}
                        </p>
                      )}
                      {proj.description && (
                        <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-sans">
                          {proj.description}
                        </p>
                      )}

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {proj.technologies.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700/60">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-4 text-xs font-mono">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>demo</span>
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors hover:underline"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Expériences & Formations */}
        {((visible.experiences && experiences.length > 0) || (visible.educations && educations.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Expériences */}
            {visible.experiences && experiences.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white pb-2 border-b border-slate-800">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Expériences</span>
                </div>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-white text-sm">{exp.jobTitle}</h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-indigo-300">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p>
                      {exp.description && (
                        <p className="text-xs text-slate-400 leading-relaxed pt-1 whitespace-pre-line font-sans">
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
              <section className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white pb-2 border-b border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Diplômes & Écoles</span>
                </div>
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="font-bold text-white text-sm">{edu.degree}</h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatDateRange(edu.startDate, edu.endDate)}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-300">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-[11px] text-slate-400 font-sans">{edu.fieldOfStudy}</p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Certifications & Tools */}
        {((visible.certifications && certifications.length > 0) || (visible.tools && tools.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visible.certifications && certifications.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Certifications vérifiées
                </h3>
                <div className="space-y-2">
                  {certifications.map((c) => (
                    <div key={c.id} className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{c.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.issuer} {c.date ? `· ${c.date}` : ''}</div>
                        {c.description && (
                          <div className="text-[11px] text-slate-400 mt-1 font-sans">{c.description}</div>
                        )}
                      </div>
                      {c.verificationUrl && (
                        <a
                          href={c.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] font-mono border border-slate-700 text-indigo-300 hover:bg-slate-800 rounded transition-colors"
                        >
                          verify
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {visible.tools && tools.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Environnement & Outils
                </h3>
                <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span key={tool.id} className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700">
                      {tool.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Footer */}
        {(visible.socials || visible.contact) && (
          <footer className="pt-12 border-t border-slate-800/80 font-mono space-y-6">
            {visible.contact && (profile.email || profile.location) && (
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 max-w-lg mx-auto text-center space-y-2">
                <span className="text-xs text-indigo-400 font-bold block">$ cat ./contact.info</span>
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-300 pt-1">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="text-indigo-400 hover:underline">
                      email: {profile.email}
                    </a>
                  )}
                  {profile.location && (
                    <span className="text-slate-500">location: {profile.location}</span>
                  )}
                </div>
              </div>
            )}

            {visible.socials && validSocials.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
                {validSocials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded hover:border-slate-700 hover:text-indigo-400 transition-colors"
                  >
                    $ open {s.label || s.platform}
                  </a>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500">
              <p>// {fullName || 'developer'} · {new Date().getFullYear()} · all rights reserved</p>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};
