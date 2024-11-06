import { NextRequest, NextResponse } from "next/server";
import { File } from "buffer";

import { isReadableText } from "@/app/utils";
import { parsePdf } from "./parsePDF";

export async function POST(request: NextRequest) {
  let timeStart = Date.now();
  const formData: FormData = await request.formData();
  const uploadedFile = formData.get("pdf") as File | null;

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    return NextResponse.json({ error: "No valid PDF file found" }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    let parsedText = await parsePdf(fileBuffer);

    if (!isReadableText(parsedText)) {
      console.log("Text is unreadable");
      throw new Error("Text is unreadable");
    }

    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error("Failed to process PDF:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  } finally {
    console.log(`Total time taken to extract text from PDF: ${Date.now() - timeStart}ms`);
  }
}
