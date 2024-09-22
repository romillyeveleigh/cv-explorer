import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import mammoth from "mammoth";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("word") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file temporarily
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `${Date.now()}_${file.name}`);

    fs.writeFileSync(inputPath, buffer);

    // Convert Word document to text
    const result = await mammoth.extractRawText({ path: inputPath });
    const text = result.value;

    // Clean up temporary file
    fs.unlinkSync(inputPath);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
