import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const libraryEntry = path.resolve(rootDir, "../build/index.js");

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // Dev loads linked `file:..` as /@fs/.../build/index.js (CJS). Pre-bundle so default export works.
  optimizeDeps: {
    include: ["react-multi-date-picker"],
    needsInterop: ["react-multi-date-picker"],
  },
  build: {
    commonjsOptions: {
      // Linked `file:..` resolves to `../build/index.js` outside node_modules; include it for CJS interop.
      include: [/node_modules/, libraryEntry],
      requireReturnsDefault: "auto",
    },
  },
});
