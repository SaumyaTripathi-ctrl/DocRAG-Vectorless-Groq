import fs from 'fs';
import * as pdfjs from 'c:/Users/HP/Downloads/project/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
// @ts-expect-error - legacy worker bundle
import * as pdfjsWorker from 'c:/Users/HP/Downloads/project/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs';

async function run() {
  const pdfPath = 'C:/Users/HP/Downloads/Sustainability and environment (1).pdf';
  const fileBuffer = fs.readFileSync(pdfPath);
  const buffer = new Uint8Array(fileBuffer);

  // Method 1: Using pdf-parse
  let textParse = '';
  let pagesParseCount = 0;
  let pageMapParse: any[] = [];
  try {
    if (!(globalThis as any).pdfjsWorker) {
      (globalThis as any).pdfjsWorker = pdfjsWorker;
    }
    const { PDFParse } = require('c:/Users/HP/Downloads/project/node_modules/pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    textParse = result.text || '';
    pagesParseCount = result.total || 0;
    
    let currentPos = 0;
    for (const page of result.pages) {
      const pageText = page.text;
      const start = currentPos;
      const end = currentPos + pageText.length;
      pageMapParse.push({
        pageNum: page.num,
        startChar: start,
        endChar: end
      });
      currentPos = end + 2;
    }
  } catch (err) {
    console.error("Method 1 failed:", err);
  }

  // Method 2: Direct pdfjs-dist
  let textDirect = '';
  let pagesDirectCount = 0;
  let pageMapDirect: any[] = [];
  try {
    const loadingTask = pdfjs.getDocument({
      data: buffer,
      verbosity: 0
    });
    const doc = await loadingTask.promise;
    pagesDirectCount = doc.numPages;
    
    const pages: { text: string; num: number }[] = [];
    for (let i = 1; i <= pagesDirectCount; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => {
          return 'str' in item ? item.str + (item.hasEOL ? '\n' : '') : '';
        })
        .join('');
      pages.push({ text: pageText, num: i });
    }
    
    let currentPos = 0;
    for (const page of pages) {
      const pageText = page.text;
      const start = currentPos;
      const end = currentPos + pageText.length;
      pageMapDirect.push({
        pageNum: page.num,
        startChar: start,
        endChar: end
      });
      textDirect += pageText + '\n\n';
      currentPos = end + 2;
    }
  } catch (err) {
    console.error("Method 2 failed:", err);
  }

  console.log("=== COMPARISON RESULTS ===");
  console.log("Method 1 (pdf-parse) Total Pages:", pagesParseCount);
  console.log("Method 2 (direct)    Total Pages:", pagesDirectCount);
  console.log("Method 1 Text Length:", textParse.length);
  console.log("Method 2 Text Length:", textDirect.length);
  console.log("Texts Match Exactly:", textParse === textDirect);
  console.log("PageMaps Match Exactly:", JSON.stringify(pageMapParse) === JSON.stringify(pageMapDirect));
}

run().catch(console.error);
