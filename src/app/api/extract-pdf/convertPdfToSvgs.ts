"use server";

import pdfjs from "pdfjs-dist";
console.log("🚀 ~ pdfjs:", pdfjs.version);

// Add proper polyfill for Promise.withResolvers
    if (!Promise.withResolvers) {
      console.log("Adding Promise.withResolvers polyfill");
      Promise.withResolvers = function <T>() {
        let resolve!: (value: T | PromiseLike<T>) => void;
        let reject!: (reason?: any) => void;
        const promise = new Promise<T>((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      };
    }

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  try {
    await import("pdfjs-dist");
    const pdf2img = await import("pdf-img-convert");
    // Convert PDF to images with optimized settings
    const imageBuffers = await pdf2img.convert(pdfBuffer, {
      base64: false,
      scale: 2,
      width: 1500, // Set a fixed width for consistency and potential speed improvement
    });

    return imageBuffers;
  } catch (error) {
    console.error("Error during PDF to SVG conversion:", error);
    throw error;
  }
};
