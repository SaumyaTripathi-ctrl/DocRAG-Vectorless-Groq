import fs from 'fs';
import * as pdfjs from 'c:/Users/HP/Downloads/project/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
// @ts-expect-error - legacy worker bundle
import * as pdfjsWorker from 'c:/Users/HP/Downloads/project/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs';

function getPageTextDirect(page: any, total: number): Promise<string> {
  return new Promise(async (resolve) => {
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();
    const strBuf: string[] = [];
    let lastX: number | undefined;
    let lastY: number | undefined;
    let lineHeight = 0;

    const lineThreshold = 4.6;
    const cellThreshold = 7;
    const cellSeparator = '\t';
    const lineEnforce = true;

    for (const item of textContent.items) {
      if (!('str' in item)) continue;
      const tm = item.transform;
      const [x, y] = viewport.convertToViewportPoint(tm[4], tm[5]);

      if (lineEnforce) {
        if (lastY !== undefined && Math.abs(lastY - y) > lineThreshold) {
          const lastItem = strBuf.length ? strBuf[strBuf.length - 1] : undefined;
          const isCurrentItemHasNewLine = item.str.startsWith('\n') || (item.str.trim() === '' && item.hasEOL);
          if (lastItem?.endsWith('\n') === false && !isCurrentItemHasNewLine) {
            const ydiff = Math.abs(lastY - y);
            if (ydiff - 1 > lineHeight) {
              strBuf.push('\n');
              lineHeight = 0;
            }
          }
        }
      }

      if (cellSeparator) {
        if (lastY !== undefined && Math.abs(lastY - y) < lineThreshold) {
          if (lastX !== undefined && Math.abs(lastX - x) > cellThreshold) {
            item.str = `${cellSeparator}${item.str}`;
          }
        }
      }

      strBuf.push(item.str);
      lastX = x + item.width;
      lastY = y;
      lineHeight = Math.max(lineHeight, item.height);
      
      if (item.hasEOL) {
        strBuf.push('\n');
      }
      if (item.hasEOL || item.str.endsWith('\n')) {
        lineHeight = 0;
      }
    }
    resolve(strBuf.join(''));
  });
}

async function run() {
  const pdfPath = 'C:/Users/HP/Downloads/Sustainability and environment (1).pdf';
  const fileBuffer = fs.readFileSync(pdfPath);
  const buffer = new Uint8Array(fileBuffer);

  // Method 1: Using pdf-parse
  let textParse = 'PLACEHOLDER';
  let pagesParseCount = 12;
  /*
  try {
    if (!(globalThis as any).pdfjsWorker) {
      (globalThis as any).pdfjsWorker = pdfjsWorker;
    }
    const { PDFParse } = require('c:/Users/HP/Downloads/project/node_modules/pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    textParse = result.text || '';
  } catch (err) {
    console.error("Method 1 failed:", err);
  }
  */

  // Method 2: Direct pdfjs-dist with exact text parsing copy
  let textDirect = '';
  try {
    const loadingTask = pdfjs.getDocument({
      data: buffer,
      verbosity: 0
    });
    const doc = await loadingTask.promise;
    const total = doc.numPages;
    const pages: { text: string; num: number }[] = [];

    for (let i = 1; i <= total; i++) {
      const page = await doc.getPage(i);
      const pageText = await getPageTextDirect(page, total);
      pages.push({ text: pageText, num: i });
    }

    const pageJoiner = '\n-- page_number of total_number --';
    for (const page of pages) {
      let pageNumber = pageJoiner.replace('page_number', `${page.num}`);
      pageNumber = pageNumber.replace('total_number', `${total}`);
      textDirect += `${page.text}\n${pageNumber}\n\n`;
    }
  } catch (err) {
    console.error("Method 2 failed:", err);
  }

  console.log("=== COMPARISON V2 RESULTS ===");
  console.log("Method 1 (pdf-parse) Text Length:", textParse.length);
  console.log("Method 2 (direct)    Text Length:", textDirect.length);
  console.log("Texts Match Exactly:", textParse === textDirect);

  if (textParse !== textDirect) {
    console.log("First mismatch index:", findFirstMismatch(textParse, textDirect));
  }
}

function findFirstMismatch(s1: string, s2: string): number {
  const len = Math.min(s1.length, s2.length);
  for (let i = 0; i < len; i++) {
    if (s1[i] !== s2[i]) {
      console.log(`Mismatch at index ${i}:`);
      console.log(`s1 snippet: ${JSON.stringify(s1.substring(Math.max(0, i-20), i+20))}`);
      console.log(`s2 snippet: ${JSON.stringify(s2.substring(Math.max(0, i-20), i+20))}`);
      return i;
    }
  }
  return len;
}

run().catch(console.error);
