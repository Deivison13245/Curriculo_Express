export interface IBGEMunicipio {
  id: number;
  nome: string;
}

const cacheMunicipios: Record<string, string[]> = {};

/**
 * Remove acentos e caracteres especiais para comparação flexível
 */
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca todos os municípios de uma UF diretamente da API do IBGE com suporte a cache local
 */
export async function getMunicipiosByUF(uf: string): Promise<string[]> {
  const ufUpper = (uf || '').toUpperCase().trim();
  if (!ufUpper || ufUpper.length !== 2) return [];

  // 1. Cache em memória RAM
  if (cacheMunicipios[ufUpper] && cacheMunicipios[ufUpper].length > 0) {
    return cacheMunicipios[ufUpper];
  }

  // 2. Cache em localStorage
  try {
    const localData = localStorage.getItem(`ibge_cidades_${ufUpper}`);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cacheMunicipios[ufUpper] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[IBGEService] Falha ao ler cache local:', e);
  }

  // 3. Requisição direta à API Oficial do IBGE
  try {
    const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufUpper}/municipios?ordenar=nome`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data: IBGEMunicipio[] = await res.json();
    const nomes = data.map((m) => m.nome);

    if (nomes.length > 0) {
      cacheMunicipios[ufUpper] = nomes;
      try {
        localStorage.setItem(`ibge_cidades_${ufUpper}`, JSON.stringify(nomes));
      } catch (err) {
        console.warn('[IBGEService] Não foi possível salvar em localStorage:', err);
      }
      return nomes;
    }
  } catch (err) {
    console.warn('[IBGEService] Erro ao buscar cidades do IBGE:', err);
  }

  return [];
}

/**
 * Encontra o nome oficial da cidade do IBGE mais próximo do texto extraído do PDF com precisão estrita
 */
export function findMatchingCity(rawCity: string, cityList: string[]): string {
  if (!rawCity || !cityList || cityList.length === 0) return rawCity || '';
  const cleanRaw = normalizeText(rawCity);
  if (!cleanRaw) return rawCity;

  // 1. Busca exata insensível a acento e maiúsculas/minúsculas
  const exactMatch = cityList.find((c) => normalizeText(c) === cleanRaw);
  if (exactMatch) return exactMatch;

  // 2. Busca exata por prefixo completo ou extensão completa (apenas para strings significativas)
  if (cleanRaw.length >= 6) {
    const prefixMatch = cityList.find((c) => {
      const normC = normalizeText(c);
      return normC.startsWith(cleanRaw) || cleanRaw.startsWith(normC);
    });
    if (prefixMatch) return prefixMatch;
  }

  // 3. Busca por correspondência de todas as palavras substantivas (ex: "santo antonio" em "Santo Antônio de Jesus")
  const rawWords = cleanRaw.split(/\s+/).filter((w) => w.length > 2 && !/^(de|da|do|dos|das|em|no|na)$/.test(w));
  if (rawWords.length >= 2) {
    const wordMatch = cityList.find((c) => {
      const normC = normalizeText(c);
      return rawWords.every((w) => normC.includes(w));
    });
    if (wordMatch) return wordMatch;
  }

  return rawCity;
}
