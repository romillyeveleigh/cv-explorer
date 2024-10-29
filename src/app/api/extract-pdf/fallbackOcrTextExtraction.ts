"use server";

export const fallbackOcrTextExtraction = async (pdfBuffer: Buffer) => {
  const pdf2img = await import("pdf-img-convert");
  const { createWorker, PSM } = await import("tesseract.js");

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

  return parsedText;
};
