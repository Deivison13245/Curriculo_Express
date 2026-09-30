import { useState } from 'react';
import Modal from './Modal';
import { callGemini } from '../../services/aiService';
import { Sparkles, Briefcase, ChefHat, Building2, TrendingUp, Cpu, Headphones, Truck, HeartPulse, GraduationCap } from 'lucide-react';

interface SynthesisModalProps {
  jobTitle: string;
  onApply: (text: string) => void;
  onClose: () => void;
}

interface SynthesisTemplate {
  type: string;
  category: string;
  icon: string;
  label: string;
  description: string;
  color: string;
  bg: string;
  text: (title: string) => string;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos os Setores' },
  { id: 'admin', label: 'Administrativo & Operações' },
  { id: 'sales', label: 'Vendas & Comercial' },
  { id: 'culinary', label: 'Gastronomia & Culinária' },
  { id: 'tech', label: 'Tecnologia & TI' },
  { id: 'service', label: 'Atendimento & Suporte' },
  { id: 'exec', label: 'Executivo & Liderança' },
  { id: 'logistics', label: 'Logística & Estoque' },
  { id: 'health', label: 'Saúde & Cuidados' },
];

const SYNTHESES: SynthesisTemplate[] = [
  {
    type: 'admin',
    category: 'admin',
    icon: '📋',
    label: 'Administrativo & Gestão de Rotinas',
    description: 'Organização de processos, planilhas e rotinas de escritório',
    color: '#0284c7',
    bg: '#f0f9ff',
    text: (title: string) => `Profissional organizado(a) e proativo(a) atuando como ${title || 'Assistente / Analista Administrativo'}, com sólida experiência na gestão de rotinas de escritório, controle de fluxo de documentos, contas e atendimento corporativo. Domínio em Pacote Office (Excel intermediário/avançado) e sistemas ERP. Foco em otimização de tempo, padronização de arquivos e suporte eficiente a equipes multidisciplinares e diretorias.`,
  },
  {
    type: 'sales_b2b',
    category: 'sales',
    icon: '🤝',
    label: 'Vendas Institucionais & B2B',
    description: 'Prospecção ativa, negociação corporativa e superação de metas',
    color: '#059669',
    bg: '#ecfdf5',
    text: (title: string) => `Especialista comercial em ${title || 'Vendas Institucionais e Consultivas (B2B)'}, com histórico comprovado na prospecção de novos clientes, negociação de contratos de médio e grande porte e fidelização de contas estratégicas. Habilidade em técnicas de qualificação (SPIN Selling, Inside Sales), gestão de funil via CRM e apresentação de propostas comerciais de alto valor agregado, focado em superar metas de receita.`,
  },
  {
    type: 'culinary',
    category: 'culinary',
    icon: '🍳',
    label: 'Gastronomia, Cozinha & Alimentos',
    description: 'Preparo técnico, controle de insumos e boas práticas ANVISA',
    color: '#d97706',
    bg: '#fffbeb',
    text: (title: string) => `Profissional de culinária e gastronomia atuando como ${title || 'Cozinheiro(a) / Chefe de Praça'}, com amplo domínio em técnicas de pré-preparo (mise en place), cocção e finalização de pratos com agilidade e padrão de qualidade. Rigoroso cumprimento das normas de higiene e vigilância sanitária (ANVISA), controle de validade (PEPS/FIFO) e redução de desperdício de insumos em cozinhas de alto volume.`,
  },
  {
    type: 'executive',
    category: 'exec',
    icon: '👔',
    label: 'Executivo & Liderança Estratégica',
    description: 'Métricas, gestão de equipes, governança e impacto no negócio',
    color: '#155491',
    bg: '#eef2f7',
    text: (title: string) => `Profissional sênior com sólida trajetória em ${title || 'gestão e liderança estratégica'}, com histórico comprovado de resultados expressivos e entrega de metas corporativas. Liderou equipes multidisciplinares promovendo alta produtividade, eficiência operacional e redução de custos. Expertise em planejamento estratégico, gestão por indicadores de desempenho (KPIs/OKRs) e tomada de decisão orientada a dados.`,
  },
  {
    type: 'tech',
    category: 'tech',
    icon: '💻',
    label: 'Tecnologia & Desenvolvimento de Software',
    description: 'Ferramentas, metodologias ágeis e arquitetura técnica',
    color: '#0891b2',
    bg: '#ecfeff',
    text: (title: string) => `Especialista em ${title || 'Tecnologia e Desenvolvimento de Software'} com sólida vivência na criação e manutenção de soluções digitais eficientes e escaláveis. Domínio de boas práticas de engenharia de software (Clean Code, versionamento Git, CI/CD) e atuação colaborativa em squads ágeis (Scrum/Kanban). Capacidade de aprendizado contínuo e resolução analítica de problemas complexos.`,
  },
  {
    type: 'service',
    category: 'service',
    icon: '🎧',
    label: 'Atendimento ao Cliente & Suporte (CX)',
    description: 'Comunicação empática, resolução ágil e satisfação do cliente',
    color: '#7c3aed',
    bg: '#f5f3ff',
    text: (title: string) => `Profissional dedicado(a) a ${title || 'Atendimento ao Cliente e Customer Experience'}, com comunicação clara, empática e foco na resolução imediata de solicitações via múltiplos canais (telefone, chat, e-mail, WhatsApp). Experiência em ferramentas de helpdesk/CRM, tratamento de ocorrências críticas e retenção de clientes, priorizando índices elevados de satisfação (CSAT e NPS).`,
  },
  {
    type: 'logistics',
    category: 'logistics',
    icon: '📦',
    label: 'Logística, Estoque & Expedição',
    description: 'Recebimento, armazenagem, conferência e controle de fluxo',
    color: '#ea580c',
    bg: '#fff7ed',
    text: (title: string) => `Profissional experiente em ${title || 'Logística e Operações de Estoque'}, com atuação no recebimento, triagem, armazenagem, inventários periódicos e expedição de mercadorias com acuracidade. Domínio na operação de sistemas WMS/ERP, organização de almoxarifado, endereçamento de produtos e cumprimento rigoroso dos prazos e normas de segurança no trabalho.`,
  },
  {
    type: 'health',
    category: 'health',
    icon: '🏥',
    label: 'Saúde, Cuidado & Bem-Estar',
    description: 'Atendimento humanizado, protocolos clínicos e zelo profissional',
    color: '#e11d48',
    bg: '#fff1f2',
    text: (title: string) => `Profissional comprometido(a) na área de ${title || 'Saúde e Cuidados'}, com vivência em assistência humanizada, acolhimento ao paciente e aplicação rigorosa de protocolos técnicos e biossegurança. Capacidade de atuar sob pressão com equilíbrio emocional, espírito de equipe e alto padrão ético no cuidado integral e suporte à equipe multidisciplinar.`,
  },
];

