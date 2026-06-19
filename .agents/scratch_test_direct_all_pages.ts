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
  
  let fullText = '';
  const pageMap: any[] = [];
  let currentPos = 0;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => {
      return 'str' in item ? item.str + (item.hasEOL ? '\n' : '') : '';
    }).join('');
    
    const start = currentPos;
    const end = currentPos + pageText.length;
    pageMap.push({
      pageNum: i,
      startChar: start,
      endChar: end
    });
    
    fullText += pageText + '\n\n';
    currentPos = end + 2;
    console.log(`Page ${i} extracted. Length: ${pageText.length}`);
  }

  console.log(`Total Extracted Text Length: ${fullText.length}`);
  console.log(`PageMap entries count: ${pageMap.length}`);
  console.log("=== First 500 characters of full text ===");
  console.log(fullText.substring(0, 500));
}

run().catch(console.error);
