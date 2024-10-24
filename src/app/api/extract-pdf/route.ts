import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import path from "path";
import { File } from "buffer";
import { isReadableText } from "@/app/utils";
import { fallbackOcrTextExtraction } from "./fallbackOcrTextExtraction";

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
