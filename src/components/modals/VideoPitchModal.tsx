import Modal from './Modal';
import { Video, HelpCircle, AlertTriangle, CheckCircle2, Clock, Eye, Sparkles, Play } from 'lucide-react';

interface VideoPitchModalProps {
  onClose: () => void;
}

export default function VideoPitchModal({ onClose }: VideoPitchModalProps) {
  return (
    <Modal title="📹 O que é um Vídeo de Apresentação (Pitch)?" onClose={onClose}>
      <div className="space-y-5">
        {/* Banner */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <Play className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-950">Apenas links do YouTube são suportados</h3>
            <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
              O link informado deve ser um vídeo público ou **não listado** hospedado no <strong>YouTube</strong> (ex: <code className="bg-red-100 px-1 py-0.5 rounded text-[11px]">https://youtu.be/...</code> ou <code className="bg-red-100 px-1 py-0.5 rounded text-[11px]">https://www.youtube.com/watch?v=...</code>).
            </p>
          </div>
        </div>

        {/* O que é */}
        <div>
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Conceito & Finalidade</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            O <strong>Vídeo Pitch</strong> é uma breve apresentação pessoal gravada em vídeo (geralmente entre <strong>1 a 2 minutos</strong>) onde você se apresenta, resume sua trajetória, suas principais conquistas profissionais e demonstra sua comunicação e energia.
          </p>
        </div>

        {/* Dicas de Gravação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-[#004A8D]" />
              <strong className="text-xs text-gray-900">Duração Ideal</strong>
            </div>
            <p className="text-[11px] text-gray-500">Mantenha entre 60 e 90 segundos. Recrutadores têm pouco tempo e valorizam objetividade e clareza.</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-2 mb-1.5">
              <Eye className="w-4 h-4 text-emerald-600" />
              <strong className="text-xs text-gray-900">Postura & Ambiente</strong>
            </div>
            <p className="text-[11px] text-gray-500">Grave em local silencioso, com boa iluminação frontal e fundo neutro ou organizado.</p>
          </div>
        </div>

        {/* Roteiro Recomendado */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-blue-900">
            <Sparkles className="w-4 h-4 text-[#F7941D]" />
            Estrutura Recomendada para o Pitch:
          </p>
          <ol className="list-decimal list-inside text-[11px] text-blue-900/90 space-y-1 pl-1">
            <li><strong>Quem é você:</strong> Nome, formação e área de atuação.</li>
            <li><strong>Seus pontos fortes:</strong> 2 ou 3 principais tecnologias, ferramentas ou competências.</li>
            <li><strong>Maior conquista:</strong> Um resultado expressivo recente com metodologia STAR.</li>
            <li><strong>Seu objetivo:</strong> O que você busca e como pretende agregar valor à empresa contratante.</li>
          </ol>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#004A8D] hover:bg-[#00386c] text-white text-xs font-bold transition-all shadow-sm"
          >
            Entendido!
          </button>
        </div>
      </div>
    </Modal>
  );
}
