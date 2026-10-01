import { useState } from 'react';
import type { ResumeData } from '../types';
import {
  Printer,
  FileText,
  Globe,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Mail,
  Download,
  Calendar,
  MapPin,
  Globe2,
  Video,
  Play,
  FileUp,
  Cpu,
  Award,
  Briefcase,
  GraduationCap,
  Wrench,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PreviewPanelProps {
  data: ResumeData;
  onPrint: () => void;
  onExportWord: () => void;
  onOpenExport: () => void;
  onOpenTranslate: () => void;
}

export default function PreviewPanel({
  data,
  onPrint,
  onExportWord,
  onOpenExport,
  onOpenTranslate,
}: PreviewPanelProps) {
  const [zoom, setZoom] = useState(100);

  const { design } = data;
  const primaryColor = design.primaryColor || '#004A8D';
  const isCompact = design.layoutMode === 'compact';

  const fullLocation = [data.city, data.state].filter(Boolean).join(' – ');

  // Spacing & padding maps
  const paddingClass = isCompact
    ? 'p-6 sm:p-8'
    : design.spacing === 'compact'
    ? 'p-6 sm:p-8'
    : design.spacing === 'spacious'
    ? 'p-10 sm:p-14'
    : 'p-8 sm:p-12';

  const sectionSpacingClass = isCompact ? 'space-y-3' : 'space-y-5';
  const itemSpacingClass = isCompact ? 'space-y-1.5' : 'space-y-2.5';

  const fontSizeClass = isCompact
    ? 'text-[10px]'
    : design.fontSize === 'sm'
    ? 'text-[10.5px]'
    : design.fontSize === 'lg'
    ? 'text-[12px]'
    : 'text-[11px]';

  return (
    <div className="flex flex-col items-center space-y-4 pb-24 max-w-5xl mx-auto">
      {/* Zoom & Quick Actions Toolbar */}
      <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-xs p-3 flex flex-wrap items-center justify-between gap-3 sticky top-20 z-20 no-print print:hidden">
        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(z - 10, 60))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Reduzir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-gray-700 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 10, 150))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="px-2.5 py-1 text-xs font-bold text-[#004A8D] bg-[#004A8D]/10 hover:bg-[#004A8D]/20 rounded-lg transition-colors"
          >
            100%
          </button>
        </div>

        {/* Indicador de Modo */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isCompact ? 'Visualização Compacta (1 Folha)' : 'Visualização Completa'}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004A8D] hover:bg-[#00386c] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#F7941D]" />
            <span>Baixar PDF / Imprimir</span>
          </button>
          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Word (.docx)</span>
          </button>
          <button
            onClick={onOpenTranslate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Traduzir</span>
          </button>
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all"
          >
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Carta de Apresentação</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Preview Container */}
      <div className="w-full flex justify-center overflow-x-auto p-4">
        <div
          id="resumePrintContainer"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            fontFamily: design.fontFamily || 'Plus Jakarta Sans',
          }}
          className={`w-full max-w-[800px] min-h-[1130px] bg-white text-gray-900 shadow-2xl border border-gray-200 rounded-sm transition-transform duration-200 ${paddingClass} ${fontSizeClass} flex flex-col justify-between`}
        >
          <div className={sectionSpacingClass}>
            {/* CABEÇALHO DO CURRÍCULO */}
            <div className={`border-b-2 pb-4 ${isCompact ? 'mb-2 pb-2.5' : 'mb-4'}`} style={{ borderColor: primaryColor }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1
                    className={`font-black tracking-tight ${
                      isCompact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                    }`}
                    style={{ color: primaryColor }}
                  >
                    {data.name || 'Seu Nome Completo'}
                  </h1>

                  {data.jobTitle && (
                    <p className={`font-bold text-gray-700 mt-0.5 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                      {data.jobTitle}
                    </p>
                  )}

                  {/* Informações de Contato */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 mt-2 text-[10.5px]">
                    {fullLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {fullLocation}
                      </span>
                    )}

                    {data.phone && (
                      <span>• {data.phone}</span>
                    )}

                    {data.email && (
                      <span>• {data.email}</span>
                    )}

                    {data.maritalStatus && (
                      <span>• {data.maritalStatus}</span>
                    )}

                    {data.birthDate && (
                      <span>• {data.birthDate}</span>
                    )}

                    {data.nationality && (
                      <span>• {data.nationality}</span>
                    )}
                  </div>

                  {/* Links Profissionais & Vídeo Pitch */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#004A8D] font-medium mt-1.5 text-[10.5px]">
                    {data.linkedin && (
                      <a href={`https://${data.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                        LinkedIn: {data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                      </a>
                    )}

                    {data.github && (
                      <a href={`https://${data.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                        • GitHub: {data.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                      </a>
                    )}

                    {data.portfolio && (
                      <a href={`https://${data.portfolio.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                        • Portfólio: {data.portfolio.replace(/^https?:\/\//, '')}
                      </a>
                    )}

                    {data.videoUrl && (
                      <a
                        href={data.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-red-600 font-bold hover:underline bg-red-50 px-1.5 py-0.5 rounded"
                      >
                        <Play className="w-3 h-3 fill-red-600" />
                        <span>Vídeo Apresentação</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* FOTO DO CANDIDATO (Se presente) */}
                {data.photo && (
                  <div className="shrink-0">
                    <img
                      src={data.photo}
                      alt={data.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 shadow-xs"
                      style={{ borderColor: primaryColor }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SÍNTESE PROFISSIONAL */}
            {data.summary && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Síntese de Qualificações
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">{data.summary}</p>
              </div>
            )}

            {/* EXPERIÊNCIA PROFISSIONAL */}
            {data.experience && data.experience.length > 0 && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Experiências Profissionais
                </h2>
                <div className={itemSpacingClass}>
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-gray-900 text-[11.5px]">{exp.role}</h3>
                        {exp.startDate && <span className="text-[10px] text-gray-500 font-medium">{exp.startDate}</span>}
                      </div>
                      {exp.company && <p className="font-semibold text-gray-700 text-[10.5px]">{exp.company}</p>}
                      {exp.description && (
                        <p className="text-gray-600 mt-1 leading-relaxed text-justify whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCAÇÃO / FORMAÇÃO ACADÊMICA */}
            {data.education && data.education.length > 0 && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-2 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Formação Acadêmica
                </h2>
                <div className={itemSpacingClass}>
                  {data.education.map((edu) => (
                    <div key={edu.id} className="flex items-baseline justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{edu.course || edu.degree}</span>
                        {edu.institution && <span className="text-gray-600"> — {edu.institution}</span>}
                        {edu.period && <span className="text-gray-500 text-[10px]"> ({edu.period})</span>}
                      </div>
                      {edu.year && <span className="text-[10px] text-gray-500 font-medium shrink-0 ml-2">{edu.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TECNOLOGIAS DOMINADAS (Insight RH 9) */}
            {data.technologies && data.technologies.length > 0 && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Tecnologias Dominadas & Ferramentas
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {data.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[10.5px] font-medium border border-gray-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* HARD & SOFT SKILLS */}
            {(data.hardSkills.length > 0 || data.softSkills.length > 0) && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Principais Competências
                </h2>
                <div className="space-y-1">
                  {data.hardSkills.length > 0 && (
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Hard Skills:</strong> {data.hardSkills.join(' • ')}
                    </p>
                  )}
                  {data.softSkills.length > 0 && (
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Soft Skills:</strong> {data.softSkills.join(' • ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* CURSOS & CERTIFICAÇÕES */}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Cursos Complementares & Certificações
                </h2>
                <div className="space-y-1">
                  {data.certifications.map((c) => (
                    <div key={c.id} className="flex items-baseline justify-between text-gray-700">
                      <span>
                        <strong className="text-gray-900">{c.name}</strong>
                        {c.issuer && <span> — {c.issuer}</span>}
                      </span>
                      {c.year && <span className="text-[10px] text-gray-500 shrink-0 ml-2">{c.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJETOS & REALIZAÇÕES (COM ANEXOS PDF E LINKS) */}
            {data.projects && data.projects.length > 0 && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Projetos & Portfólio
                </h2>
                <div className={itemSpacingClass}>
                  {data.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-gray-900 text-[11px]">{proj.title}</h3>
                        {proj.year && <span className="text-[10px] text-gray-500">{proj.year}</span>}
                      </div>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-[#004A8D] font-medium text-[10px] hover:underline block truncate">
                          🔗 {proj.link}
                        </a>
                      )}
                      {proj.pdfFileName && (
                        <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-0.5 font-medium">
                          📄 Anexo: {proj.pdfFileName}
                        </span>
                      )}
                      {proj.description && <p className="text-gray-600 mt-0.5 leading-relaxed">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IDIOMAS */}
            {data.languages && data.languages.length > 0 && (
              <div>
                <h2
                  className={`font-bold uppercase tracking-wider border-b pb-0.5 mb-1.5 ${
                    isCompact ? 'text-[11px]' : 'text-xs'
                  }`}
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  Idiomas
                </h2>
                <p className="text-gray-700">
                  {data.languages.map((l) => `${l.name} (${l.level})`).join(' • ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
