import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Relative assets work at /Aura-Design-System/ and on custom domains.
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
});
