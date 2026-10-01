import { BRAZIL_STATES } from '../data/brazilLocations';
import type { ResumeData, Education, Experience, Language, Certification, ProjectOrAchievement, CustomSectionItem } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// Mapa de nomes de estados por extenso para siglas UF
const STATE_NAME_TO_UF: Record<string, string> = {
  'acre': 'AC', 'alagoas': 'AL', 'amapa': 'AP', 'amapá': 'AP', 'amazonas': 'AM',
  'bahia': 'BA', 'ceara': 'CE', 'ceará': 'CE', 'distrito federal': 'DF', 'brasilia': 'DF', 'brasília': 'DF',
  'espirito santo': 'ES', 'espírito santo': 'ES', 'goias': 'GO', 'goiás': 'GO',
  'maranhao': 'MA', 'maranhão': 'MA', 'mato grosso': 'MT', 'mato grosso do sul': 'MS',
  'minas gerais': 'MG', 'para': 'PA', 'pará': 'PA', 'paraiba': 'PB', 'paraíba': 'PB',
  'parana': 'PR', 'paraná': 'PR', 'pernambuco': 'PE', 'piaui': 'PI', 'piauí': 'PI',
  'rio de janeiro': 'RJ', 'rio grande do norte': 'RN', 'rio grande do sul': 'RS',
  'rondonia': 'RO', 'rondônia': 'RO', 'roraima': 'RR', 'santa catarina': 'SC',
  'sao paulo': 'SP', 'são paulo': 'SP', 'sergipe': 'SE', 'tocantins': 'TO'
};

const VALID_UFS = new Set([
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
]);

/**
 * Normaliza e valida a sigla do estado brasileiro
 */
export function normalizeState(stateInput: any): string {
  if (!stateInput || typeof stateInput !== 'string') return '';
  const trimmed = stateInput.trim().toUpperCase();
  if (VALID_UFS.has(trimmed)) return trimmed;

  const lower = stateInput.trim().toLowerCase();
  if (STATE_NAME_TO_UF[lower]) return STATE_NAME_TO_UF[lower];

  // Procura por substring de UF ou Estado
  for (const [name, uf] of Object.entries(STATE_NAME_TO_UF)) {
    if (lower.includes(name)) return uf;
  }
  for (const uf of VALID_UFS) {
    if (new RegExp(`\\b${uf}\\b`, 'i').test(stateInput)) return uf;
  }
  return '';
}

/**
 * Normaliza e limpa o nome da cidade
 */
export function normalizeCity(cityInput: any): string {
  if (!cityInput || typeof cityInput !== 'string') return '';
  let city = cityInput.trim();

  // Remove lixo comum, siglas no final (ex: "Serrinha - BA" -> "Serrinha")
  city = city.replace(/[-–/]\s*[A-Z]{2}$/i, '').trim();
  city = city.replace(/^(?:Cidade|Município|City):\s*/i, '').trim();

  // Se contiver palavras que não são cidades (ex: seções de currículo)
  if (/s[íi]ntese|objetivo|educa|experi|curr[íi]culo|nome|idade|telefone|email/i.test(city)) {
    return '';
  }

  // Capitalização limpa
  return city;
}

/**
 * Normaliza telefone para formato brasileiro legível
 */
export function normalizePhone(phoneInput: any): string {
  if (!phoneInput || typeof phoneInput !== 'string') return '';
  const digits = phoneInput.replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 13 && digits.startsWith('55')) {
    const d = digits.slice(2);
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return phoneInput.trim();
}

/**
 * Normaliza e-mail
 */
export function normalizeEmail(emailInput: any): string {
  if (!emailInput || typeof emailInput !== 'string') return '';
  const match = emailInput.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase().trim() : '';
}

/**
 * Normaliza Estado Civil para os termos padrão
 */
export function normalizeMaritalStatus(status: any): string {
  if (!status || typeof status !== 'string') return '';
  const lower = status.toLowerCase();
  if (lower.includes('casad')) return 'Casado(a)';
  if (lower.includes('solteir')) return 'Solteiro(a)';
  if (lower.includes('divorciad')) return 'Divorciado(a)';
  if (lower.includes('viuv') || lower.includes('viúv')) return 'Viúvo(a)';
  if (lower.includes('uni') || lower.includes('estavel') || lower.includes('estável')) return 'União Estável';
  return '';
}

