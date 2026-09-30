import { useState, useRef } from 'react';
import type {
  ResumeData,
  Education,
  Experience,
  Language,
  Certification,
  ProjectOrAchievement,
  CustomSectionItem,
} from '../types';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe2,
  Award,
  FolderKanban,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Upload,
  Link,
  Check,
  Zap,
  HelpCircle,
  Video,
  Camera,
  AlertTriangle,
  FileUp,
  Cpu,
  Info,
  X,
} from 'lucide-react';
import { BRAZIL_STATES, getCitiesForState } from '../data/brazilLocations';

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

const HARD_SKILLS_SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'SQL e Banco de Dados', 'Pacote Office / Excel Avançado', 'Power BI & Dashboards', 'Figma / UI Design', 'Git & GitHub', 'Docker & Nuvem', 'AWS Cloud', 'Metodologias Ágeis (Scrum/Kanban)', 'Java', 'C# / .NET', 'Gestão de Projetos'
];

const SOFT_SKILLS_SUGGESTIONS = [
  'Comunicação Clara e Assertiva', 'Trabalho em Equipe', 'Liderança e Motivação', 'Inteligência Emocional', 'Resolução de Problemas Complexos', 'Pensamento Crítico', 'Adaptabilidade e Flexibilidade', 'Gestão do Tempo e Produtividade', 'Proatividade e Autonomia', 'Negociação e Persuasão', 'Foco em Resultados'
];

const TECH_CATEGORIES = [
  {
    id: 'office',
    label: '📊 Office & Produtividade',
    items: ['Microsoft Excel Avançado', 'Pacote Office Completo', 'Google Planilhas / Workspace', 'PowerPoint para Apresentações', 'Word Corporativo', 'Notion', 'Trello', 'Asana', 'Slack']
  },
  {
    id: 'management',
    label: '💼 Gestão, ERP & Vendas',
    items: ['SAP ERP', 'TOTVS Protheus', 'Salesforce CRM', 'HubSpot CRM', 'Power BI & Dashboards', 'RD Station', 'Bling ERP', 'Omie ERP', 'Jira Software']
  },
  {
    id: 'design',
    label: '🎨 Design & Mídia',
    items: ['Canva Pro', 'Figma / UI Design', 'Adobe Photoshop', 'Adobe Illustrator', 'CapCut / Vídeo', 'Adobe Premiere Pro', 'InDesign']
  },
  {
    id: 'service',
    label: '🎧 Atendimento & Suporte',
    items: ['Zendesk', 'WhatsApp Business', 'Intercom', 'Freshdesk', 'Chatwoot', 'Microsoft Teams', 'Zoom Meeting', 'Telefonia VoIP']
  },
  {
    id: 'operations',
    label: '🍽️ Operações, PDV & Logística',
    items: ['Sistemas de PDV / Frente de Caixa', 'Controle de Estoque (PEPS/FIFO)', 'iFood / Totens de Pedidos', 'Boas Práticas ANVISA', 'Sistemas WMS', 'Conferência de Cargas']
  },
  {
    id: 'dev',
    label: '💻 Programação & Tecnologia',
    items: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js', 'Python', 'SQL / PostgreSQL', 'Git & GitHub', 'Docker', 'AWS Cloud', 'Java', 'C# / .NET']
  }
];

const TECH_SUGGESTIONS = TECH_CATEGORIES.flatMap((c) => c.items);

const DEGREES = [
  'Ensino Fundamental',
  'Ensino Médio',
  'Ensino Técnico',
  'Graduação / Superior',
  'Pós-graduação / Especialização',
  'MBA',
  'Mestrado',
  'Doutorado'
];

const MARITAL_STATUS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável'];
const LANGUAGE_LEVELS = ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo'];
const PERIODS = ['Matutino', 'Vespertino', 'Noturno', 'Integral', 'EAD'];

function uid() {
  return Math.random().toString(36).slice(2);
}

function InputField({
  label,
  tooltip,
  ...props
}: { label: string; tooltip?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        {tooltip && (
          <span className="text-[10.5px] text-gray-400" title={tooltip}>
            ℹ️
          </span>
        )}
      </div>
      <input
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
        {...props}
      />
    </div>
  );
}

