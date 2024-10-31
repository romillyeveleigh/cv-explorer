"use server";

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  let timeStart = Date.now();
  try {
    // @ts-ignore
    await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    await import("path2d");
    const pdf2img = await import("pdf-img-convert");

    // Convert PDF to images with optimized settings
    const imageBuffers = await pdf2img.convert(pdfBuffer, {
      base64: false,
      scale: 1,
      width: 1000, // Set a fixed width for consistency and potential speed improvement
    });

    let timeEnd = Date.now();
    console.log(`PDF to SVG conversion took ${timeEnd - timeStart}ms`);

    return imageBuffers;
  } catch (error) {
    console.error("Error during PDF to SVG conversion: ", error);
    throw error;
  }
};
