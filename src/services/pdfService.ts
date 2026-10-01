import * as pdfjsLib from 'pdfjs-dist';
// Importação do worker local empacotado pelo Vite (100% livre de CORS e funciona offline)
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Agrupa itens de texto ordenados espacialmente (X e Y) para preservar quebras de linha e fluxo natural de leitura
 */
function processTextItemsSpatially(items: PdfTextItem[], pageWidth: number): string {
  if (!items.length) return '';

  // 1. Detecta se a página tem layout de 2 colunas
  // Procura por um divisor central (gutter) entre 30% e 60% da largura
  let isTwoColumn = false;
  let splitX = pageWidth * 0.45;

  const leftItems = items.filter((i) => i.x < splitX);
  const rightItems = items.filter((i) => i.x >= splitX);

  // Se ambos os lados têm uma quantidade considerável de itens e há separação clara
  if (leftItems.length > 8 && rightItems.length > 8) {
    const overlappingItems = items.filter((i) => i.x < splitX && i.x + i.width > splitX);
    if (overlappingItems.length / items.length < 0.15) {
      isTwoColumn = true;
    }
  }

  // Função interna para formatar um conjunto de itens em linhas ordenadas
  const formatItemsToLines = (targetItems: PdfTextItem[]): string => {
    const TOLERANCE_Y = 3.5;
    const lines: { y: number; items: PdfTextItem[] }[] = [];

    for (const item of targetItems) {
      const existingLine = lines.find((l) => Math.abs(l.y - item.y) <= TOLERANCE_Y);
      if (existingLine) {
        existingLine.items.push(item);
      } else {
        lines.push({ y: item.y, items: [item] });
      }
    }

    // Ordenar linhas do topo para a base (Y decrescente no PDF)
    lines.sort((a, b) => b.y - a.y);

    // Em cada linha, ordenar itens da esquerda para a direita (X crescente)
    const formattedLines = lines.map((line) => {
      line.items.sort((a, b) => a.x - b.x);
      return line.items
        .map((i) => i.str.trim())
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ');
    });

    return formattedLines.filter((l) => l.trim().length > 0).join('\n');
  };

  if (isTwoColumn) {
    // Top Header (linhas que ocupam o topo antes das colunas)
    const maxY = Math.max(...items.map((i) => i.y));
    const headerThreshold = maxY - 120;

    const headerItems = items.filter((i) => i.y >= headerThreshold);
    const colLeft = leftItems.filter((i) => i.y < headerThreshold);
    const colRight = rightItems.filter((i) => i.y < headerThreshold);

    const headerText = formatItemsToLines(headerItems);
    const leftText = formatItemsToLines(colLeft);
    const rightText = formatItemsToLines(colRight);

    return [headerText, leftText, rightText].filter(Boolean).join('\n\n');
  }

  // Monocoluna: Ordenação padrão por Y decrescente e X crescente
  return formatItemsToLines(items);
}

/**
 * Decodificador de emergência para fluxos de texto de PDF diretamente de ArrayBuffer
 */
function extractRawPdfStreams(arrayBuffer: ArrayBuffer): string {
  try {
    const uint8 = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('latin1');
    const raw = decoder.decode(uint8);

    const textParts: string[] = [];

    // Extração de blocos de texto entre parênteses em operadores Tj ou TJ
    const textBlocks = raw.matchAll(/\(([^)]+)\)\s*(?:Tj|'|")/g);
    for (const match of textBlocks) {
      const cleaned = match[1]
        .replace(/\\([()\\])/g, '$1')
        .replace(/\\[nrtbf]/g, ' ')
        .trim();
      if (cleaned.length > 1 && !/^[0-9\s.]+$/.test(cleaned)) {
        textParts.push(cleaned);
      }
    }

    const tjBlocks = raw.matchAll(/\[(.*?)\]\s*TJ/g);
    for (const match of tjBlocks) {
      const inner = match[1];
      const items = inner.matchAll(/\(([^)]+)\)/g);
      const joined = Array.from(items)
        .map((m) => m[1].replace(/\\([()\\])/g, '$1'))
        .join(' ');
      if (joined.trim().length > 1) {
        textParts.push(joined.trim());
      }
    }

    return textParts.join('\n');
  } catch (e) {
    console.warn('[PDFService] Falha no fallback raw PDF:', e);
    return '';
  }
}

/**
 * Renderiza uma página do PDF em canvas e exporta como Base64 (para PDFs escaneados / imagens)
 */
export async function renderPdfPageToBase64(arrayBuffer: ArrayBuffer, pageNumber: number = 1): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    if (pageNumber > pdf.numPages) pageNumber = 1;

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (!context) throw new Error('Não foi possível obter contexto 2D do Canvas');

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    return dataUrl.split(',')[1];
  } catch (err) {
    console.warn('[PDFService] Falha ao renderizar página do PDF em Canvas:', err);
    throw err;
  }
}

/**
 * Extrai todo o texto legível de um arquivo PDF com organização espacial X/Y e suporte a 2 colunas
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  // Tentativa 1: PDF.js espacial
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();

      const items: PdfTextItem[] = [];

      for (const item of textContent.items) {
        if ('str' in item && typeof item.str === 'string' && item.str.trim()) {
          const transform = item.transform;
          const x = transform ? transform[4] : 0;
          const y = transform ? transform[5] : 0;
          const width = item.width || Math.abs(transform ? transform[0] : 10);
          const height = item.height || Math.abs(transform ? transform[3] : 10);

          items.push({
            str: item.str,
            x,
            y,
            width,
            height,
          });
        }
      }

      const pageFormattedText = processTextItemsSpatially(items, viewport.width);
      if (pageFormattedText.trim()) {
        pageTexts.push(pageFormattedText);
      }
    }

    const fullText = pageTexts.join('\n\n').trim();
    if (fullText.length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('[PDFService] Falha na extração espacial PDF.js, testando fallback binário:', err);
  }

  // Tentativa 2: Extrator binário direto de texto
  const rawDecoded = extractRawPdfStreams(arrayBuffer);
  if (rawDecoded.trim().length > 20) {
    return rawDecoded.trim();
  }

  throw new Error('PDF sem camada de texto legível (possivelmente digitalizado em imagem).');
}
