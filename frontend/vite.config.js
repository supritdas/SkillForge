import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  css: {
    devSourcemap: false,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "skillforge-production-edbd.up.railway.app",
        changeOrigin: true,
      },
    },
  },
});
