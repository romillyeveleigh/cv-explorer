"use server";
export const maxDuration = 30;

import { createWorker, createScheduler, PSM } from "tesseract.js";

export const convertSvgsToText = async (imageBuffers: string[] | Uint8Array[]) => {
  try {
    // Reduce worker count to minimize resource usage
    const workerCount = 2;
    const TIMEOUT_MS = 25000; // 25 second timeout

    const scheduler = createScheduler();
    const workers = await Promise.all(
      Array(workerCount).fill(0).map(() => createWorker("eng", 1))
    );
    workers.forEach((worker) => scheduler.addWorker(worker));

    // Set parameters for better speed/accuracy balance
    await Promise.all(
      workers.map((worker) =>
        worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO,  // Changed from AUTO_OSD for faster processing
          tessjs_create_hocr: "0",
          tessjs_create_tsv: "0",
          tessedit_ocr_engine_mode: 3,  // Speed optimized mode
        })
      )
    );

    // Process images with timeout
    const results = await Promise.race([
      Promise.all(
        imageBuffers.map((imageBuffer) => 
          scheduler.addJob("recognize", imageBuffer as string)
        )
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("OCR processing timeout")), TIMEOUT_MS)
      )
    ]);
    console.log("🚀 ~ convertSvgsToText ~ results:", results)

    // Cleanup
    await scheduler.terminate();

    // @ts-ignore
    return results.map((result) => result.data.text).join("\n");
  } catch (error) {
    console.error("Error during OCR text extraction:", error);
    // @ts-ignore
    await scheduler?.terminate().catch(() => {}); // Ensure cleanup on error
    throw error;
  }
};
