import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import os from "os";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

/*SHARP enhancement*/
const writeToDir = async (
  imageData: Buffer,
  fileName: string,
  filePath: string
) => {
  try {
    await fs.promises.writeFile(filePath, imageData);
    // console.log(`Image processed and saved successfully: ${filePath}`);
    return {
      fileName: fileName,
      filePath: filePath,
    };
  } catch (error) {
    console.error("Error processing the image:", error);
    return null;
  }
};

export const POST = async (request: NextRequest) => {
  const pdf2img = await import("pdf-img-convert");
  const { createWorker, PSM } = await import("tesseract.js");

  const formData: FormData = await request.formData();
  const uploadedFile = formData.get("pdf") as Blob | null;

  if (!uploadedFile || !(uploadedFile instanceof Blob)) {
    return NextResponse.json(
      { error: "No valid PDF file found" },
      { status: 400 }
    );
  }

  const fileName = uuidv4();
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `${Date.now()}_${fileName}.pdf`);
  const convertedImages: any[] = [];

  try {
    const pdfBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const imagePages = await pdf2img.convert(pdfBuffer, {
      base64: true,
      scale: 2,
    }); // Ensure base64 is true to get Base64 data

    for (let i = 0; i < imagePages.length; i++) {
      const imageData = imagePages[i];
      const base64Data = (imageData as string).replace(
        /^data:image\/\w+;base64,/,
        ""
      ); // Remove Base64 header
      const imageBuffer = Buffer.from(base64Data, "base64"); // Convert Base64 to Buffer

      const _fileName = `${path.basename(
        fileName,
        path.extname(fileName)
      )}_page_${i + 1}.png`;
      const filePath = path.join(UPLOAD_DIR, _fileName);

      const writeFile = await writeToDir(imageBuffer, _fileName, filePath);
      if (writeFile) {
        convertedImages.push(writeFile);
      }
    }

    // console.log("🚀 ~ POST ~ convertedImages:", convertedImages);

    // const worker = await createWorker("eng", 1, {
    //   logger: (m) => console.log(m), // Add logger here
    // });

    const worker = await createWorker("eng", 1, {
      workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
    });

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO_OSD,
    });

    const {
      data: { text },
    } = await worker.recognize(convertedImages[0].filePath);
    console.log(text);
    await worker.terminate();

    return NextResponse.json({ text: text });
  } catch (error) {
    console.error("Error processing the image:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
};
