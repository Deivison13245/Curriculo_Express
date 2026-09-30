import Modal from './Modal';
import { Wrench, HeartHandshake, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SkillsExplainerModalProps {
  onClose: () => void;
}

export default function SkillsExplainerModal({ onClose }: SkillsExplainerModalProps) {
  return (
    <Modal title="💡 Hard Skills vs. Soft Skills: O que são?" onClose={onClose}>
      <div className="space-y-6">
        <p className="text-xs text-gray-600 leading-relaxed">
          Entender a diferença entre competências técnicas e comportamentais ajuda seu currículo a passar nos filtros de robôs ATS e se destacar na entrevista com os recrutadores humanos.
        </p>

        {/* 2 Colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hard Skills */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h4>Hard Skills</h4>
                <span className="text-[10px] text-blue-600 block uppercase font-extrabold tracking-wider">Competências Técnicas</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              São habilidades <strong>mensuráveis, ensináveis e comprováveis</strong> através de diplomas, certificados, testes práticos ou experiência direta.
            </p>

            <div className="bg-white rounded-xl p-3 border border-blue-100 text-[11px] text-gray-600 space-y-1">
              <strong className="text-gray-900 block">Exemplos práticos:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                <li>Linguagens (React, Python, SQL)</li>
                <li>Ferramentas (Excel Avançado, Power BI, Figma)</li>
                <li>Idiomas (Inglês Fluente, Espanhol)</li>
                <li>Metodologias (Scrum, Kanban, ITIL)</li>
              </ul>
            </div>

            <p className="text-[11px] text-blue-800 font-medium">
              🎯 <strong>No Robô ATS:</strong> São os principais termos de busca usados para ranquear e filtrar seu currículo.
            </p>
          </div>

          {/* Soft Skills */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-[#F7941D] text-white flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h4>Soft Skills</h4>
                <span className="text-[10px] text-amber-700 block uppercase font-extrabold tracking-wider">Competências Comportamentais</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed">
              São traços de <strong>personalidade, inteligência emocional e comunicação</strong> que definem como você interage com colegas, clientes e liderança.
            </p>

            <div className="bg-white rounded-xl p-3 border border-amber-100 text-[11px] text-gray-600 space-y-1">
              <strong className="text-gray-900 block">Exemplos práticos:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                <li>Comunicação assertiva e escuta ativa</li>
                <li>Trabalho em equipe e empatia</li>
                <li>Liderança e resolução de conflitos</li>
                <li>Adaptabilidade e inteligência emocional</li>
              </ul>
            </div>

            <p className="text-[11px] text-amber-800 font-medium">
              🤝 <strong>Na Entrevista:</strong> São decisivas para a decisão final de contratação pela equipe humana.
            </p>
          </div>
        </div>

        {/* Dica de Ouro */}
        <div className="bg-gradient-to-r from-[#004A8D]/10 to-[#F7941D]/10 border border-[#004A8D]/20 rounded-xl p-4 text-xs text-gray-800 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#F7941D] shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-900 block mb-0.5">Dica de Ouro de RH:</strong>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Equilibre de <strong>5 a 8 Hard Skills fundamentais</strong> para a vaga desejada com <strong>3 a 5 Soft Skills comprovadas</strong>. Além de listá-las, demonstre como você usou essas competências nas descrições de suas experiências!
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#004A8D] hover:bg-[#00386c] text-white text-xs font-bold transition-all shadow-sm"
          >
            Entendido! Voltar ao Formulário
          </button>
        </div>
      </div>
    </Modal>
  );
}
