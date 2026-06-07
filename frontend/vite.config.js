import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react()],
  server: {
    https: isProduction ? false : {
      key: fs.readFileSync("../backend/certs/key.pem"),
      cert: fs.readFileSync("../backend/certs/cert.pem"),
    },
    proxy: {
      "/api": {
        target: "https://localhost:3000",
        changeOrigin: true,
        secure: false,
      }
    }
  }
});