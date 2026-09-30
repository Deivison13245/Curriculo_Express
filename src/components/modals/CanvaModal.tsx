import Modal from './Modal';
import { Palette, ExternalLink, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

interface CanvaModalProps {
  onClose: () => void;
}

export default function CanvaModal({ onClose }: CanvaModalProps) {
  return (
    <Modal title="🎨 Integração com o Canva" onClose={onClose}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#7D2AE8]/10 via-[#00C4CC]/10 to-[#7D2AE8]/5 rounded-2xl p-5 border border-[#7D2AE8]/20 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7D2AE8] to-[#00C4CC] text-white flex items-center justify-center shrink-0 shadow-md">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Design Visual no Canva & Conteúdo Otimizado para ATS</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Você pode usar o **Currículo Express** para estruturar seu texto, revisar com IA e otimizar para robôs ATS, e exportar as informações para os templates visuais do Canva!
            </p>
          </div>
        </div>

        {/* Como funciona o fluxo */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Como utilizar o Canva em conjunto:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80">
              <div className="w-6 h-6 rounded-full bg-[#004A8D] text-white text-xs font-bold flex items-center justify-center mb-2">1</div>
              <p className="text-xs font-bold text-gray-900">Preencha & Otimize</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Use o formulário e as ferramentas de IA para gerar o texto perfeito.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80">
              <div className="w-6 h-6 rounded-full bg-[#7D2AE8] text-white text-xs font-bold flex items-center justify-center mb-2">2</div>
              <p className="text-xs font-bold text-gray-900">Copie ou Exporte</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Baixe em Word (.docx) ou copie os blocos de texto estruturados.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80">
              <div className="w-6 h-6 rounded-full bg-[#00C4CC] text-white text-xs font-bold flex items-center justify-center mb-2">3</div>
              <p className="text-xs font-bold text-gray-900">Cole no Template Canva</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Aplique no seu modelo gráfico favorito no Canva para portfólios visuais.</p>
            </div>
          </div>
        </div>

        {/* Dica de RH */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            💡 Dica dos Recrutadores & RH:
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Currículos do Canva com muitos elementos gráficos (ícones, colunas complexas, barras de progresso) são excelentes para áreas de Design e Marketing, mas podem ter problemas de leitura em robôs ATS corporativos (Gupy, Kenoby, Workday). Para vagas em grandes empresas, priorize o modelo em PDF limpo gerado aqui!
          </p>
        </div>

        {/* Botão para abrir o Canva */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          
          <a
            href="https://www.canva.com/pt_br/curriculos/modelos/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7D2AE8] to-[#00C4CC] hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <span>Explorar Modelos no Canva</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Modal>
  );
}