/**
 * Remove cabeçalhos, marcas d'água e frases de template conhecidas
 */
export function cleanWatermarks(text: string): string {
  if (!text) return '';
  return text
    .replace(/Documento gerado e formatado pelo Curr[íi]culo Express[^\n]*/gi, '')
    .replace(/Curr[íi]culo Express(?:\s*-\s*Senac[^\n]*)?/gi, '')
    .replace(/https?:\/\/[^\s]+/gi, (url) => (url.includes('linkedin.com') || url.includes('github.com') ? url : ''))
    .replace(/127\.0\.0\.1:\d+[^\n]*/g, '')
    .replace(/localhost:\d+[^\n]*/g, '')
    .replace(/Página \d+ de \d+/gi, '')
    .replace(/Page \d+ of \d+/gi, '')
    .trim();
}

/**
 * Converte entradas diversas de habilidades em array de strings limpas
 */
export function sanitizeStringList(input: any): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return Array.from(
      new Set(
        input
          .flatMap((item) => (typeof item === 'string' ? item.split(/[•,;|\n]/) : []))
          .map((s) => s.trim())
          .filter((s) => s.length > 1 && !/^(skills|habilidades|competências)$/i.test(s))
      )
    );
  }
  if (typeof input === 'string') {
    return Array.from(
      new Set(
        input
          .split(/[•,;|\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 1 && !/^(skills|habilidades|competências)$/i.test(s))
      )
    );
  }
  return [];
}

/**
 * Sanitiza e normaliza formações acadêmicas
 */
export function sanitizeEducation(list: any[]): Education[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && (item.course || item.institution || item.degree || typeof item === 'string'))
    .map((item) => {
      if (typeof item === 'string') {
        return {
          id: uid(),
          degree: 'Graduação / Superior',
          course: item.trim(),
          institution: '',
          year: '',
          period: ''
        };
      }
      return {
        id: item.id || uid(),
        degree: item.degree || item.level || 'Graduação / Superior',
        course: item.course || item.name || '',
        institution: item.institution || item.school || '',
        year: String(item.year || item.conclusionYear || '').trim(),
        period: item.period || item.shift || ''
      };
    });
}

/**
 * Sanitiza e normaliza experiências profissionais
 */
export function sanitizeExperience(list: any[]): Experience[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && (item.role || item.position || item.company || item.description || typeof item === 'string'))
    .map((item) => {
      if (typeof item === 'string') {
        return {
          id: uid(),
          role: 'Experiência Profissional',
          company: '',
          startDate: '',
          endDate: '',
          current: false,
          description: item.trim()
        };
      }
      return {
        id: item.id || uid(),
        role: item.role || item.position || item.cargo || '',
        company: item.company || item.empresa || '',
        startDate: item.startDate || item.start || item.period?.split(/[-–a]/)[0]?.trim() || '',
        endDate: item.endDate || item.end || (item.current ? '' : item.period?.split(/[-–a]/)[1]?.trim()) || '',
        current: Boolean(item.current || /atual|presente|momento/i.test(item.endDate || item.period || '')),
        description: item.description || item.activities || item.resumo || ''
      };
    });
}

/**
 * Sanitiza e normaliza idiomas
 */
export function sanitizeLanguages(list: any[]): Language[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && (item.name || typeof item === 'string'))
    .map((item) => {
      if (typeof item === 'string') {
        const parts = item.split(/[-–:(]/).map((p) => p.replace(/[)]/g, '').trim());
        return {
          id: uid(),
          name: parts[0] || item.trim(),
          level: parts[1] || 'Intermediário'
        };
      }
      return {
        id: item.id || uid(),
        name: item.name || '',
        level: item.level || 'Intermediário'
      };
    });
}

/**
 * Sanitiza e normaliza certificações
 */
