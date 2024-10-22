export const fallbackOcrTextExtraction = async (pdfBuffer: Buffer) => {
  const pdf2img = await import("pdf-img-convert");
  const { createWorker, PSM } = await import("tesseract.js");
  // Convert PDF to images with optimized settings
  const imageBuffers = await pdf2img.convert(pdfBuffer, {
    base64: false,
    scale: 2,
    width: 1500, // Set a fixed width for consistency and potential speed improvement
  });

  // Create a single worker
  const worker = await createWorker("eng", 1, {
    workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
  });

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO_OSD,
    tessjs_create_hocr: "0",
    tessjs_create_tsv: "0",
  });

  // Process images sequentially
  const results = [];
  for (const imageBuffer of imageBuffers) {
    const {
      data: { text },
    } = await worker.recognize(imageBuffer as string);
    results.push(text);
  }

  // Terminate the worker
  await worker.terminate();

  return results.join("\n");
};
