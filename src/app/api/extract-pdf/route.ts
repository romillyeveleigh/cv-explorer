import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execPromise = promisify(exec);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('pdf') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file temporarily
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `${Date.now()}_${file.name}`);
    const outputPath = path.join(tempDir, `${Date.now()}_output.txt`);

    fs.writeFileSync(inputPath, buffer);

    // Run pdftotext command
    await execPromise(`pdftotext "${inputPath}" "${outputPath}"`);

    // Read the output file
    const text = fs.readFileSync(outputPath, 'utf-8');

    // Clean up temporary files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};