export default function SynthesisModal({ jobTitle, onApply, onClose }: SynthesisModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customResult, setCustomResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredSyntheses = selectedCategory === 'all'
    ? SYNTHESES
    : SYNTHESES.filter((s) => s.category === selectedCategory);

  function handleApply(text: string) {
    setLoading(true);
    setTimeout(() => {
      onApply(text);
      setLoading(false);
      onClose();
    }, 400);
  }

  async function handleGenerateCustomAI() {
    if (!jobTitle && !customPrompt.trim()) return;
    setIsGenerating(true);
    setCustomResult('');

    const role = jobTitle || customPrompt || 'Profissional';
    const prompt = `Escreva uma síntese de qualificações profissional completa, persuasiva e direta em português (com 3 a 5 linhas, aproximadamente 50 a 80 palavras) para o cargo: "${role}".
Detalhe específico: ${customPrompt || 'Destaque responsabilidades principais, competências chave e postura orientada a resultados e melhoria contínua'}.
Não utilize placeholders como "[X anos]" nem invente dados mentirosos. Foque em competências sólidas e valor agregado.`;

    try {
      const generated = await callGemini(
        prompt,
        'Você é um redator sênior de currículos e especialista em recrutamento e seleção (RH). Retorne apenas o parágrafo da síntese, sem aspas e sem enrolação.'
      );
      setCustomResult(generated);
    } catch (e) {
      setCustomResult(
        `Profissional capacitado(a) e dedicado(a) em ${role}, com perfil dinâmico, excelente relacionamento interpessoal e foco em eficiência e qualidade nas entregas. Habilidade para solucionar desafios com agilidade e trabalhar em equipes focadas em resultados.`
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Modal title="✨ Gerador Inteligente de Síntese de Qualificações" onClose={onClose}>
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <p className="text-xs text-gray-600">
          Selecione o modelo mais adequado ao seu segmento para o cargo de{' '}
          <strong className="text-[#004A8D]">{jobTitle || 'seu cargo'}</strong>, ou crie uma versão personalizada com IA:
        </p>

        {/* Gerador Sob Demanda com IA */}
        <div className="p-3.5 bg-gradient-to-r from-[#004A8D]/5 via-purple-50 to-[#F7941D]/10 rounded-2xl border border-[#004A8D]/20 space-y-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#004A8D]" />
            <span className="text-xs font-bold text-gray-900">Gerar Síntese 100% Personalizada com IA</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Detalhes da sua experiência para ${jobTitle || 'seu cargo'}...`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGenerateCustomAI())}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:ring-2 focus:ring-[#004A8D]"
            />
            <button
              type="button"
              onClick={handleGenerateCustomAI}
              disabled={isGenerating}
              className="px-3.5 py-2 bg-[#004A8D] hover:bg-[#00386c] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
              <span>{isGenerating ? 'Gerando...' : 'Gerar com IA'}</span>
            </button>
          </div>

          {customResult && (
            <div className="p-3 bg-white rounded-xl border border-purple-200 space-y-2 mt-2">
              <p className="text-xs text-gray-800 leading-relaxed italic">"{customResult}"</p>
              <button
                type="button"
                onClick={() => handleApply(customResult)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
              >
                ✓ Aplicar esta Síntese Gerada
              </button>
            </div>
          )}
        </div>

        {/* Categorias / Filtros */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#004A8D] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de Modelos Prontos Diversificados */}
        <div className="grid grid-cols-1 gap-3">
          {filteredSyntheses.map((s) => {
            const renderedText = s.text(jobTitle);
            return (
              <div
                key={s.type}
                className="p-3.5 rounded-2xl border transition-all hover:shadow-sm flex flex-col justify-between gap-2.5"
                style={{
                  borderColor: '#e2e8f0',
                  background: s.bg,
                }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold" style={{ color: s.color }}>
                      {s.label}
                    </div>
                    <div className="text-[11px] text-gray-500">{s.description}</div>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-gray-100">
                  {renderedText}
                </p>

                <button
                  type="button"
                  onClick={() => handleApply(renderedText)}
                  disabled={loading}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-2xs"
                  style={{ background: s.color }}
                >
                  {loading ? '⏳ Aplicando...' : '✓ Usar este Modelo'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

