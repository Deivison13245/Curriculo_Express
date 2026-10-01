import { BRAZIL_STATES } from '../data/brazilLocations';
import type { ResumeData, Education, Experience, Language, Certification, ProjectOrAchievement } from '../types';
import { normalizeText, findMatchingCity } from '../services/ibgeService';

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

  // Remove siglas no final (ex: "Serrinha - BA" -> "Serrinha")
  city = city.replace(/[-–/]\s*[A-Z]{2}$/i, '').trim();
  city = city.replace(/^(?:Cidade|Município|City):\s*/i, '').trim();

  // Se contiver palavras que não são cidades (ex: seções de currículo)
  if (/s[íi]ntese|objetivo|educa|experi|curr[íi]culo|nome|idade|telefone|email|outra cidade/i.test(city)) {
    return '';
  }

  return city;
}

/**
 * Extrai e formata números de telefone brasileiros legítimos, rejeitando anos como 20262026
 */
export function extractValidBrazilianPhone(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // 1. Padrão com DDD explícito e hífen/espaço: (75) 98123-8602 ou (75) 98123 8602
  const dddWithParens = text.match(/\(([1-9]{2})\)\s*(9?\s*\d{4})[-\s.]*(\d{4})/);
  if (dddWithParens) {
    const ddd = dddWithParens[1];
    const prefix = dddWithParens[2].replace(/\s+/g, '');
    const suffix = dddWithParens[3];
    return `(${ddd}) ${prefix}-${suffix}`;
  }

  // 2. Padrão com código de país: +55 (75) 98123-8602 ou +55 75 981238602
  const international = text.match(/(?:\+55|55)?\s*\(?([1-9]{2})\)?\s*(9\d{4})[-\s.]*(\d{4})/);
  if (international) {
    return `(${international[1]}) ${international[2]}-${international[3]}`;
  }

  // 3. Padrão 8 ou 9 dígitos com DDD: 75 98123-8602 ou 75981238602
  const digitsOnly = text.replace(/\D/g, '');
  if ((digitsOnly.length === 11 || digitsOnly.length === 10) && !/^(19|20)\d{2}(19|20)\d{2}/.test(digitsOnly)) {
    const ddd = digitsOnly.slice(0, 2);
    const rest = digitsOnly.slice(2);
    if (rest.length === 9) {
      return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
    } else {
      return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
  }

  return '';
}

/**
 * Normaliza telefone para formato brasileiro legível
 */
export function normalizePhone(phoneInput: any): string {
  if (!phoneInput || typeof phoneInput !== 'string') return '';
  const extracted = extractValidBrazilianPhone(phoneInput);
  if (extracted) return extracted;

  const digits = phoneInput.replace(/\D/g, '');
  // Rejeita sequências que são anos duplicados como 20262026
  if (/^(19|20)\d{2}(19|20)\d{2}/.test(digits)) {
    return '';
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return '';
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

  // Limpeza de resumo
  let cleanSummary = cleanWatermarks(data.summary || data.qualificationSummary || data.resumo || '').trim();
  cleanSummary = cleanSummary
    .replace(/^(?:SÍNTESE(?:\s+DE\s+QUALIFICAÇÕES)?|RESUMO(?:\s+PROFISSIONAL)?|PERFIL(?:\s+PROFISSIONAL)?|SOBRE\s+MIM)[\s:.]*/i, '')
    .trim();

  if (cleanName && cleanSummary.startsWith(cleanName)) {
    cleanSummary = cleanSummary.slice(cleanName.length).replace(/^[•\s\-,–/]+/, '').trim();
  }

  // Extração de telefone com prioridade para texto bruto caso o dado venha corrompido
  let finalPhone = normalizePhone(data.phone || data.phone1 || data.whatsapp);
  if (!finalPhone && rawTextFallback) {
    finalPhone = extractValidBrazilianPhone(rawTextFallback);
  }

  const result: Partial<ResumeData> = {
    name: cleanName,
    jobTitle: cleanJobTitle,
    email: normalizeEmail(data.email || (rawTextFallback.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0])),
    phone: finalPhone,
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
