import { useState, useCallback, useEffect } from 'react';
import type { ResumeData, ModalType, Toast, TabType } from './types';
import Header from './components/Header';
import FormPanel from './components/FormPanel';
import DesignPanel from './components/DesignPanel';
import PreviewPanel from './components/PreviewPanel';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import FloatingDownloadButton from './components/FloatingDownloadButton';
import ToastContainer from './components/Toast';

import SynthesisModal from './components/modals/SynthesisModal';
import StarModal from './components/modals/StarModal';
import ReviewModal from './components/modals/ReviewModal';
import AtsModal from './components/modals/AtsModal';
import ExportModal from './components/modals/ExportModal';
import ImportModal from './components/modals/ImportModal';
import TranslationModal from './components/modals/TranslationModal';
import CanvaModal from './components/modals/CanvaModal';
import VideoPitchModal from './components/modals/VideoPitchModal';
import SkillsExplainerModal from './components/modals/SkillsExplainerModal';

import { exportToWord } from './utils/wordExport';

// INICIALIZAÇÃO TOTALMENTE LIMPA POR PADRÃO (Insight RH 6)
const DEFAULT_DATA: ResumeData = {
  name: '',
  jobTitle: '',
  email: '',
  phone: '',
  state: '',
  city: '',

  birthDate: '',
  maritalStatus: '',
  driverLicense: '',
  linkedin: '',
  github: '',
  portfolio: '',
  nationality: '',
  photo: '',
  videoUrl: '',

  summary: '',
  education: [],
  experience: [],
  hardSkills: [],
  softSkills: [],
  technologies: [],
  languages: [],
  certifications: [],
  projects: [],
  customSections: [],

  enabledSections: {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    technologies: true,
    languages: true,
    certifications: true,
    projects: true,
    custom: false,
  },

  enabledPersonalFields: {
    birthDate: false,
    maritalStatus: false,
    driverLicense: false,
    linkedin: false,
    github: false,
    portfolio: false,
    nationality: false,
    photo: false,
    videoUrl: false,
  },

  design: {
    template: 'jobseeker',
    primaryColor: '#004A8D',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 'md',
    spacing: 'normal',
    layoutMode: 'full',
  },
};

function computeScore(data: ResumeData): number {
  let s = 10;
  if (data.name) s += 15;
  if (data.email) s += 5;
  if (data.phone) s += 5;
  if (data.state && data.city) s += 5;
  if (data.jobTitle) s += 10;
  if (data.summary && data.summary.length > 40) s += 15;
  if (data.experience.some((e) => e.role && e.company)) s += 15;
  if (data.education.some((e) => e.course || e.institution)) s += 10;
  if (data.hardSkills.length >= 3) s += 5;
  if (data.softSkills.length >= 2) s += 5;
  return Math.min(s, 100);
}

