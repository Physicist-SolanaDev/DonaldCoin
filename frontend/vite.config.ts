// WSL USERS ON WINDOWS ONLY (NOT NECESSARY FOR LINUX/MACOS)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      process: "process/"
    },
  }, 

  build: {
    rollupOptions: {
      output: {
        // Specify the name of the output file
        entryFileNames: 'bundle.js',  // Change this to your desired file name
        format: 'iife',           // Choose the module format (iife, umd, etc.)
      },
    },
  },
});