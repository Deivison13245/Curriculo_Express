/**
 * Serviço de Inteligência Artificial para o Gerador de Currículos
 * Integrado com a chave padrão do sistema e suporte à API do Google Gemini
 */

// Decoded fallback or Vite ENV key
const FALLBACK_KEY_B64 = 'QVEuQWI4Uk42S290czUxWlBYM0pjWkNOSWluR1RKRTY2bGl1N09aZkVCaHBqVXYzMHhJeEVn';

export function getApiKey(): string {
  const customKey = localStorage.getItem('gemini_api_key');
  if (customKey && customKey.trim()) {
    return customKey.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  try {
    return typeof atob !== 'undefined' ? atob(FALLBACK_KEY_B64) : '';
  } catch {
    return '';
  }
}

export function setApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
}

export function hasCustomApiKey(): boolean {
  return !!localStorage.getItem('gemini_api_key');
}

/**
 * Chamada à API Gemini com fallback inteligente
 */
export async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const key = getApiKey();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const payload: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('[AIService] API error:', res.status, errData);
      throw new Error(`API Gemini retornou status ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text.trim();
    }
    throw new Error('Resposta vazia da IA');
  } catch (err) {
    console.warn('[AIService] Falha na chamada de IA online, aplicando gerador contextual local:', err);
    throw err;
  }
}

/**
 * Parser multimodal direto para arquivos PDF, DOCX, imagens e documentos usando a API Gemini
 */
export async function parseResumeFileWithAI(base64Data: string, mimeType: string): Promise<any> {
  const key = getApiKey();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const prompt = `Você é um extrator de alta precisão especializado em ler e analisar arquivos de currículos (PDF, imagens e documentos) para o sistema Curriculo Express.

INSTRUÇÕES E REGRAS ABSOLUTAS:
1. Extraia o nome real do candidato presente no documento. NÃO extraia tags de sistema, lixo de codificação (como [xml#, tags HTML, etc.) nem nomes de exemplo.
2. Identifique com precisão:
   - Nome Completo
   - Cargo Pretendido / Objetivo Profissional (ou último cargo relevante)
   - E-mail de contato
   - Telefone / WhatsApp
   - Localização: Cidade e Estado (Sigla de 2 letras, ex: SP, BA, RJ)
   - Links: LinkedIn, GitHub, Portfólio se existirem no documento
   - Resumo Profissional / Síntese
   - Habilidades Técnicas (Hard Skills) e Tecnologias/Ferramentas
   - Habilidades Comportamentais (Soft Skills)
   - Experiências Profissionais completas (cargo, empresa, datas de início e fim, se é atual, e descrição das atividades)
   - Formação Acadêmica (grau/nível, curso, instituição, ano)
3. Não invente nenhum dado que não esteja presente no arquivo. Se um campo não constar, preencha como string vazia ("") ou array vazio ([]).

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem blocos de código adicionais, apenas o JSON bruto):
{
  "name": "Nome real",
  "jobTitle": "Cargo",
  "email": "email",
  "phone": "telefone",
  "city": "cidade",
  "state": "UF",
  "linkedin": "url do linkedin",
  "github": "url do github",
  "portfolio": "url do portfolio/site",
  "summary": "resumo profissional",
  "hardSkills": ["Habilidade 1", "Habilidade 2"],
  "softSkills": ["Soft Skill 1"],
  "technologies": ["Tecnologia 1", "Software 2"],
  "experience": [
    {
      "role": "Cargo",
      "company": "Empresa",
      "startDate": "Mês/Ano ou Ano",
      "endDate": "Mês/Ano ou Presente",
      "current": false,
      "description": "Atividades e conquistas"
    }
  ],
  "education": [
    {
      "degree": "Grau",
      "course": "Curso",
      "institution": "Instituição",
      "year": "Ano",
      "period": ""
    }
  ]
}`;

  const payload: any = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2500,
    }
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('[AIService] Erro no endpoint multimodal:', res.status, errData);
      throw new Error(`Erro na API Gemini ao ler arquivo (Status ${res.status})`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('A IA não retornou conteúdo para este documento.');
    }

    const cleanedJson = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(cleanedJson);
  } catch (err) {
    console.error('[AIService] Falha ao processar arquivo multimodal:', err);
    throw err;
  }
}

/**
 * Parser inteligente de currículo em texto usando IA com fallback heurístico
 */
export async function parseResumeTextWithAI(rawText: string): Promise<any> {
  const prompt = `Analise o texto abaixo, que corresponde a um currículo ou perfil profissional, e extraia estritamente os dados reais encontrados no texto em formato JSON.
ATENÇÃO CRÍTICA:
1. Extraia o nome real (NUNCA coloque tags como [xml#, nem nomes fictícios).
2. Não invente dados que não existam no texto. Se um campo não for identificado, retorne string vazia ou array vazio.

Retorne EXCLUSIVAMENTE um objeto JSON válido com esta estrutura:
{
  "name": "Nome completo",
  "jobTitle": "Cargo pretendido ou atual",
  "email": "E-mail de contato",
  "phone": "Telefone",
  "city": "Cidade",
  "state": "Sigla do Estado (2 letras, ex: SP)",
  "linkedin": "url ou usuário do linkedin",
  "github": "url do github",
  "portfolio": "url do portfolio",
  "summary": "Resumo profissional ou síntese",
  "hardSkills": ["Habilidade técnica 1", "Habilidade 2"],
  "softSkills": ["Habilidade comportamental 1"],
  "technologies": ["Tecnologia ou software 1", "Software 2"],
  "experience": [
    {
      "role": "Cargo",
      "company": "Empresa",
      "startDate": "Mês/Ano ou Ano",
      "endDate": "Mês/Ano ou Presente",
      "current": false,
      "description": "Atividades e conquistas"
    }
  ],
  "education": [
    {
      "degree": "Grau (ex: Graduação, Ensino Médio, Técnico)",
      "course": "Curso",
      "institution": "Instituição",
      "year": "Ano de conclusão",
      "period": ""
    }
  ]
}

Texto a ser analisado:
"""
${rawText}
"""`;

  try {
    const aiResponse = await callGemini(
      prompt,
      'Você é um parser especializado em extração de currículos e perfis profissionais para o sistema Curriculo Express. Responda apenas com o JSON estruturado.'
    );

    // Limpa possíveis blocos ```json ... ```
    const cleanedJson = aiResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);
    return parsed;
  } catch (e) {
    console.warn('[AIService] Falha ao processar com IA, usando extração heurística local:', e);
    return parseResumeHeuristic(rawText);
  }
}

/**
 * Extrator local de emergência usando expressões regulares
 */
export function parseResumeHeuristic(text: string): any {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const email = emailMatch ? emailMatch[1] : '';

  // Telefone
  const phoneMatch = text.match(/(?:\(?\d{2}\)?\s*)?(?:9\s*)?\d{4}[-\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // Nome (geralmente a primeira linha de texto não vazia que não seja email nem telefone)
  let name = '';
  for (const line of lines) {
    if (line.length > 2 && line.length < 50 && !line.includes('@') && !/\d{4}/.test(line)) {
      name = line;
      break;
    }
  }

  // Cargo (segunda linha ou procura por palavras comuns)
  let jobTitle = '';
  if (lines.length > 1 && lines[1] !== name && !lines[1].includes('@') && lines[1].length < 60) {
    jobTitle = lines[1];
  }

  return {
    name,
    jobTitle,
    email,
    phone,
    summary: text.slice(0, 300),
    hardSkills: [],
    softSkills: [],
    technologies: [],
    experience: [],
    education: []
  };
}

