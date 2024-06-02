import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait(),
    VitePWA({
      manifest: {
        name: "Roarer",
        short_name: "Roarer",
        description: "A simple Meower client.",
        icons: [
          {
            src: "./bear.svg",
            sizes: "any",
          },
        ],
      },
    }),
  ],
  base: "/roarer-2",
});
