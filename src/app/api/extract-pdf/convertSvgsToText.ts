import { createWorker, createScheduler, PSM } from "tesseract.js";

export const convertSvgsToText = async (imageBuffers: string[] | Uint8Array[]) => {
  let timeStart = Date.now();
  try {
    // Reduce worker count to minimize resource usage
    const workerCount = 2;
    const TIMEOUT_MS = 60000; // 60 second timeout

    const scheduler = createScheduler();
    const workers = await Promise.all(
      Array(workerCount)
        .fill(0)
        .map(() =>
          createWorker(
            ["eng", "osd"],
            1 // OCR Engine Mode: Tesseract only
          )
        )
    );
    workers.forEach((worker) => scheduler.addWorker(worker));

    // Set parameters for better speed/accuracy balance
    await Promise.all(
      workers.map((worker) =>
        worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO_OSD, // Changed from AUTO_OSD for faster processing
          tessjs_create_hocr: "0", // don't create hocr in the response
          tessjs_create_tsv: "0", // don't create tsv in the response
          log_level: 0,
        })
      )
    );

    // Process images with timeout
    const results = await Promise.race([
      Promise.all(
        imageBuffers.map((imageBuffer, index) => {
          const result = scheduler.addJob("recognize", imageBuffer as string).then((result) => {
            // log the time it took to process the image
            console.log(`OCR processing took ${Date.now() - timeStart}ms for image ${index}`);
            return result;
          });
          return result;
        })
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("OCR processing timeout")), TIMEOUT_MS)
      ),
    ]);

    // Cleanup
    await scheduler.terminate();

    let timeEnd = Date.now();
    // console.log(`OCR processing took ${timeEnd - timeStart}ms`);

    // @ts-ignore
    return results.map((result) => result.data.text).join("\n");
  } catch (error) {
    console.error("Error during OCR text extraction:", error);
    // @ts-ignore
    await scheduler?.terminate().catch(() => {}); // Ensure cleanup on error
    throw error;
  }
};
