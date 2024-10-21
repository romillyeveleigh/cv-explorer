import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import path from "path";
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { pdfToPng } from 'pdf-to-png-converter';
import * as pdfjs from 'pdfjs-dist';

// Import the worker
// import PDFWorker from 'pdfjs-dist/build/pdf.worker.mjs';

// // Set the worker
// pdfjs.GlobalWorkerOptions.workerPort = new PDFWorker();

// 


export async function POST(request: NextRequest) {


  const formData: FormData = await request.formData();
  const uploadedFile = formData.get("pdf") as File | null;

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    return NextResponse.json(
      { error: "No valid PDF file found" },
      { status: 400 }
    );
  }

  const fileName = uuidv4();
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `${Date.now()}_${fileName}.pdf`);

  try {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages();
    const imageUrls = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // const pngImage = await page.exportAsPNG({ scale: 2 });
      const pngImage = await pdfToPng(fileBuffer);
      const pngBuffer = Buffer.from(pngImage[0].content);
      
      const outputPath = path.join(process.cwd(), 'public', 'uploads', `page_${i + 1}.png`);
      await sharp(pngBuffer).toFile(outputPath);
      
      imageUrls.push(`/uploads/page_${i + 1}.png`);
    }
      console.log("🚀 ~ POST ~ imageUrls:", imageUrls)

    return NextResponse.json({ text: imageUrls });




    const parsedText = await parsePDF(tempFilePath);
    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  } finally {
    await fs.unlink(tempFilePath).catch(console.error);
  }
}

function parsePDF(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) =>
      reject(errData.parserError)
    );

    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });

    pdfParser.loadPDF(filePath);
  });
}
