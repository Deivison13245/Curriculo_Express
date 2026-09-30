import type { ResumeDesign } from '../types';
import { Palette, Type, Layout, Maximize2, Check, FileCheck, Layers, Sparkles, AlertCircle } from 'lucide-react';

interface DesignPanelProps {
  design: ResumeDesign;
  onChange: (design: ResumeDesign) => void;
}

const TEMPLATES: { id: ResumeDesign['template']; title: string; desc: string; color: string }[] = [
  { id: 'jobseeker', title: 'Currículo Express Senac', desc: 'Design vibrante com azul Senac e destaque no cabeçalho.', color: '#004A8D' },
  { id: 'modern', title: 'Corporativo Blue', desc: 'Estilo corporativo tradicional com tons azuis e linhas organizadas.', color: '#1E40AF' },
  { id: 'elegant', title: 'Slate Elegante', desc: 'Linhas finas, tons sóbrios de cinza e acabamento executivo minimalista.', color: '#334155' },
  { id: 'executive', title: 'Executivo Serif', desc: 'Fontes elegantes no título, divisórias destacadas e toque clássico.', color: '#059669' },
  { id: 'minimalist', title: 'Minimalista ATS P&B', desc: 'Máxima densidade de texto com fundo limpo focado 100% em filtros ATS.', color: '#111827' },
];

const COLOR_SWATCHES = [
  { name: 'Preto & Branco (P&B ATS)', hex: '#111827' },
  { name: 'AZUL Senac', hex: '#004A8D' },
  { name: 'LARANJA Senac', hex: '#F7941D' },
  { name: 'LARANJA Claro Senac', hex: '#FDC180' },
  { name: 'Roxo Vibrante', hex: '#7C3AED' },
  { name: 'Azul Escuro Corporativo', hex: '#0F172A' },
  { name: 'Verde Esmeralda', hex: '#059669' },
  { name: 'Cinza Grafite', hex: '#475569' },
];

const FONTS = [
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Padrão Moderno)' },
  { id: 'Inter', label: 'Inter (Clean & Tecnológico)' },
  { id: 'Roboto', label: 'Roboto (Neutro & Legível)' },
  { id: 'Merriweather', label: 'Merriweather (Serifado Clássico)' },
];

