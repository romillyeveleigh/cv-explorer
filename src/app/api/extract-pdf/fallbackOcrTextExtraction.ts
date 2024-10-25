"use server";

export const fallbackOcrTextExtraction = async (pdfBuffer: Buffer) => {
  const pdf2img = await import("pdf-img-convert");
  await import("pdfjs-dist");
  const { createWorker, createScheduler, PSM } = await import("tesseract.js");
  // Convert PDF to images with optimized settings
  const imageBuffers = await pdf2img.convert(pdfBuffer, {
    base64: false,
    scale: 2,
    width: 1500, // Set a fixed width for consistency and potential speed improvement
  });

  // Create a scheduler and multiple workers
  const scheduler = createScheduler();
  const workerCount = 3;
  const workers = await Promise.all(
    Array(workerCount)
      .fill(0)
      .map(() =>
        createWorker("eng", 1, {
          workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js",
        })
      )
  );
  workers.forEach((worker) => scheduler.addWorker(worker));

  // Set parameters for all workers
  await Promise.all(
    workers.map((worker) =>
      worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO_OSD,
        tessjs_create_hocr: "0",
        tessjs_create_tsv: "0",

      })
    )
  );

  // Process images in parallel
  const results = await Promise.all(
    imageBuffers.map((imageBuffer) => scheduler.addJob("recognize", imageBuffer as string))
  );

  // Terminate all workers
  scheduler.terminate();

  return results.map((result) => result.data.text).join("\n");
};
