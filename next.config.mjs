/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "tesseract.js",
      "canvas",
      "pdfjs-dist",
      "pdfjs-dist/legacy/build/pdf.worker.min.js",
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      "pdfjs-dist/legacy/build/pdf.worker.mjs",
      "path2d",
      // "pdf-parse",
      // "fs",
    ],
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
    },
  },
};

export default nextConfig;
