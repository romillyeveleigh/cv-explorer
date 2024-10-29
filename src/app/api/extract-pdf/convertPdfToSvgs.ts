'use server'

export const convertPdfToSvgs = async (pdfBuffer: Buffer) => {
  // await import("pdfjs-dist/build/pdf.worker.min.mjs");
  const pdfjs = await import("pdfjs-dist");
  const pdf2img = await import("pdf-img-convert");

//   pdfjs.GlobalWorkerOptions.workerSrc = await 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js';

  try {
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
