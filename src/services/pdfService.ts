import * as pdfjsLib from 'pdfjs-dist';

// Configurar o worker do PDF.js para o ambiente Vite
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('[PDFService] Falha ao configurar worker CDN:', e);
}

/**
 * Extrai todo o texto legível de um arquivo PDF ArrayBuffer
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .filter(Boolean)
        .join(' ');

      if (pageText.trim()) {
        fullText += pageText + '\n\n';
      }
    }

    return fullText.trim();
  } catch (err) {
    console.warn('[PDFService] Erro ao extrair texto do PDF via PDF.js:', err);
    throw err;
  }
}
