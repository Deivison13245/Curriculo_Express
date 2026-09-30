import { useState } from 'react';
import Modal from './Modal';
import { Upload, Link as LinkIcon, FileText, CheckCircle2, Sparkles, Palette, ExternalLink } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
  onImportData: (imported: { name?: string; jobTitle?: string; email?: string; summary?: string }) => void;
  onOpenCanva?: () => void;
}

export default function ImportModal({ onClose, onImportData, onOpenCanva }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'linkedin' | 'canva'>('file');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleImport() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onImportData({
          name: 'Maria Silva Santos',
          jobTitle: 'Desenvolvedora Full Stack',
          email: 'maria.silva@email.com',
          summary: 'Profissional com sólida experiência em desenvolvimento web, arquitetura de sistemas e liderança de projetos ágeis.',
        });
        onClose();
      }, 1000);
    }, 1200);
  }

  return (
    <Modal title="✨ Importação & Integrações" onClose={onClose}>
      <div className="space-y-5">
        {/* Subtabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'file'
                ? 'border-[#004A8D] text-[#004A8D]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4 text-[#F7941D]" />
            <span>Upload PDF / DOCX</span>
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'linkedin'
                ? 'border-[#004A8D] text-[#004A8D]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-[#F7941D]" />
            <span>LinkedIn</span>
          </button>
          <button
            onClick={() => setActiveTab('canva')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'canva'
                ? 'border-[#7D2AE8] text-[#7D2AE8]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Palette className="w-4 h-4 text-[#7D2AE8]" />
            <span>Canva</span>
          </button>
        </div>

        {activeTab === 'file' && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-[#004A8D]/30 bg-[#004A8D]/5 rounded-2xl p-8 text-center hover:border-[#004A8D] transition-colors cursor-pointer group"
              onClick={handleImport}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#004A8D] text-white mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#F7941D]" />
              </div>
              <p className="text-xs font-bold text-gray-900">Arraste seu arquivo de currículo ou clique aqui</p>
              <p className="text-[11px] text-gray-500 mt-1">Formatos suportados: PDF, DOCX, DOC (máx. 10MB)</p>
            </div>
          </div>
        )}

        {activeTab === 'linkedin' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                URL do Perfil do LinkedIn:
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/seu-perfil"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:ring-2 focus:ring-[#004A8D]"
              />
            </div>
            <button
              onClick={handleImport}
              disabled={loading || !linkedinUrl.trim()}
              className="w-full py-3 rounded-xl bg-[#004A8D] hover:bg-[#00386c] text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F7941D]" />
              <span>{loading ? 'Extraindo perfil...' : 'Extrair Perfil do LinkedIn'}</span>
            </button>
          </div>
        )}

        {activeTab === 'canva' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#7D2AE8]/10 to-[#00C4CC]/10 rounded-2xl border border-[#7D2AE8]/20 space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#7D2AE8]" />
                <strong className="text-xs text-gray-900">Integração & Modelos com o Canva</strong>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Você pode utilizar os modelos visuais do Canva para criar portfólios visuais e importar suas informações geradas aqui com alto poder descritivo de IA.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCanva) onOpenCanva();
                  }}
                  className="px-4 py-2 bg-[#7D2AE8] hover:bg-[#6820c7] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>Ver Guia do Canva</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-4 bg-[#004A8D]/10 rounded-xl text-center space-y-2">
            <div className="w-6 h-6 border-2 border-[#004A8D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#004A8D]">Processando e estruturando dados com IA...</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dados importados com sucesso!</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
