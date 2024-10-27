import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import path from "path";
import { File } from "buffer";
import { isReadableText } from "@/app/utils";

// @ts-expect-error This does not exist outside of polyfill which this is doing
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.min.mjs';

const fallbackOcrTextExtraction = async (pdfBuffer: Buffer) => {
  console.log("fallbackOcrTextExtraction");
  // @ts-expect-error This does not exist outside of polyfill which this is doing
  await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs');
  const pdf2img = await import("pdf-img-convert");
  const { createWorker, createScheduler, PSM } = await import("tesseract.js");
  // Convert PDF to images with optimized settings
  const imageBuffers = await pdf2img.convert(pdfBuffer, {
    base64: false,
    scale: 2,
    width: 1500, // Set a fixed width for consistency and potential speed improvement
  });

  // Create a scheduler and multiple workers
  const scheduler = createScheduler();
  const workerCount = 3;
  const workers = await Promise.all(
    Array(workerCount)
      .fill(0)
      .map(() =>
        createWorker("eng", 1, {
          workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
        })
      )
  );
  workers.forEach((worker) => scheduler.addWorker(worker));

  // Set parameters for all workers
  await Promise.all(
    workers.map((worker) =>
      worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO_OSD,
        tessjs_create_hocr: "0",
        tessjs_create_tsv: "0",

      })
    )
  );

  // Process images in parallel
  const results = await Promise.all(
    imageBuffers.map((imageBuffer) => scheduler.addJob("recognize", imageBuffer as string))
  );

  // Terminate all workers
  scheduler.terminate();

  return results.map((result) => result.data.text).join("\n");
};

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

    let parsedText = await parsePDF(tempFilePath);

    if (!isReadableText(parsedText)) {
      console.log("Text is unreadable, falling back to OCR");
      parsedText = await fallbackOcrTextExtraction(fileBuffer);
    }

    if (!isReadableText(parsedText)) {
      throw new Error("Failed to process PDF using fallback OCR");
    }

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
