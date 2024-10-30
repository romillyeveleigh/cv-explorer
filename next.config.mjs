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
      "path2d",
    ],
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
    },
  },
};

export default nextConfig;