export default function DesignPanel({ design, onChange }: DesignPanelProps) {
  function update(patch: Partial<ResumeDesign>) {
    onChange({ ...design, ...patch });
  }

  const currentLayoutMode = design.layoutMode || 'full';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-[#004A8D] to-[#003463] text-white rounded-2xl p-6 shadow-md border border-[#F7941D]/30">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#F7941D]" />
          Personalização de Design & Layout
        </h2>
        <p className="text-xs text-[#FDC180] mt-1 font-medium">
          Ajuste as cores, tipografia, estrutura de páginas e margens do seu currículo em tempo real.
        </p>
      </div>

      {/* 1. MODELOS DE ESTRUTURA: COMPACTO (1 FOLHA) vs. COMPLETO (Insight RH 13) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#004A8D]" />
            Estrutura do Modelo: Compacto (1 Folha) vs. Completo
          </h3>
          <span className="text-xs font-extrabold text-[#004A8D] uppercase tracking-wider bg-[#004A8D]/10 px-2.5 py-0.5 rounded-full">
            {currentLayoutMode === 'compact' ? 'Modo 1 Página' : 'Modo Multipágina'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opção Compacta */}
          <div
            onClick={() => update({ layoutMode: 'compact', spacing: 'compact', fontSize: 'sm' })}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative ${
              currentLayoutMode === 'compact'
                ? 'border-[#004A8D] bg-[#004A8D]/5 shadow-sm'
                : 'border-gray-200 bg-white hover:border-[#004A8D]/30 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#004A8D]" />
                <h4 className="text-xs font-bold text-gray-900">Modelo Compacto (1 Folha A4)</h4>
              </div>
              {currentLayoutMode === 'compact' && (
                <div className="w-5 h-5 rounded-full bg-[#004A8D] text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5 text-[#F7941D]" />
                </div>
              )}
            </div>
            <p className="text-[11.5px] text-gray-600 leading-relaxed">
              Margens estreitas, fontes otimizadas e espaçamentos condensados calculados para forçar todo o conteúdo a caber com precisão em <strong>1 única folha A4</strong>.
            </p>
            <div className="mt-2.5 text-[10.5px] text-[#004A8D] font-bold">
              ✓ Ideal para até 5 anos de experiência e triagens rápidas.
            </div>
          </div>

          {/* Opção Completa */}
          <div
            onClick={() => update({ layoutMode: 'full', spacing: 'normal', fontSize: 'md' })}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative ${
              currentLayoutMode === 'full'
                ? 'border-[#004A8D] bg-[#004A8D]/5 shadow-sm'
                : 'border-gray-200 bg-white hover:border-[#004A8D]/30 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-gray-900">Modelo Completo (Multipágina Livre)</h4>
              </div>
              {currentLayoutMode === 'full' && (
                <div className="w-5 h-5 rounded-full bg-[#004A8D] text-white flex items-center justify-center text-xs">
                  <Check className="w-3.5 h-3.5 text-[#F7941D]" />
                </div>
              )}
            </div>
            <p className="text-[11.5px] text-gray-600 leading-relaxed">
              Espaçamentos arejados, sem restrição de tamanho, permitindo detalhar todo o histórico profissional, projetos, publicações e certificações.
            </p>
            <div className="mt-2.5 text-[10.5px] text-emerald-700 font-bold">
              ✓ Ideal para profissionais seniores, gestores e acadêmicos.
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECOMENDAÇÃO DE CORES: PRETO E BRANCO P&B (Insight RH 12) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        {/* Banner Informativo de RH */}
        <div className="bg-gray-900 text-white rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F7941D]" />
              Dica de RH: Padrão Preto e Branco (P&B)
            </span>
            <button
              type="button"
              onClick={() => update({ primaryColor: '#111827' })}
              className="px-3 py-1 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-extrabold transition-all"
            >
              Aplicar Paleta P&B ATS
            </button>
          </div>
          <p className="text-[11.5px] text-gray-300 leading-relaxed">
            O padrão ideal e universalmente recomendado por recrutadores é a paleta <strong>Preto e Branco (P&B)</strong> com alto contraste. Ela garante <strong>100% de compatibilidade</strong> na leitura por robôs de triagem (ATS) e economia na impressão física.
          </p>
        </div>

        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#004A8D]" />
          Cor Primária de Destaque
        </h3>

        <div className="flex flex-wrap gap-3 items-center">
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected = design.primaryColor.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => update({ primaryColor: swatch.hex })}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? 'ring-4 ring-[#004A8D]/30 scale-110 shadow-sm' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: swatch.hex }}
                title={swatch.name}
              >
                {isSelected && <Check className="w-5 h-5 text-white" />}
              </button>
            );
          })}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500 font-medium">Hex customizado:</span>
            <input
              type="color"
              value={design.primaryColor}
              onChange={(e) => update({ primaryColor: e.target.value })}
              className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. SELEÇÃO DE TEMPLATES */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#004A8D]" />
          Estilo Visual do Template
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => {
            const isSelected = design.template === t.id;
            return (
              <div
                key={t.id}
                onClick={() => update({ template: t.id })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? 'border-[#004A8D] bg-[#004A8D]/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-[#004A8D]/30 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block"
                      style={{ backgroundColor: t.color }}
                    />
                    <h4 className="text-xs font-bold text-gray-900">{t.title}</h4>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#004A8D] text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 text-[#F7941D]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TIPOGRAFIA & MARGENS */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Type className="w-4 h-4 text-[#004A8D]" />
          Tipografia & Tamanho da Fonte
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Fonte Principal</label>
            <div className="space-y-2">
              {FONTS.map((f) => (
                <label
                  key={f.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    design.fontFamily === f.id
                      ? 'border-[#004A8D] bg-[#004A8D]/5 font-bold text-[#004A8D]'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-xs" style={{ fontFamily: f.id }}>
                    {f.label}
                  </span>
                  <input
                    type="radio"
                    name="fontFamily"
                    checked={design.fontFamily === f.id}
                    onChange={() => update({ fontFamily: f.id })}
                    className="text-[#004A8D] focus:ring-[#004A8D]"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Tamanho do Texto</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sm', label: 'Pequeno (ATS / 1 pág)' },
                  { id: 'md', label: 'Médio (Padrão)' },
                  { id: 'lg', label: 'Grande' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => update({ fontSize: s.id as ResumeDesign['fontSize'] })}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      design.fontSize === s.id
                        ? 'border-[#004A8D] bg-[#004A8D] text-white'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Margens */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
                Espaçamento das Margens
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'compact', label: 'Compacto' },
                  { id: 'normal', label: 'Normal' },
                  { id: 'spacious', label: 'Espaçoso' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => update({ spacing: sp.id as ResumeDesign['spacing'] })}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      design.spacing === sp.id
                        ? 'border-[#004A8D] bg-[#004A8D] text-white'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
