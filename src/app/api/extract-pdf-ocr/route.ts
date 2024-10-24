import { NextRequest, NextResponse } from "next/server";

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

  try {
    const pdfBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const imageBuffers = await pdf2img.convert(pdfBuffer, {
      base64: false,
      scale: 2,
    });

    const worker = await createWorker(["eng", "osd"], 1, {
      workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
    });

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO_OSD,
    });

    const textArray = await Promise.all(
      imageBuffers.map(async (imageBuffer) => {
        const {
          data: { text },
        } = await worker.recognize(imageBuffer as string);
        return text;
      })
    );

    await worker.terminate();

    const parsedText = textArray.join("\n");

    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error("Error processing the PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
};
