import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "127.0.0.1",
    port: 4173,
    proxy: {
      "/customer": "http://127.0.0.1",
      "/backoffice": "http://127.0.0.1",
      "/admin": "http://127.0.0.1",
      "/healthz": "http://127.0.0.1"
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          vuetify: ["vuetify"]
        }
      }
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.js",
    server: {
      deps: {
        inline: ["vuetify"]
      }
    }
  }
});
