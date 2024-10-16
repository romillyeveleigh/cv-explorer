import { NextRequest, NextResponse } from 'next/server'; // To handle the request and response
import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename
import PDFParser from 'pdf2json'; // To parse the pdf
import os from 'os';
import path from 'path';

export async function POST(request: NextRequest) {
  const formData: FormData = await request.formData();
  // const uploadedFiles = formData.getAll('pdf');
  let fileName = '';
  let parsedText = '';
  const _uploadedFile: File | null = formData.get('pdf') as unknown as File;

  if (_uploadedFile) {
    const uploadedFile = _uploadedFile;
    console.log('Uploaded file:', uploadedFile);

    // Check if uploadedFile is of type File
    if (uploadedFile instanceof File) {
      // Generate a unique filename
      fileName = uuidv4();

      // Convert the uploaded file into a temporary file
      // const tempFilePath = `/tmp/${fileName}.pdf`;
      const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}_${fileName}`);

      // Convert ArrayBuffer to Buffer
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

      // Save the buffer as a file
      await fs.writeFile(tempFilePath, fileBuffer);

      // Parse the pdf using pdf2json. See pdf2json docs for more info.

      // The reason I am bypassing type checks is because
      // the default type definitions for pdf2json in the npm install
      // do not allow for any constructor arguments.
      // You can either modify the type definitions or bypass the type checks.
      // I chose to bypass the type checks.
      const pdfParser = new (PDFParser as any)(null, 1);

      // See pdf2json docs for more info on how the below works.
      pdfParser.on('pdfParser_dataError', (errData: any) =>
        console.log(errData.parserError)
      );

      pdfParser.on('pdfParser_dataReady', () => {
        // console.log((pdfParser as any).getRawTextContent());
        parsedText = (pdfParser as any).getRawTextContent();
        console.log('parsedText 1', parsedText);
      });

      await pdfParser.loadPDF(tempFilePath).then((data: any) => {
        console.log('PDF loaded', data);
        console.log('parsedText 2', parsedText);
      });
    } else {
      console.log('Uploaded file is not in the expected format.');
    }
  } else {
    console.log('No files found.');
  }

  console.log('Parsed text 3:', parsedText);

  while (!parsedText) {
    console.log('Parsed text 4:', parsedText);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return NextResponse.json({ text: parsedText });

  // const response = new NextResponse(parsedText);
  // response.headers.set('FileName', fileName);
  // return response;
}