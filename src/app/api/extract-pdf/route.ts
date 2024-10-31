export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { File } from "buffer";
import { isReadableText } from "@/app/utils";
import { fallbackOcrTextExtraction } from "./fallbackOcrTextExtraction";
import parsePDF from "./parsePDF";

export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();
  const uploadedFile = formData.get("pdf") as File | null;

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    return NextResponse.json({ error: "No valid PDF file found" }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    let parsedText = await parsePDF(fileBuffer);
    // console.log("🚀 ~ POST ~ parsedText:", parsedText);

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
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
