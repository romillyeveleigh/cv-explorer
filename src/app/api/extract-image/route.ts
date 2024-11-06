import { NextRequest, NextResponse } from "next/server";
import { File } from "buffer";

import { isReadableText } from "@/app/utils";
import { convertImagesToText } from "./convertImagesToText";

export async function POST(request: NextRequest) {
  let timeStart = Date.now();
  const formData: FormData = await request.formData();
  const imageType = request.headers.get("image-type");
  if (!imageType) {
    return NextResponse.json({ error: "No image type found" }, { status: 400 });
  }
  const uploadedFile = formData.get(imageType) as File | null;

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    return NextResponse.json({ error: "No valid image file found" }, { status: 400 });
  }

  try {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    let parsedText = await convertImagesToText([fileBuffer]);

    if (!isReadableText(parsedText)) {
      throw new Error("Failed to process image using OCR");
    }

    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  } finally {
    console.log(`Total time taken to extract text from image: ${Date.now() - timeStart}ms`);
  }
}
