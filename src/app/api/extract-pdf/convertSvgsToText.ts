"use server";

export const convertSvgsToText = async (imageBuffers: string[] | Uint8Array[]) => {

  try {
    const { createWorker, createScheduler, PSM } = await import("tesseract.js");

  // get worker path
  // const workerPath = require.resolve("tesseract.js/src/worker-script/node/index.js"); 
  // console.log("🚀 ~ convertSvgsToText ~ workerPath:", workerPath)


  // Create a scheduler and multiple workers
  const scheduler = createScheduler();
  const workerCount = 3;
  const workers = await Promise.all(
    Array(workerCount)
      .fill(0)
      .map(() =>
        createWorker()
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
  } catch (error) {
    console.error("Error during OCR text extraction:", error);
    throw error;
  }
};
