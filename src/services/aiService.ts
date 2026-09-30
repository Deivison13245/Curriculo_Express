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