export default function App() {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('curriculo-express-data-jobseeker-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_DATA;
      }
    }
    return DEFAULT_DATA;
  });

  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [activeExpId, setActiveExpId] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('curriculo-express-data-jobseeker-v2', JSON.stringify(data));
  }, [data]);

  // Keyboard shortcut listener (Esc closes drawer & modals)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setModal(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function addToast(message: string, type: Toast['type'] = 'success') {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
  }

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  function handlePrint() {
    // Automatically switch to preview tab so only the A4 resume prints!
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 150);
  }

  function handleExportWord() {
    exportToWord(data);
    addToast('✓ Exportação para Word (.doc) concluída com sucesso!');
  }

  const score = computeScore(data);
  const activeExp = data.experience.find((e) => e.id === activeExpId);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* 1. HEADER MINIMALISTA COM NAVEGAÇÃO EM ABAS */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        score={score}
        aiActive
      />

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'content' && (
          <FormPanel
            data={data}
            onChange={setData}
            onOpenSynthesis={() => setModal('synthesis')}
            onOpenStar={(expId) => {
              setActiveExpId(expId || data.experience[0]?.id || '');
              setModal('star');
            }}
            onOpenReview={() => setModal('review')}
            onOpenAts={() => setModal('ats')}
            onOpenImport={() => setModal('import')}
            onOpenCanva={() => setModal('canva')}
            onOpenVideoExplainer={() => setModal('videoExplainer')}
            onOpenSkillsExplainer={() => setModal('skillsExplainer')}
          />
        )}

        {activeTab === 'design' && (
          <DesignPanel
            design={data.design}
            onChange={(design) => setData((d) => ({ ...d, design }))}
          />
        )}

        {activeTab === 'preview' && (
          <PreviewPanel
            data={data}
            onPrint={handlePrint}
            onExportWord={handleExportWord}
            onOpenExport={() => setModal('export')}
            onOpenTranslate={() => setModal('translate')}
          />
        )}
      </main>

      {/* 2. UNIFIED DRAWER / MENU ÚNICO & CENTRAL DE IA */}
      <AIAssistantDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        score={score}
        data={data}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSynthesis={() => setModal('synthesis')}
        onOpenStar={() => {
          const firstExpId = data.experience[0]?.id || '';
          setActiveExpId(firstExpId);
          setModal('star');
        }}
        onOpenReview={() => setModal('review')}
        onOpenAts={() => setModal('ats')}
        onOpenExport={() => setModal('export')}
        onOpenTranslate={() => setModal('translate')}
      />

      {/* 3. BOTÃO FIXO DE DOWNLOAD PDF */}
      <FloatingDownloadButton onDownload={handlePrint} score={score} />

      {/* MODALS DE IA, TRADUÇÃO & EXPORTAÇÃO */}
      {modal === 'synthesis' && (
        <SynthesisModal
          jobTitle={data.jobTitle}
          onApply={(text) => {
            setData((d) => ({ ...d, summary: text }));
            addToast('✓ Síntese profissional aplicada com sucesso!');
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'star' && activeExp && (
        <StarModal
          role={activeExp.role}
          original={activeExp.description}
          onApply={(text) => {
            setData((d) => ({
              ...d,
              experience: d.experience.map((e) =>
                e.id === activeExpId ? { ...e, description: text } : e
              ),
            }));
            addToast('✓ Experiência otimizada com o Método STAR!');
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'review' && (
        <ReviewModal
          onApply={() => addToast('✓ Correções gramaticais e de tom aplicadas!')}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'ats' && (
        <AtsModal
          resumeSkills={data.hardSkills}
          onApplyTitle={(title) => {
            setData((d) => ({ ...d, jobTitle: title }));
            addToast('✓ Cargo alinhado com a vaga ATS!');
          }}
          onAddSkill={(skill) => {
            setData((d) => ({ ...d, hardSkills: [...d.hardSkills, skill] }));
            addToast(`✓ Habilidade "${skill}" adicionada ao currículo!`);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'export' && (
        <ExportModal
          name={data.name}
          jobTitle={data.jobTitle}
          onClose={() => setModal(null)}
          onToast={(msg) => addToast(msg)}
        />
      )}

      {modal === 'import' && (
        <ImportModal
          onClose={() => setModal(null)}
          onOpenCanva={() => setModal('canva')}
          onImportData={(imported) => {
            setData((d) => ({
              ...d,
              name: imported.name || d.name,
              jobTitle: imported.jobTitle || d.jobTitle,
              email: imported.email || d.email,
              summary: imported.summary || d.summary,
            }));
            addToast('✓ Perfil importado com sucesso!');
          }}
        />
      )}

      {modal === 'canva' && (
        <CanvaModal onClose={() => setModal(null)} />
      )}

      {modal === 'videoExplainer' && (
        <VideoPitchModal onClose={() => setModal(null)} />
      )}

      {modal === 'skillsExplainer' && (
        <SkillsExplainerModal onClose={() => setModal(null)} />
      )}

      {modal === 'translate' && (
        <TranslationModal
          data={data}
          onApplyTranslation={(translatedData, langName) => {
            setData((d) => ({ ...d, ...translatedData }));
            addToast(`✓ Currículo traduzido para ${langName} com sucesso!`);
          }}
          onClose={() => setModal(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
