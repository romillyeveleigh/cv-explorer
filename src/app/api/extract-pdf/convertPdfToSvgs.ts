"use server";

// import path2d
// import { Path2D } from "path2d";
// console.log("🚀 ~ Path2D:", Path2D)

// @ts-ignore
// import * as pdfworker from "pdfjs-dist/legacy/build/pdf.worker.mjs";
// console.log("🚀 ~ pdfworker:", pdfworker)

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  let timeStart = Date.now();
  try {
    // @ts-ignore
    await import("pdfjs-dist/legacy/build/pdf.worker.mjs");

    await import("path2d");
    // make it global
    // globalThis.Path2D = Path2D as any;

    // console.log("🚀 ~ Path2D:", Path2D)
    const pdf2img = await import("pdf-img-convert");
    // Convert PDF to images with optimized settings
    const imageBuffers = await pdf2img.convert(pdfBuffer, {
      base64: false,
      scale: 2,
      width: 1500, // Set a fixed width for consistency and potential speed improvement
    });

    let timeEnd = Date.now();
    console.log(`PDF to SVG conversion took ${timeEnd - timeStart}ms`);

    return imageBuffers;
  } catch (error) {
    console.error("Error during PDF to SVG conversion: ", error);
    throw error;
  }
};
