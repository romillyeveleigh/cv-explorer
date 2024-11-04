"use server";

import PDFParser from "pdf2json";

function parsePDF(pdfBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));

    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });

    pdfParser.parseBuffer(pdfBuffer);
  });
}

function parsePDF2(pdfBuffer: Buffer): Promise<string> {
  // const fs = require('fs')
  const pdf = require("pdf-parse");
  // let dataBuffer = fs.readFileSync(pdfBuffer);

  return new Promise((resolve, reject) => {
    pdf(pdfBuffer).then((data: any) => {
      console.log("🚀 ~ pdf ~ data.text:", data.text);
      resolve(data.text);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

export { parsePDF, parsePDF2 };