export function sanitizeCertifications(list: any[]): Certification[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && (item.name || typeof item === 'string'))
    .map((item) => {
      if (typeof item === 'string') {
        return {
          id: uid(),
          name: item.trim(),
          issuer: '',
          year: ''
        };
      }
      return {
        id: item.id || uid(),
        name: item.name || '',
        issuer: item.issuer || item.institution || '',
        year: String(item.year || '').trim()
      };
    });
}

/**
 * Sanitiza e normaliza projetos
 */
export function sanitizeProjects(list: any[]): ProjectOrAchievement[] {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && (item.title || item.name || typeof item === 'string'))
    .map((item) => {
      if (typeof item === 'string') {
        return {
          id: uid(),
          title: item.trim(),
          description: '',
          link: '',
          year: ''
        };
      }
      return {
        id: item.id || uid(),
        title: item.title || item.name || '',
        description: item.description || '',
        link: item.link || item.url || '',
        year: String(item.year || '').trim()
      };
    });
}

/**
 * Função Mestra de Sanitização Defensiva para qualquer dado importado
 */
export function sanitizeImportedResumeData(data: any, rawTextFallback: string = ''): Partial<ResumeData> {
  if (!data || typeof data !== 'object') {
    return {
      summary: cleanWatermarks(rawTextFallback).slice(0, 1000)
    };
  }

  let cleanName = (data.name || '').trim();
  if (/^(nome|nome completo|seu nome|ex:.*|curriculo|currículo)$/i.test(cleanName) ||
      cleanName.includes('Documento gerado') ||
      cleanName.length > 70) {
    cleanName = '';
  }

  let cleanJobTitle = (data.jobTitle || data.objective || data.cargo || '').trim();
  if (cleanJobTitle.includes('Documento gerado') ||
      cleanJobTitle.includes('Curriculo Express') ||
      cleanJobTitle.length > 90) {
    cleanJobTitle = '';
  }

  // Limpeza de resumo (remover cabeçalhos residuais como "SÍNTESE DE QUALIFICAÇÕES")
  let cleanSummary = cleanWatermarks(data.summary || data.qualificationSummary || data.resumo || '').trim();
  cleanSummary = cleanSummary
    .replace(/^(?:SÍNTESE(?:\s+DE\s+QUALIFICAÇÕES)?|RESUMO(?:\s+PROFISSIONAL)?|PERFIL(?:\s+PROFISSIONAL)?|SOBRE\s+MIM)[\s:.]*/i, '')
    .trim();

  // Se o resumo começou com o nome e contatos do próprio candidato (caso de agrupamento incorreto no PDF), limpar o início
  if (cleanName && cleanSummary.startsWith(cleanName)) {
    cleanSummary = cleanSummary.slice(cleanName.length).replace(/^[•\s\-,–/]+/, '').trim();
  }

  const result: Partial<ResumeData> = {
    name: cleanName,
    jobTitle: cleanJobTitle,
    email: normalizeEmail(data.email),
    phone: normalizePhone(data.phone || data.phone1 || data.whatsapp),
    state: normalizeState(data.state || data.uf),
    city: normalizeCity(data.city || data.cidade),
    birthDate: String(data.birthDate || data.birth || data.age || '').trim(),
    maritalStatus: normalizeMaritalStatus(data.maritalStatus || data.estadoCivil),
    driverLicense: (data.driverLicense || data.license || data.cnh || '').toString().trim().toUpperCase(),
    linkedin: (data.linkedin || '').replace(/^https?:\/\/(?:www\.)?/, '').trim(),
    github: (data.github || '').replace(/^https?:\/\/(?:www\.)?/, '').trim(),
    portfolio: (data.portfolio || data.site || '').trim(),
    summary: cleanSummary,
    hardSkills: sanitizeStringList(data.hardSkills || data.skills),
    softSkills: sanitizeStringList(data.softSkills),
    technologies: sanitizeStringList(data.technologies || data.tools || data.tecnologias),
    education: sanitizeEducation(data.education || data.formacao || []),
    experience: sanitizeExperience(data.experience || data.experiencias || []),
    languages: sanitizeLanguages(data.languages || data.idiomas || []),
    certifications: sanitizeCertifications(data.certifications || data.courses || data.cursos || []),
    projects: sanitizeProjects(data.projects || data.projetos || [])
  };

  return result;
}
