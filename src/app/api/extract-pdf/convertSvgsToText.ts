"use server";

export const convertSvgsToText = async (imageBuffers: string[] | Uint8Array[]) => {
  const { createWorker, createScheduler, PSM } = await import("tesseract.js");

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
