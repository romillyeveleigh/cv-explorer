/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Ensure the optimization object exists
      config.optimization = config.optimization || {};
      
      // Ensure the splitChunks object exists
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      
      // Ensure the cacheGroups object exists
      config.optimization.splitChunks.cacheGroups = config.optimization.splitChunks.cacheGroups || {};
  
      // Now add the pdfWorker to cacheGroups
      config.optimization.splitChunks.cacheGroups.pdfWorker = {
        name: "pdf-worker",
        test: /pdf\.worker\.mjs$/,
        chunks: "all",
        priority: 30,
        enforce: true,
      };
  
      // Allow .mjs files to be imported
      config.resolve = config.resolve || {};
      config.resolve.extensionAlias = {
        '.js': ['.js', '.ts', '.tsx', '.mjs'],
      };
  
      return config;
    },
  };

export default nextConfig;
