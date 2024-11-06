import { NextRequest, NextResponse } from "next/server";
import { File } from "buffer";

import { isReadableText } from "@/app/utils";
import { ocrTextExtraction } from "./ocrTextExtraction";

export async function POST(request: NextRequest) {
  let timeStart = Date.now();
  const formData: FormData = await request.formData();
  const uploadedFile = formData.get("jpg") as File | null;

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    return NextResponse.json({ error: "No valid PDF file found" }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    let parsedText = await ocrTextExtraction(fileBuffer);

    if (!isReadableText(parsedText)) {
      throw new Error("Failed to process image using OCR");
    }

    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  } finally {
    console.log(`Total time taken: ${Date.now() - timeStart}ms`);
  }
}
