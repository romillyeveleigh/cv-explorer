"use server";

import sharp from "sharp";

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  let timeStart = Date.now();
  try {
    // @ts-ignore
    await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    await import("path2d");
    const pdf2img = await import("pdf-img-convert");

    // Convert PDF to images with optimized settings
    const imageBuffers: string[] | Uint8Array[] = await pdf2img.convert(pdfBuffer, {
      base64: false,
      scale: 1,
      width: 1000, // Set a fixed width for consistency and potential speed improvement
    });

    // Process each image buffer with Sharp
    const processedBuffers = await Promise.all(
      imageBuffers.map((buffer: string | Uint8Array) =>
        sharp(buffer)
          .grayscale()
          .normalise() // Enhance contrast
          .sharpen()
          // .removeNoise() // Reduce noise
          .toBuffer()
      )
    );

    let timeEnd = Date.now();
    console.log(`PDF to SVG conversion took ${timeEnd - timeStart}ms`);

    return processedBuffers;
  } catch (error) {
    console.error("Error during PDF to SVG conversion: ", error);
    throw error;
  }
};
