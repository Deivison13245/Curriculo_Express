import { useState, useRef } from 'react';
import Modal from './Modal';
import { Upload, FileText, CheckCircle2, Sparkles, Palette, ExternalLink, ClipboardPaste, AlertCircle } from 'lucide-react';
import { parseResumeTextWithAI, parseResumeFileWithAI } from '../../services/aiService';
import { extractTextFromPdf, renderPdfPageToBase64 } from '../../services/pdfService';
import { sanitizeImportedResumeData } from '../../utils/resumeSanitizer';
import { getMunicipiosByUF, findMatchingCity } from '../../services/ibgeService';
import type { ResumeData } from '../../types';

interface ImportModalProps {
  onClose: () => void;
  onImportData: (imported: Partial<ResumeData>) => void;
  onOpenCanva?: () => void;
}

export default function ImportModal({ onClose, onImportData, onOpenCanva }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'paste' | 'canva'>('file');
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function applyExtractedData(extracted: any, rawFallback: string = '') {
    const sanitized = sanitizeImportedResumeData(extracted, rawFallback);

    if (sanitized.state && sanitized.city) {
      try {
        const cities = await getMunicipiosByUF(sanitized.state);
        if (cities && cities.length > 0) {
          const matched = findMatchingCity(sanitized.city, cities);
          if (matched) {
            sanitized.city = matched;
          }
        }
      } catch (e) {
        console.warn('[ImportModal] Falha ao normalizar cidade via IBGE:', e);
      }
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      onImportData(sanitized);
      onClose();
    }, 700);
  }

  async function processText(text: string) {
    if (!text || !text.trim()) {
      setError('Por favor, insira ou envie o conteúdo do seu currículo.');
      return;
    }
    setError(null);
    setLoading(true);
    setStatusMessage('Analisando estrutura e organizando seções com IA...');

    try {
      const extracted = await parseResumeTextWithAI(text);
      await applyExtractedData(extracted, text);
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Erro ao processar o currículo. Verifique o texto e tente novamente.');
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Se for arquivo JSON (Backup completo do Currículo Express)
    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setSuccess(true);
          setTimeout(() => {
            onImportData(sanitizeImportedResumeData(json));
            onClose();
          }, 700);
        } catch {
          setError('Arquivo JSON de backup inválido.');
        }
      };
      reader.readAsText(file);
      return;
    }

    // 2. Se for arquivo de texto simples (.txt, .md)
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        await processText(text);
      };
      reader.readAsText(file);
      return;
    }

    // 3. Se for PDF
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setLoading(true);
      setStatusMessage(`Lendo e analisando colunas de "${file.name}"...`);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          // Fase 1: Extrator espacial por coordenadas X/Y
          const extractedPdfText = await extractTextFromPdf(arrayBuffer);

          if (extractedPdfText && extractedPdfText.trim().length > 25) {
            setStatusMessage('Mapeando dados e estruturando currículo com IA...');
            await processText(extractedPdfText);
            return;
          }
        } catch (spatialErr) {
          console.warn('[ImportModal] Falha na extração de texto, tentando fallback em imagem/canvas:', spatialErr);
        }

        // Fallback: Se o PDF for digitalizado/imagem ou não tiver camada de texto, renderiza página via Canvas
        try {
          setStatusMessage('Detectado PDF digitalizado: Processando imagem visual com IA...');
          const imageBase64 = await renderPdfPageToBase64(arrayBuffer, 1);
          const extracted = await parseResumeFileWithAI(imageBase64, 'image/jpeg');
          await applyExtractedData(extracted);
        } catch (imgErr: any) {
          console.warn('[ImportModal] Falha no fallback visual:', imgErr);
          setLoading(false);
          setError(
            'Não foi possível extrair o texto automaticamente deste PDF. Por favor, copie e cole o texto do seu currículo na aba "Colar Texto / LinkedIn" ao lado.'
          );
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // 4. Se for imagem (PNG, JPG, WEBP)
    if (file.type.startsWith('image/')) {
      setLoading(true);
      setStatusMessage(`Analisando imagem "${file.name}" com IA visual...`);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          const base64Data = dataUrl.split(',')[1];
          const extracted = await parseResumeFileWithAI(base64Data, file.type || 'image/png');
          await applyExtractedData(extracted);
        } catch (err: any) {
          console.warn('[ImportModal] Falha na imagem:', err);
          setLoading(false);
          setError('Não foi possível ler a imagem do currículo.');
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    // 5. Se for Word (.docx / .doc)
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      setLoading(true);
      setStatusMessage(`Lendo documento Word "${file.name}"...`);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const mammothLib = (window as any).mammoth;
          if (mammothLib) {
            const result = await mammothLib.extractRawText({ arrayBuffer });
            if (result.value) {
              await processText(result.value);
              return;
            }
          }
          throw new Error('Leitor de Word indisponível no navegador.');
        } catch (docErr: any) {
          console.warn('[ImportModal] Falha ao ler Word:', docErr);
          setLoading(false);
          setError('Não foi possível converter o arquivo Word diretamente. Por favor, cole o texto na aba "Colar Texto / LinkedIn".');
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    setError('Formato não suportado diretamente. Use PDF, Word (.docx), TXT, JSON ou cole o texto na aba ao lado.');
  }

  return (
    <Modal title="✨ Importação Inteligente de Currículo" onClose={onClose}>
      <div className="space-y-5">
        {/* Subtabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => { setActiveTab('file'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'file'
                ? 'border-[#004A8D] text-[#004A8D]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4 text-[#F7941D]" />
            <span>Upload de Arquivo</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('paste'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'paste'
                ? 'border-[#004A8D] text-[#004A8D]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ClipboardPaste className="w-4 h-4 text-[#004A8D]" />
            <span>Colar Texto / LinkedIn</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('canva'); setError(null); }}
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
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.txt,.pdf,.docx,.doc,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
              id="resumeFileInput"
            />
            <label
              htmlFor="resumeFileInput"
              className="border-2 border-dashed border-[#004A8D]/30 bg-[#004A8D]/5 rounded-2xl p-8 text-center hover:border-[#004A8D] transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#004A8D] text-white mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                <FileText className="w-6 h-6 text-[#F7941D]" />
              </div>
              <p className="text-xs font-bold text-gray-900">Clique para selecionar seu arquivo ou arraste aqui</p>
              <p className="text-[11px] text-gray-500 mt-1">Formatos suportados: PDF, DOCX, TXT, Imagens ou JSON Backup (máx. 10MB)</p>
            </label>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Cole o texto do seu currículo ou resumo do LinkedIn:
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Cole aqui todo o texto do seu currículo atual, experiências ou seção 'Sobre' do LinkedIn..."
                rows={7}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#004A8D] focus:border-[#004A8D] resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => processText(pastedText)}
              disabled={loading || !pastedText.trim()}
              className="w-full py-3 rounded-xl bg-[#004A8D] hover:bg-[#00386c] text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#F7941D]" />
              <span>{loading ? 'Extraindo dados com IA...' : 'Extrair e Preencher com IA'}</span>
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
                  className="px-4 py-2 bg-[#7D2AE8] hover:bg-[#6820c7] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
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
            <p className="text-xs font-bold text-[#004A8D]">{statusMessage}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dados extraídos e importados com sucesso!</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
