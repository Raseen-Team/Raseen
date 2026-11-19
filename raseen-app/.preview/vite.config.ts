// Preview-only build: client-side app with hash routing, so it can be opened as a static page.
// Not used by Lovable. Run: bunx vite build -c .preview/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

const root = path.resolve(__dirname, "..");

export default defineConfig({
  root: __dirname,
  base: "./",
  publicDir: path.join(root, "public"),
  plugins: [
    {
      name: "relative-public-paths",
      enforce: "pre",
      transform(code, id) {
        if (!id.includes("/src/")) return;
        return code.replaceAll('"/brand/', '"./brand/').replaceAll("`/flow/", "`./flow/");
      },
    },
    tsconfigPaths({ root }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { "@": path.join(root, "src") } },
  build: { outDir: path.join(root, ".preview/dist"), emptyOutDir: true, assetsDir: "assets" },
});