function TextareaField({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <textarea
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 resize-none transition-all duration-200 shadow-2xs"
        {...props}
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  ...props
}: { label: string; options: { value: string; label: string }[] | string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <select
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 transition-all duration-200 shadow-2xs"
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((o) => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badgeCount?: number;
  rightAction?: React.ReactNode;
}

function AccordionSection({
  title,
  icon,
  subtitle,
  isOpen,
  onToggle,
  children,
  badgeCount,
  rightAction,
}: AccordionSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden transition-all duration-200 hover:border-[#004A8D]/40">
      <div
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50/80 transition-colors text-left cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#004A8D]/10 text-[#004A8D] flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">{title}</h3>
              {badgeCount !== undefined && badgeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#004A8D]/10 text-[#004A8D] text-[11px] font-bold">
                  {badgeCount}
                </span>
              )}
            </div>
            {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {rightAction}
          <button
            type="button"
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            {isOpen ? <ChevronUp className="w-5 h-5 text-[#004A8D]" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4 animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

interface FormPanelProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenSynthesis: () => void;
  onOpenStar: (expId?: string) => void;
  onOpenReview: () => void;
  onOpenAts: () => void;
  onOpenImport: () => void;
  onOpenCanva: () => void;
  onOpenVideoExplainer: () => void;
  onOpenSkillsExplainer: () => void;
}

export default function FormPanel({
  data,
  onChange,
  onOpenSynthesis,
  onOpenStar,
  onOpenReview,
  onOpenAts,
  onOpenImport,
  onOpenCanva,
  onOpenVideoExplainer,
  onOpenSkillsExplainer,
}: FormPanelProps) {
  // Controle de seções abertas (por padrão, Dados Pessoais e Objetivo abertos para início suave)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    technologies: false,
    languages: false,
    certifications: false,
    projects: false,
    custom: false,
  });

  // Inputs para tags customizadas
  const [customHardSkillInput, setCustomHardSkillInput] = useState('');
  const [customSoftSkillInput, setCustomSoftSkillInput] = useState('');
  const [customTechInput, setCustomTechInput] = useState('');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [techCategoryTab, setTechCategoryTab] = useState('all');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const projectPdfRef = useRef<HTMLInputElement>(null);
  const [activeProjectPdfId, setActiveProjectPdfId] = useState<string | null>(null);

  function toggleSection(sec: string) {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  }

  function update(patch: Partial<ResumeData>) {
    onChange({ ...data, ...patch });
  }

  function togglePersonalField(field: keyof typeof data.enabledPersonalFields) {
    update({
      enabledPersonalFields: {
        ...data.enabledPersonalFields,
        [field]: !data.enabledPersonalFields[field],
      },
    });
  }

  function toggleMainSection(sec: keyof typeof data.enabledSections) {
    const nextVal = !data.enabledSections[sec];
    update({
      enabledSections: {
        ...data.enabledSections,
        [sec]: nextVal,
      },
    });
    if (nextVal) {
      setOpenSections((prev) => ({ ...prev, [sec]: true }));
    }
  }

  // Tratamento de foto
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('A foto deve ter no máximo 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        update({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemovePhoto() {
    update({ photo: '' });
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  // Manipulação de Estado (UF) e Cidade dinâmica
  function handleStateChange(newState: string) {
    setIsCustomCity(false);
    update({
      state: newState,
      city: '', // limpa cidade ao trocar o estado
    });
  }

  // Adição de Skills customizadas
  function addCustomHardSkill() {
    const trimmed = customHardSkillInput.trim();
    if (trimmed && !data.hardSkills.includes(trimmed)) {
      update({ hardSkills: [...data.hardSkills, trimmed] });
      setCustomHardSkillInput('');
    }
  }

  function addCustomSoftSkill() {
    const trimmed = customSoftSkillInput.trim();
    if (trimmed && !data.softSkills.includes(trimmed)) {
      update({ softSkills: [...data.softSkills, trimmed] });
      setCustomSoftSkillInput('');
    }
  }

  function addCustomTech() {
    const trimmed = customTechInput.trim();
    const currentTechs = data.technologies || [];
    if (trimmed && !currentTechs.includes(trimmed)) {
      update({ technologies: [...currentTechs, trimmed] });
      setCustomTechInput('');
    }
  }

  function toggleSkillItem(list: string[], item: string, key: 'hardSkills' | 'softSkills' | 'technologies') {
    if (list.includes(item)) {
      update({ [key]: list.filter((i) => i !== item) });
    } else {
      update({ [key]: [...list, item] });
    }
  }

  // Anexo de PDF em Projetos
  function handleProjectPdfUpload(projectId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('O documento PDF deve ter no máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const next = data.projects.map((p) =>
          p.id === projectId
            ? { ...p, pdfFileName: file.name, pdfData: reader.result as string }
            : p
        );
        update({ projects: next });
      };
      reader.readAsDataURL(file);
    }
  }

  function removeProjectPdf(projectId: string) {
    const next = data.projects.map((p) =>
      p.id === projectId ? { ...p, pdfFileName: undefined, pdfData: undefined } : p
    );
    update({ projects: next });
  }

  const citiesList = getCitiesForState(data.state);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24">
      {/* 1. BARRA SUPERIOR DE IMPORTAÇÃO & INTEGRAÇÕES */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#004A8D]/10 text-[#004A8D] flex items-center justify-center">
            <Upload className="w-4 h-4 text-[#F7941D]" />
          </div>
          <span className="text-xs font-bold text-gray-800">Agilize seu preenchimento:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenImport}
            className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#004A8D]" />
            <span>Upload PDF / Word</span>
          </button>

          <button
            type="button"
            onClick={onOpenImport}
            className="px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Link className="w-3.5 h-3.5 text-[#004A8D]" />
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={onOpenCanva}
            className="px-3 py-1.5 rounded-xl border border-[#7D2AE8]/30 bg-[#7D2AE8]/5 hover:bg-[#7D2AE8]/10 text-[#7D2AE8] text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span>🎨 Importar / Canva</span>
          </button>
        </div>
      </div>

      {/* 2. DADOS PESSOAIS */}
      <AccordionSection
        id="personal"
        title="Dados Pessoais"
        subtitle="Nome, contato, localização e links profissionais"
        icon={<User className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.personal}
        onToggle={() => toggleSection('personal')}
      >
        <div className="space-y-4 pt-2">
          {/* Nome e Cargo Pretendido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Nome Completo *"
              placeholder="Ex: Maria Silva Santos"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Cargo Pretendido / Objetivo Profissional *
                </label>
                <button
                  type="button"
                  onClick={onOpenAts}
                  className="text-[11px] text-[#004A8D] hover:text-[#00386c] font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors"
                  title="Abrir painel e dicas de otimização ATS"
                >
                  💡 Dica ATS
                </button>
              </div>
              <input
                type="text"
                placeholder="Ex: Assistente Administrativo | Desenvolvedor Frontend"
                value={data.jobTitle}
                onChange={(e) => update({ jobTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
              />
            </div>
          </div>

          {/* Email e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="E-mail *"
              type="email"
              placeholder="Ex: maria.santos@email.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              inputMode="email"
              required
            />
            <InputField
              label="Telefone / WhatsApp *"
              type="tel"
              placeholder="Ex: (11) 99999-9999"
              value={data.phone}
              onChange={(e) => update({ phone: formatPhone(e.target.value) })}
              maxLength={15}
              inputMode="tel"
              required
            />
          </div>

          {/* ESTADO (UF) PRIMEIRO & CIDADE DEPOIS DINÂMICA (Insight RH 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Estado (UF) *
              </label>
              <select
                value={data.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 transition-all duration-200 shadow-2xs"
              >
                <option value="">Selecione o Estado...</option>
                {BRAZIL_STATES.map((s) => (
                  <option key={s.sigla} value={s.sigla}>
                    {s.sigla} - {s.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Cidade *
              </label>
              {data.state && citiesList.length > 0 ? (
                isCustomCity ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Digite o nome da sua cidade"
                      value={data.city}
                      onChange={(e) => update({ city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCity(false);
                        update({ city: '' });
                      }}
                      className="text-[11px] text-[#004A8D] hover:underline font-semibold"
                    >
                      ← Voltar para seleção da lista
                    </button>
                  </div>
                ) : (
                  <select
                    value={citiesList.includes(data.city) ? data.city : (data.city ? 'OUTRA' : '')}
                    onChange={(e) => {
                      if (e.target.value === 'OUTRA') {
                        setIsCustomCity(true);
                        update({ city: '' });
                      } else {
                        update({ city: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 transition-all duration-200 shadow-2xs"
                  >
                    <option value="">Selecione a Cidade...</option>
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="OUTRA">Outra cidade (Digitar manualmente)...</option>
                  </select>
                )
              ) : (
                <input
                  type="text"
                  placeholder={data.state ? 'Digite sua cidade' : 'Selecione o Estado primeiro'}
                  value={data.city}
                  onChange={(e) => update({ city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              )}
            </div>
          </div>

          {/* MÓDULO DE FOTO COM DISCLAIMER DE RH (Insight RH 2) */}
          {data.enabledPersonalFields.photo && (
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#004A8D]" />
                  <span className="text-xs font-bold text-gray-900">Foto de Perfil do Candidato</span>
                </div>
                <button
                  type="button"
                  onClick={() => togglePersonalField('photo')}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Remover Campo
                </button>
              </div>

              {/* Disclaimer de RH */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Nota de Recomendação de RH:</strong> A inclusão de fotos em currículos{' '}
                  <strong>não é recomendada</strong> para a maioria das vagas corporativas atuais, pois pode gerar viés em triagens e sistemas ATS, salvo exigência expressa da vaga ou cargos públicos/artísticos.
                </div>
              </div>

              <div className="flex items-center gap-4">
                {data.photo ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#004A8D] shadow-sm">
                    <img src={data.photo} alt="Foto do candidato" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs"
                      title="Remover foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <User className="w-7 h-7" />
                  </div>
                )}

                <div>
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photoUploadInput"
                  />
                  <label
                    htmlFor="photoUploadInput"
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:border-[#004A8D] text-xs font-bold text-gray-700 cursor-pointer inline-flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#004A8D]" />
                    <span>{data.photo ? 'Trocar Foto' : 'Selecionar Foto (PNG/JPG)'}</span>
                  </label>
                  {data.photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="ml-2 text-xs text-red-600 hover:underline font-bold"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VÍDEO APRESENTAÇÃO (YOUTUBE) + MODAL (?) (Insight RH 3) */}
          {data.enabledPersonalFields.videoUrl && (
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold text-gray-900">Vídeo Apresentação (Pitch no YouTube)</span>
                  <button
                    type="button"
                    onClick={onOpenVideoExplainer}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="O que é Vídeo Pitch? Clique para entender"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => togglePersonalField('videoUrl')}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Remover
                </button>
              </div>

              <input
                type="url"
                placeholder="Ex: https://youtu.be/seu-video-pitch (Apenas YouTube)"
                value={data.videoUrl || ''}
                onChange={(e) => update({ videoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <p className="text-[11px] text-gray-500">
                ⚠️ Aceito apenas links do YouTube (público ou não listado). Será incluído como link direto no currículo.
              </p>
            </div>
          )}

          {/* Campos Opcionais Ativados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.enabledPersonalFields.birthDate && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Data de Nascimento / Idade</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('birthDate');
                      update({ birthDate: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: 25 anos ou 15/04/1999"
                  value={data.birthDate || ''}
                  onChange={(e) => update({ birthDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              </div>
            )}

            {data.enabledPersonalFields.maritalStatus && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Estado Civil</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('maritalStatus');
                      update({ maritalStatus: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <select
                  value={data.maritalStatus || ''}
                  onChange={(e) => update({ maritalStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 transition-all duration-200 shadow-2xs"
                >
                  <option value="">Selecione...</option>
                  {MARITAL_STATUS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {data.enabledPersonalFields.linkedin && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">LinkedIn</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('linkedin');
                      update({ linkedin: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: linkedin.com/in/seunome"
                  value={data.linkedin || ''}
                  onChange={(e) => update({ linkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              </div>
            )}

            {data.enabledPersonalFields.github && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">GitHub</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('github');
                      update({ github: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: github.com/seunome"
                  value={data.github || ''}
                  onChange={(e) => update({ github: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              </div>
            )}

            {data.enabledPersonalFields.portfolio && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Portfólio / Site Pessoal</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('portfolio');
                      update({ portfolio: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: seunome.dev ou behance.net/seunome"
                  value={data.portfolio || ''}
                  onChange={(e) => update({ portfolio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              </div>
            )}

            {data.enabledPersonalFields.driverLicense && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">CNH (Carteira de Habilitação)</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('driverLicense');
                      update({ driverLicense: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Categoria B (Carro)"
                  value={data.driverLicense || ''}
                  onChange={(e) => update({ driverLicense: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              </div>
            )}

            {data.enabledPersonalFields.nationality && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Nacionalidade / Naturalidade</label>
                  <button
                    type="button"
                    onClick={() => {
                      togglePersonalField('nationality');
                      update({ nationality: '' });
                    }}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Remover campo"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remover</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Ex: Brasileira / São Paulo, SP"
                  value={data.nationality || ''}
                  onChange={(e) => update({ nationality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 placeholder-gray-400 transition-all duration-200 shadow-2xs"
                />
              </div>
            )}
          </div>

          {/* CHIPS PARA ADICIONAR CAMPOS PESSOAIS (Estilo Jobseeker) */}
          <div className="pt-2">
            <span className="text-xs font-bold text-gray-700 block mb-2">
              Adicionar campos extras aos Dados Pessoais:
            </span>
            <div className="flex flex-wrap gap-2">
              {!data.enabledPersonalFields.photo && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('photo')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Foto de Perfil</span>
                </button>
              )}

              {!data.enabledPersonalFields.videoUrl && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('videoUrl')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-red-500 hover:bg-red-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-red-500" />
                  <span>Vídeo Pitch (YouTube)</span>
                </button>
              )}

              {!data.enabledPersonalFields.linkedin && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('linkedin')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>LinkedIn</span>
                </button>
              )}

              {!data.enabledPersonalFields.github && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('github')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>GitHub</span>
                </button>
              )}

              {!data.enabledPersonalFields.portfolio && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('portfolio')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Portfólio</span>
                </button>
              )}

              {!data.enabledPersonalFields.birthDate && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('birthDate')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Data de Nascimento / Idade</span>
                </button>
              )}

              {!data.enabledPersonalFields.maritalStatus && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('maritalStatus')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Estado Civil</span>
                </button>
              )}

              {!data.enabledPersonalFields.driverLicense && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('driverLicense')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>CNH</span>
                </button>
              )}

              {!data.enabledPersonalFields.nationality && (
                <button
                  type="button"
                  onClick={() => togglePersonalField('nationality')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-[#004A8D] text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                  <span>Nacionalidade</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* 3. RESUMO PROFISSIONAL / SÍNTESE COM IA CONTEXTUAL (Insight RH 5) */}
      <AccordionSection
        id="summary"
        title="Resumo Profissional / Síntese"
        subtitle="Breve visão geral da sua trajetória e competências"
        icon={<FileText className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.summary}
        onToggle={() => toggleSection('summary')}
        rightAction={
          <button
            type="button"
            onClick={onOpenSynthesis}
            className="px-3 py-1.5 rounded-xl bg-[#004A8D]/10 hover:bg-[#004A8D]/20 text-[#004A8D] text-xs font-bold flex items-center gap-1.5 transition-all"
            title="A IA lê seu cargo e sugere 3 opções de síntese profissional"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
            <span>Gerar com IA</span>
          </button>
        }
      >
        <div className="space-y-3 pt-2">
          <TextareaField
            label="Síntese de Qualificações"
            rows={4}
            placeholder="Breve resumo profissional destacando sua bagagem, principais competências, entregas de valor e resultados alcançados..."
            value={data.summary}
            onChange={(e) => update({ summary: e.target.value })}
          />
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>💡 Dica: 3 a 5 linhas objetivas são suficientes para encantar recrutadores.</span>
            <button
              type="button"
              onClick={onOpenSynthesis}
              className="text-[#004A8D] font-bold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#F7941D]" />
              Ver modelos de síntese prontos
            </button>
          </div>
        </div>
      </AccordionSection>

      {/* 4. EXPERIÊNCIAS PROFISSIONAIS COM METODOLOGIA STAR (Insight RH 5) */}
      <AccordionSection
        id="experience"
        title="Experiência Profissional"
        subtitle="Cargos, empresas e principais realizações"
        icon={<Briefcase className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.experience}
        onToggle={() => toggleSection('experience')}
        badgeCount={data.experience.length}
      >
        <div className="space-y-4 pt-2">
          {data.experience.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 font-medium">Nenhuma experiência adicionada ainda.</p>
              <button
                type="button"
                onClick={() =>
                  update({
                    experience: [
                      ...data.experience,
                      {
                        id: uid(),
                        role: '',
                        company: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: '',
                      },
                    ],
                  })
                }
                className="mt-2 px-4 py-2 rounded-xl bg-[#004A8D] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                Adicionar Experiência
              </button>
            </div>
          ) : (
            data.experience.map((exp, idx) => (
              <div key={exp.id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    {exp.role || exp.company ? `${exp.role || 'Cargo'} na ${exp.company || 'Empresa'}` : `Experiência ${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => update({ experience: data.experience.filter((e) => e.id !== exp.id) })}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    title="Remover esta experiência"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField
                    label="Cargo *"
                    placeholder="Ex: Assistente de TI | Analista de Projetos"
                    value={exp.role}
                    onChange={(e) =>
                      update({
                        experience: data.experience.map((it) =>
                          it.id === exp.id ? { ...it, role: e.target.value } : it
                        ),
                      })
                    }
                  />
                  <InputField
                    label="Empresa *"
                    placeholder="Ex: Tech Solutions Ltda"
                    value={exp.company}
                    onChange={(e) =>
                      update({
                        experience: data.experience.map((it) =>
                          it.id === exp.id ? { ...it, company: e.target.value } : it
                        ),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField
                    label="Período / Ano"
                    placeholder="Ex: Março de 2022 até o momento ou 2021 - 2023"
                    value={exp.startDate}
                    onChange={(e) =>
                      update({
                        experience: data.experience.map((it) =>
                          it.id === exp.id ? { ...it, startDate: e.target.value } : it
                        ),
                      })
                    }
                  />
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) =>
                          update({
                            experience: data.experience.map((it) =>
                              it.id === exp.id ? { ...it, current: e.target.checked } : it
                            ),
                          })
                        }
                        className="rounded text-[#004A8D] focus:ring-[#004A8D]"
                      />
                      <span>Trabalho atualmente nesta empresa</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Descrição das Atividades & Conquistas
                    </label>
                    <button
                      type="button"
                      onClick={() => onOpenStar(exp.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#004A8D]/10 hover:bg-[#004A8D]/20 text-[#004A8D] text-[11px] font-bold flex items-center gap-1 transition-all"
                      title="Reescrever descrição utilizando a metodologia STAR (Situação, Tarefa, Ação, Resultado)"
                    >
                      <Sparkles className="w-3 h-3 text-[#F7941D]" />
                      <span>Melhorar com IA (STAR)</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Descreva suas principais responsabilidades, projetos entregues e resultados obtidos..."
                    value={exp.description}
                    onChange={(e) =>
                      update({
                        experience: data.experience.map((it) =>
                          it.id === exp.id ? { ...it, description: e.target.value } : it
                        ),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:border-[#004A8D] focus:ring-2 focus:ring-[#004A8D]/20 resize-none shadow-2xs"
                  />
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() =>
              update({
                experience: [
                  ...data.experience,
                  {
                    id: uid(),
                    role: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  },
                ],
              })
            }
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#004A8D]/30 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-[#004A8D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#F7941D]" />
            <span>+ Adicionar Outra Experiência</span>
          </button>
        </div>
      </AccordionSection>

      {/* 5. FORMAÇÃO ACADÊMICA */}
      <AccordionSection
        id="education"
        title="Educação / Formação Acadêmica"
        subtitle="Cursos, graduação, técnicos e especializações"
        icon={<GraduationCap className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.education}
        onToggle={() => toggleSection('education')}
        badgeCount={data.education.length}
      >
        <div className="space-y-4 pt-2">
          {data.education.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500 font-medium">Nenhuma formação acadêmica cadastrada.</p>
              <button
                type="button"
                onClick={() =>
                  update({
                    education: [
                      ...data.education,
                      {
                        id: uid(),
                        degree: 'Graduação / Superior',
                        course: '',
                        institution: '',
                        year: '',
                        period: 'Noturno',
                      },
                    ],
                  })
                }
                className="mt-2 px-4 py-2 rounded-xl bg-[#004A8D] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#F7941D]" />
                Adicionar Formação
              </button>
            </div>
          ) : (
            data.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    {edu.course || edu.institution
                      ? `${edu.degree || 'Formação'}: ${edu.course || ''} (${edu.institution || ''})`
                      : `Formação ${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => update({ education: data.education.filter((e) => e.id !== edu.id) })}
                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                    title="Remover esta formação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Grau de Escolaridade</label>
                    <select
                      value={edu.degree}
                      onChange={(e) =>
                        update({
                          education: data.education.map((it) =>
                            it.id === edu.id ? { ...it, degree: e.target.value } : it
                          ),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white"
                    >
                      <option value="">Selecione...</option>
                      {DEGREES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Curso / Especialidade *"
                    placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                    value={edu.course}
                    onChange={(e) =>
                      update({
                        education: data.education.map((it) =>
                          it.id === edu.id ? { ...it, course: e.target.value } : it
                        ),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <InputField
                    label="Instituição de Ensino *"
                    placeholder="Ex: SENAC / USP / FGV"
                    value={edu.institution}
                    onChange={(e) =>
                      update({
                        education: data.education.map((it) =>
                          it.id === edu.id ? { ...it, institution: e.target.value } : it
                        ),
                      })
                    }
                  />

                  <InputField
                    label="Ano de Conclusão / Previsão"
                    placeholder="Ex: 2025 ou Concluído em 2023"
                    value={edu.year}
                    onChange={(e) =>
                      update({
                        education: data.education.map((it) =>
                          it.id === edu.id ? { ...it, year: e.target.value } : it
                        ),
                      })
                    }
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Turno</label>
                    <select
                      value={edu.period}
                      onChange={(e) =>
                        update({
                          education: data.education.map((it) =>
                            it.id === edu.id ? { ...it, period: e.target.value } : it
                          ),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white"
                    >
                      <option value="">Selecione...</option>
                      {PERIODS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={() =>
              update({
                education: [
                  ...data.education,
                  {
                    id: uid(),
                    degree: 'Graduação / Superior',
                    course: '',
                    institution: '',
                    year: '',
                    period: 'Noturno',
                  },
                ],
              })
            }
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#004A8D]/30 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-[#004A8D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#F7941D]" />
            <span>+ Adicionar Outra Formação</span>
          </button>
        </div>
      </AccordionSection>

      {/* 6. COMPETÊNCIAS: HARD & SOFT SKILLS + BOTÃO (?) (Insight RH 4 & 9) */}
      <AccordionSection
        id="skills"
        title="Hard Skills & Soft Skills"
        subtitle="Competências técnicas e comportamentais personalizadas"
        icon={<Wrench className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.skills}
        onToggle={() => toggleSection('skills')}
        badgeCount={data.hardSkills.length + data.softSkills.length}
        rightAction={
          <button
            type="button"
            onClick={onOpenSkillsExplainer}
            className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition-all"
            title="Entenda a diferença entre Hard Skills e Soft Skills"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#004A8D]" />
            <span>O que são?</span>
          </button>
        }
      >
        <div className="space-y-6 pt-2">
          {/* HARD SKILLS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">⚙️ Hard Skills (Técnicas)</h4>
                <p className="text-[11px] text-gray-500">Ferramentas, linguagens e conhecimentos mensuráveis</p>
              </div>
              <span className="text-xs font-bold text-[#004A8D]">{data.hardSkills.length} selecionadas</span>
            </div>

            {/* Input para adicionar Hard Skill customizada (Insight RH 9) */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digitar Hard Skill personalizada (Ex: Next.js, SAP, AutoCAD...)"
                value={customHardSkillInput}
                onChange={(e) => setCustomHardSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHardSkill())}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
              />
              <button
                type="button"
                onClick={addCustomHardSkill}
                disabled={!customHardSkillInput.trim()}
                className="px-4 py-2 bg-[#004A8D] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all"
              >
                + Adicionar
              </button>
            </div>

            {/* Nuvem de tags ativas com botão remover */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-gray-50 rounded-xl border border-gray-200">
              {data.hardSkills.length === 0 ? (
                <span className="text-[11px] text-gray-400">Nenhuma Hard Skill selecionada. Clique nas sugestões abaixo ou digite acima.</span>
              ) : (
                data.hardSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#004A8D] text-white text-xs font-semibold shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => toggleSkillItem(data.hardSkills, skill, 'hardSkills')}
                      className="hover:text-[#F7941D] text-white/80 transition-colors"
                      title="Remover"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Sugestões Rápidas */}
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1.5">💡 Sugestões em alta no mercado:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {HARD_SKILLS_SUGGESTIONS.filter((s) => !data.hardSkills.includes(s)).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkillItem(data.hardSkills, s, 'hardSkills')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-gray-700 text-xs font-medium transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SOFT SKILLS */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900">🧠 Soft Skills (Comportamentais)</h4>
                <p className="text-[11px] text-gray-500">Inteligência emocional, comunicação e relacionamento</p>
              </div>
              <span className="text-xs font-bold text-[#F7941D]">{data.softSkills.length} selecionadas</span>
            </div>

            {/* Input para adicionar Soft Skill customizada */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digitar Soft Skill personalizada (Ex: Storytelling, Mediação de Conflitos...)"
                value={customSoftSkillInput}
                onChange={(e) => setCustomSoftSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSoftSkill())}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
              />
              <button
                type="button"
                onClick={addCustomSoftSkill}
                disabled={!customSoftSkillInput.trim()}
                className="px-4 py-2 bg-[#F7941D] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all"
              >
                + Adicionar
              </button>
            </div>

            {/* Nuvem de tags ativas */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-gray-50 rounded-xl border border-gray-200">
              {data.softSkills.length === 0 ? (
                <span className="text-[11px] text-gray-400">Nenhuma Soft Skill selecionada. Clique nas sugestões abaixo ou digite acima.</span>
              ) : (
                data.softSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7941D] text-white text-xs font-semibold shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => toggleSkillItem(data.softSkills, skill, 'softSkills')}
                      className="hover:text-black text-white/80 transition-colors"
                      title="Remover"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Sugestões Rápidas */}
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1.5">💡 Sugestões comportamentais:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {SOFT_SKILLS_SUGGESTIONS.filter((s) => !data.softSkills.includes(s)).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkillItem(data.softSkills, s, 'softSkills')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-[#F7941D] hover:bg-[#F7941D]/5 text-gray-700 text-xs font-medium transition-all"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* 7. TECNOLOGIAS DOMINADAS (Insight RH 9) */}
      <AccordionSection
        id="technologies"
        title="Tecnologias Dominadas"
        subtitle="Linguagens, frameworks, banco de dados, softwares e ERPs"
        icon={<Cpu className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.technologies}
        onToggle={() => toggleSection('technologies')}
        badgeCount={(data.technologies || []).length}
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-gray-600">
            Destaque as principais ferramentas de trabalho e softwares que você domina com fluência técnica.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Next.js, Tailwind CSS, PostgreSQL, Docker, AWS S3..."
              value={customTechInput}
              onChange={(e) => setCustomTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTech())}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
            />
            <button
              type="button"
              onClick={addCustomTech}
              disabled={!customTechInput.trim()}
              className="px-4 py-2 bg-[#004A8D] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all"
            >
              + Adicionar
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-gray-50 rounded-xl border border-gray-200">
            {(data.technologies || []).length === 0 ? (
              <span className="text-[11px] text-gray-400">Nenhuma tecnologia adicionada. Digite acima ou clique nas sugestões abaixo.</span>
            ) : (
              (data.technologies || []).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-2xs"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => toggleSkillItem(data.technologies || [], tech, 'technologies')}
                    className="hover:text-black text-white/80 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Sugestões de Ferramentas e Stacks com Categorias Diversificadas */}
          <div>
            <span className="text-[11px] font-bold text-gray-700 block mb-2">
              💡 Sugestões de ferramentas e stacks (por segmento de atuação):
            </span>
            
            {/* Abas de Categorias */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar mb-2">
              <button
                type="button"
                onClick={() => setTechCategoryTab('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  techCategoryTab === 'all'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos os Segmentos
              </button>
              {TECH_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTechCategoryTab(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    techCategoryTab === cat.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Pílulas de Sugestão */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50/70 rounded-xl border border-gray-100">
              {(techCategoryTab === 'all'
                ? TECH_SUGGESTIONS
                : TECH_CATEGORIES.find((c) => c.id === techCategoryTab)?.items || []
              )
                .filter((t) => !(data.technologies || []).includes(t))
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleSkillItem(data.technologies || [], t, 'technologies')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 text-gray-700 text-xs font-medium transition-all"
                  >
                    + {t}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* 8. IDIOMAS */}
      <AccordionSection
        id="languages"
        title="Idiomas"
        subtitle="Línguas e nível de proficiência"
        icon={<Globe2 className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.languages}
        onToggle={() => toggleSection('languages')}
        badgeCount={data.languages.length}
      >
        <div className="space-y-4 pt-2">
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <input
                type="text"
                placeholder="Ex: Inglês, Espanhol, Francês"
                value={lang.name}
                onChange={(e) =>
                  update({
                    languages: data.languages.map((l) => (l.id === lang.id ? { ...l, name: e.target.value } : l)),
                  })
                }
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
              />
              <select
                value={lang.level}
                onChange={(e) =>
                  update({
                    languages: data.languages.map((l) => (l.id === lang.id ? { ...l, level: e.target.value } : l)),
                  })
                }
                className="w-36 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
              >
                {LANGUAGE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => update({ languages: data.languages.filter((l) => l.id !== lang.id) })}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              update({
                languages: [...data.languages, { id: uid(), name: '', level: 'Intermediário' }],
              })
            }
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#004A8D]/30 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-[#004A8D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#F7941D]" />
            <span>+ Adicionar Idioma</span>
          </button>
        </div>
      </AccordionSection>

      {/* 9. PROJETOS & REALIZAÇÕES COM UPLOAD DE PDF E LINKS AMPLIADOS (Insight RH 8) */}
      <AccordionSection
        id="projects"
        title="Projetos & Realizações"
        subtitle="Portfólio com anexo de PDF descritivo e links ampliados"
        icon={<FolderKanban className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.projects}
        onToggle={() => toggleSection('projects')}
        badgeCount={data.projects.length}
      >
        <div className="space-y-4 pt-2">
          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  {proj.title ? proj.title : `Projeto ${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => update({ projects: data.projects.filter((p) => p.id !== proj.id) })}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Nome do Projeto / Realização *"
                  placeholder="Ex: Plataforma E-commerce B2B"
                  value={proj.title}
                  onChange={(e) =>
                    update({
                      projects: data.projects.map((p) => (p.id === proj.id ? { ...p, title: e.target.value } : p)),
                    })
                  }
                />
                <InputField
                  label="Ano / Período"
                  placeholder="Ex: 2024"
                  value={proj.year || ''}
                  onChange={(e) =>
                    update({
                      projects: data.projects.map((p) => (p.id === proj.id ? { ...p, year: e.target.value } : p)),
                    })
                  }
                />
              </div>

              {/* Link Ampliado com Legenda de RH (Insight RH 8) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Link do Projeto / Portfólio (GitHub, Behance, Figma, Google Drive, Notícias ou Link Externo)
                </label>
                <input
                  type="url"
                  placeholder="https://behance.net/projeto ou https://github.com/... ou https://drive.google.com/..."
                  value={proj.link || ''}
                  onChange={(e) =>
                    update({
                      projects: data.projects.map((p) => (p.id === proj.id ? { ...p, link: e.target.value } : p)),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white"
                />
              </div>

              {/* Upload de Documento PDF do Projeto (Insight RH 8) */}
              <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                <span className="text-xs font-semibold text-gray-700 block">
                  📄 Anexo de PDF Descritivo do Projeto / Portfólio (Opcional):
                </span>

                {proj.pdfFileName ? (
                  <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                    <span className="font-bold text-[#004A8D] truncate">{proj.pdfFileName}</span>
                    <button
                      type="button"
                      onClick={() => removeProjectPdf(proj.id)}
                      className="text-red-500 hover:underline text-xs font-bold"
                    >
                      Remover PDF
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      id={`projectPdf-${proj.id}`}
                      onChange={(e) => handleProjectPdfUpload(proj.id, e)}
                      className="hidden"
                    />
                    <label
                      htmlFor={`projectPdf-${proj.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#004A8D] text-xs font-bold text-gray-700 cursor-pointer inline-flex items-center gap-1.5 transition-all"
                    >
                      <FileUp className="w-3.5 h-3.5 text-[#004A8D]" />
                      <span>Anexar PDF do Projeto (Máx 5MB)</span>
                    </label>
                  </div>
                )}
              </div>

              <TextareaField
                label="Descrição / Resultados do Projeto"
                rows={2}
                placeholder="Principais tecnologias empregadas, impacto do projeto e métricas de sucesso..."
                value={proj.description}
                onChange={(e) =>
                  update({
                    projects: data.projects.map((p) => (p.id === proj.id ? { ...p, description: e.target.value } : p)),
                  })
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              update({
                projects: [
                  ...data.projects,
                  {
                    id: uid(),
                    title: '',
                    description: '',
                    link: '',
                    year: '',
                  },
                ],
              })
            }
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#004A8D]/30 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-[#004A8D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#F7941D]" />
            <span>+ Adicionar Projeto ou Realização</span>
          </button>
        </div>
      </AccordionSection>

      {/* 10. CERTIFICAÇÕES */}
      <AccordionSection
        id="certifications"
        title="Cursos Complementares & Certificações"
        subtitle="Cursos livres, licenças e certificados profissionais"
        icon={<Award className="w-5 h-5 text-[#004A8D]" />}
        isOpen={openSections.certifications}
        onToggle={() => toggleSection('certifications')}
        badgeCount={data.certifications.length}
      >
        <div className="space-y-4 pt-2">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
              <input
                type="text"
                placeholder="Nome do Curso / Certificação"
                value={cert.name}
                onChange={(e) =>
                  update({
                    certifications: data.certifications.map((c) =>
                      c.id === cert.id ? { ...c, name: e.target.value } : c
                    ),
                  })
                }
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Instituição Emissora (Ex: Udemy, Alura)"
                value={cert.issuer}
                onChange={(e) =>
                  update({
                    certifications: data.certifications.map((c) =>
                      c.id === cert.id ? { ...c, issuer: e.target.value } : c
                    ),
                  })
                }
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ano / Carga (Ex: 2024 - 40h)"
                  value={cert.year}
                  onChange={(e) =>
                    update({
                      certifications: data.certifications.map((c) =>
                        c.id === cert.id ? { ...c, year: e.target.value } : c
                      ),
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={() => update({ certifications: data.certifications.filter((c) => c.id !== cert.id) })}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              update({
                certifications: [...data.certifications, { id: uid(), name: '', issuer: '', year: '' }],
              })
            }
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#004A8D]/30 hover:border-[#004A8D] hover:bg-[#004A8D]/5 text-[#004A8D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-[#F7941D]" />
            <span>+ Adicionar Certificação / Curso</span>
          </button>
        </div>
      </AccordionSection>

      {/* 11. NOTA DE RODAPÉ EXPLICATIVA DO FORMULÁRIO (Insight RH 4) */}
      <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 text-xs text-[#004A8D] flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-[#F7941D] shrink-0 mt-0.5" />
        <div className="text-[11.5px] leading-relaxed">
          <strong className="block text-gray-900 mb-0.5">Como personalizar seu documento:</strong>
          Utilize os botões <strong className="text-[#004A8D]">+</strong> ao final de cada seção para incluir novos campos ou o ícone de lixeira (<Trash2 className="w-3.5 h-3.5 inline text-red-500" />) para remover informações não obrigatórias.
        </div>
      </div>
    </div>
  );
}
