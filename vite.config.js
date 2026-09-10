import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/Birthday/" : "/",
  server: {
    port: 5173,
    open: true,
  },
}));
