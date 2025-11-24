import PDFParser from "pdf2json";

// Safely decode strings without throwing URI errors
function safeDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    // Replace invalid characters and return raw text
    return input.replace(/%/g, " ");
  }
}

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)();

    pdfParser.on("pdfParser_dataError", (err: any) => reject(err.parserError));

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let extracted = "";

      pdfData.Pages.forEach((page: any) => {
        page.Texts.forEach((t: any) => {
          const raw = t.R[0]?.T || "";   // prevent crashes if T missing
          extracted += safeDecode(raw) + " ";
        });
      });

      resolve(extracted);
    });

    pdfParser.parseBuffer(buffer);
  });
}
