import { BRAZIL_STATES } from '../data/brazilLocations';
import type { ResumeData, Education, Experience, Language, ProjectOrAchievement } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// Limpa linhas desnecessárias (marcas d'água, rodapés de template, etc.)
function isIgnoredLine(line: string): boolean {
  const lower = line.toLowerCase().trim();
  if (!lower) return true;
  if (lower.includes('documento gerado e formatado pelo')) return true;
  if (lower.includes('visualização compacta')) return true;
  if (lower.includes('visualização completa')) return true;
  if (/^\d{1,3}%\s*visualização/i.test(lower)) return true;
  if (/^página\s+\d+\s+de\s+\d+/i.test(lower)) return true;
  if (/^page\s+\d+\s+of\s+\d+/i.test(lower)) return true;
  return false;
}

export function parseResumeStructured(rawText: string): Partial<ResumeData> {
  const cleanLines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => !isIgnoredLine(l));

  const result: Partial<ResumeData> = {
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    birthDate: '',
    maritalStatus: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    hardSkills: [],
    softSkills: [],
    technologies: [],
    experience: [],
    education: [],
    projects: [],
    languages: [],
    certifications: [],
  };

  // 1. Extração de Contatos Globais (Email, Telefone, Links, Nascimento, Estado Civil)
  const fullText = cleanLines.join('\n');

  // E-mail
  const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    result.email = emailMatch[1].trim();
  }

  // Telefone / WhatsApp
  const phoneMatch = fullText.match(/(?:\(?\d{2}\)?\s*)?(?:9\s*)?\d{4,5}[-\s]?\d{4}/);
  if (phoneMatch) {
    result.phone = phoneMatch[0].trim();
  }

  // Data de Nascimento
  const birthMatch = fullText.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
  if (birthMatch) {
    result.birthDate = birthMatch[1];
  } else {
    const ageMatch = fullText.match(/\b(\d{1,2}\s+anos)\b/i);
    if (ageMatch) result.birthDate = ageMatch[1];
  }

  // Estado Civil
  const maritalMatch = fullText.match(/\b(Solteiro\(a\)|Casado\(a\)|Divorciado\(a\)|Viúvo\(a\)|União Estável|Solteiro|Casada|Solteira|Casado)\b/i);
  if (maritalMatch) {
    result.maritalStatus = maritalMatch[1];
  }

  // LinkedIn
  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9._-]+)/i);
  if (linkedinMatch) {
    result.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
  }

  // GitHub
  const githubMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9._-]+)/i);
  if (githubMatch) {
    result.github = `github.com/${githubMatch[1]}`;
  }

  // Portfólio / Link externo
  const portfolioMatch = fullText.match(/(?:https?:\/\/)(?:www\.)?([a-zA-Z0-9-]+\.(?:com|com\.br|dev|io|org|net|render\.com|vercel\.app|onrender\.com)[^\s•]*)/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin.com') && !portfolioMatch[0].includes('github.com')) {
    result.portfolio = portfolioMatch[0].trim().replace(/^🔗/, '');
  }

  // Localização (Estado e Cidade)
  for (const s of BRAZIL_STATES) {
    // Ex: "Santo Antonio de Jesus - BA" ou "Santo Antonio de Jesus / BA" ou "BA - Salvador"
    const stateRegex = new RegExp(`([^•\n,–/]+)[–\\-/]\\s*(${s.sigla})\\b`, 'i');
    const locMatch = fullText.match(stateRegex);
    if (locMatch) {
      result.state = s.sigla;
      result.city = locMatch[1].trim().replace(/^.*?([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç\s]+)$/, '$1').trim();
      break;
    }
  }

  // 2. Identificação de Seções
  const SECTION_PATTERNS = [
    { key: 'summary', regex: /^(?:SÍNTESE(?: DE QUALIFICAÇÕES)?|RESUMO(?: PROFISSIONAL)?|PERFIL(?: PROFISSIONAL)?|OBJETIVO(?: PROFISSIONAL)?)/i },
    { key: 'education', regex: /^(?:FORMAÇÃO(?: ACADÊMICA)?|EDUCAÇÃO|ESCOLARIDADE|CURSOS ACADÊMICOS)/i },
    { key: 'technologies', regex: /^(?:TECNOLOGIAS DOMINADAS(?: & FERRAMENTAS)?|TECNOLOGIAS|FERRAMENTAS|CONHECIMENTOS TÉCNICOS)/i },
    { key: 'skills', regex: /^(?:PRINCIPAIS COMPETÊNCIAS|COMPETÊNCIAS|HABILIDADES)/i },
    { key: 'experience', regex: /^(?:EXPERIÊNCIA(?:S)?(?: PROFISSIONAL(?:IS)?)?|HISTÓRICO PROFISSIONAL|EXPERIÊNCIA DE TRABALHO)/i },
    { key: 'projects', regex: /^(?:PROJETOS(?: & PORTFÓLIO)?|PORTFÓLIO|PROJETOS REALIZADOS|PRINCIPAIS PROJETOS)/i },
    { key: 'languages', regex: /^(?:IDIOMAS?|LÍNGUAS)/i },
    { key: 'certifications', regex: /^(?:CERTIFICAÇÕES(?: E CURSOS)?|CURSOS COMPLEMENTARES)/i },
  ];

  interface SectionChunk {
    key: string;
    lines: string[];
  }

  const sections: SectionChunk[] = [];
  let currentKey = 'header';
  let currentLines: string[] = [];

  for (const line of cleanLines) {
    let matchedKey: string | null = null;
    for (const sec of SECTION_PATTERNS) {
      if (sec.regex.test(line)) {
        matchedKey = sec.key;
        break;
      }
    }

    if (matchedKey) {
      sections.push({ key: currentKey, lines: currentLines });
      currentKey = matchedKey;
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  sections.push({ key: currentKey, lines: currentLines });

  // 3. Processamento do Cabeçalho (Nome e Cargo)
  const headerSection = sections.find((s) => s.key === 'header');
  if (headerSection && headerSection.lines.length > 0) {
    const validHeaderLines = headerSection.lines.filter((l) => {
      // Ignora linhas que são puramente contatos ou links
      if (l.includes('@')) return false;
      if (/\(\d{2}\)/.test(l)) return false;
      if (/linkedin\.com/i.test(l)) return false;
      if (/github\.com/i.test(l)) return false;
      if (/^\s*•/.test(l)) return false;
      return true;
    });

    if (validHeaderLines.length > 0) {
      // Primeira linha válida é o Nome Completo
      result.name = validHeaderLines[0].replace(/•.*$/, '').trim();
    }
    if (validHeaderLines.length > 1) {
      // Segunda linha válida é o Cargo Pretendido
      result.jobTitle = validHeaderLines[1].replace(/•.*$/, '').trim();
    }
  }

  // 4. Processamento de cada Seção Específica
  for (const sec of sections) {
    const textBlock = sec.lines.join(' ').trim();
    if (!textBlock) continue;

    if (sec.key === 'summary') {
      result.summary = sec.lines.join('\n').trim();
    }

    if (sec.key === 'technologies') {
      // Divide por bullets, vírgulas, quebras de linha ou múltiplos espaços
      const rawItems = sec.lines
        .flatMap((l) => l.split(/[•,;|\n]/))
        .map((t) => t.trim())
        .filter((t) => t.length > 1 && !isIgnoredLine(t));

      // Se veio tudo em uma linha separada por espaços entre palavras compostas
      const techList: string[] = [];
      for (const item of rawItems) {
        if (item.length > 50) {
          // Separação de tags unidas
          const tokens = item.split(/\s{2,}|\t/).map((x) => x.trim()).filter(Boolean);
          techList.push(...tokens);
        } else {
          techList.push(item);
        }
      }
      result.technologies = Array.from(new Set(techList));
    }

    if (sec.key === 'skills') {
      // Extrai Hard Skills e Soft Skills explicitamente
      for (const l of sec.lines) {
        if (/^Hard Skills\s*:/i.test(l)) {
          const list = l.replace(/^Hard Skills\s*:/i, '').split(/[•,;]/).map((s) => s.trim()).filter(Boolean);
          result.hardSkills = Array.from(new Set([...(result.hardSkills || []), ...list]));
        } else if (/^Soft Skills\s*:/i.test(l)) {
          const list = l.replace(/^Soft Skills\s*:/i, '').split(/[•,;]/).map((s) => s.trim()).filter(Boolean);
          result.softSkills = Array.from(new Set([...(result.softSkills || []), ...list]));
        } else {
          // Linha geral de competências
          const generalList = l.split(/[•,;]/).map((s) => s.trim()).filter(Boolean);
          result.hardSkills = Array.from(new Set([...(result.hardSkills || []), ...generalList]));
        }
      }
    }

    if (sec.key === 'education') {
      const eduList: Education[] = [];
      for (const l of sec.lines) {
        if (!l.trim()) continue;
        // Padrão: "Curso / Grau — Instituição (Período) Ano" ou "Instituição - Curso - Ano"
        const yearMatch = l.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[1] : '';
        const periodMatch = l.match(/\((Matutino|Vespertino|Noturno|Integral|EAD)\)/i);
        const period = periodMatch ? periodMatch[1] : '';

        const cleanedLine = l.replace(/\b(19\d{2}|20\d{2})\b/g, '').replace(/\((Matutino|Vespertino|Noturno|Integral|EAD)\)/gi, '').trim();
        const parts = cleanedLine.split(/[—–-]/).map((p) => p.trim()).filter(Boolean);

        const course = parts[0] || l;
        const institution = parts[1] || '';

        let degree = 'Graduação / Superior';
        if (/administração|técnico|informática|desenvolvimento/i.test(course)) {
          degree = 'Ensino Técnico';
        }
        if (/médio/i.test(course)) degree = 'Ensino Médio';
        if (/pós|mba|especialização/i.test(course)) degree = 'Pós-graduação / Especialização';

        eduList.push({
          id: uid(),
          degree,
          course,
          institution,
          year,
          period,
        });
      }
      if (eduList.length > 0) result.education = eduList;
    }

    if (sec.key === 'experience') {
      const expList: Experience[] = [];
      for (let i = 0; i < sec.lines.length; i++) {
        const line = sec.lines[i];
        if (!line.trim()) continue;

        const parts = line.split(/[—–-]/).map((p) => p.trim());
        const role = parts[0] || line;
        const company = parts[1] || '';
        const dateMatch = line.match(/((?:Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez|\d{2}\/)?\d{4})\s*(?:a|até|-|–)\s*(Atual|Presente|(?:\d{2}\/)?\d{4})/i);

        const startDate = dateMatch ? dateMatch[1] : '';
        const endDate = dateMatch ? dateMatch[2] : '';
        const current = /atual|presente/i.test(endDate);

        const descLines: string[] = [];
        while (i + 1 < sec.lines.length && !sec.lines[i + 1].includes('—') && !sec.lines[i + 1].includes('–')) {
          i++;
          descLines.push(sec.lines[i]);
        }

        expList.push({
          id: uid(),
          role,
          company,
          startDate,
          endDate,
          current,
          description: descLines.join(' ').trim(),
        });
      }
      if (expList.length > 0) result.experience = expList;
    }

    if (sec.key === 'projects') {
      const projList: ProjectOrAchievement[] = [];
      let currentProj: Partial<ProjectOrAchievement> | null = null;

      for (const line of sec.lines) {
        if (!line.trim()) continue;

        if (/^https?:\/\//i.test(line) || line.includes('🔗')) {
          if (currentProj) {
            currentProj.link = line.replace(/^🔗\s*/, '').trim();
          }
        } else if (line.match(/\b(19\d{2}|20\d{2})\b/) && !currentProj?.title) {
          const yearM = line.match(/\b(19\d{2}|20\d{2})\b/);
          currentProj = {
            id: uid(),
            title: line.replace(/\b(19\d{2}|20\d{2})\b/, '').trim(),
            year: yearM ? yearM[1] : '',
            description: '',
          };
        } else if (currentProj && !currentProj.description) {
          currentProj.description = line.trim();
          projList.push(currentProj as ProjectOrAchievement);
          currentProj = null;
        } else {
          if (currentProj) projList.push(currentProj as ProjectOrAchievement);
          currentProj = {
            id: uid(),
            title: line.trim(),
            description: '',
          };
        }
      }
      if (currentProj && currentProj.title) {
        projList.push(currentProj as ProjectOrAchievement);
      }
      if (projList.length > 0) result.projects = projList;
    }

    if (sec.key === 'languages') {
      const langList: Language[] = [];
      const tokens = sec.lines.flatMap((l) => l.split(/[•,;]/)).map((t) => t.trim()).filter(Boolean);

      for (const t of tokens) {
        const match = t.match(/^([A-Za-zÀ-ÿ\s]+)(?:\((.*?)\))?$/);
        if (match) {
          langList.push({
            id: uid(),
            name: match[1].trim(),
            level: match[2]?.trim() || 'Intermediário',
          });
        }
      }
      if (langList.length > 0) result.languages = langList;
    }
  }

  return result;
}
