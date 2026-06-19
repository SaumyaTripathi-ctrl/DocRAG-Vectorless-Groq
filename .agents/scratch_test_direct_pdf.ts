import fs from 'fs';
import * as pdfjs from 'c:/Users/HP/Downloads/project/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
// @ts-expect-error - legacy worker bundle
import * as pdfjsWorker from 'c:/Users/HP/Downloads/project/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs';

async function run() {
  const pdfPath = 'C:/Users/HP/Downloads/Sustainability and environment (1).pdf';
  console.log(`Reading PDF from: ${pdfPath}`);
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF file does not exist!");
    return;
  }

  const fileBuffer = fs.readFileSync(pdfPath);
  const data = new Uint8Array(fileBuffer);

  if (!(globalThis as any).pdfjsWorker) {
    (globalThis as any).pdfjsWorker = pdfjsWorker;
  }

  const loadingTask = pdfjs.getDocument({
    data,
    verbosity: 0
  });

  const doc = await loadingTask.promise;
  console.log('Total Pages:', doc.numPages);
  
  const page = await doc.getPage(1);
  const textContent = await page.getTextContent();
  const text = textContent.items.map((item: any) => {
    return 'str' in item ? item.str + (item.hasEOL ? '\n' : '') : '';
  }).join('');
  
  console.log('Text length on page 1:', text.length);
  console.log('First 200 chars on page 1:\n', text.substring(0, 200));
}

run().catch(console.error);
