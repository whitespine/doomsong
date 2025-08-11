import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: "public", // This is the default
  base: "/systems/doomsong/",
  server: {
    port: 30001,
    open: "/",
    proxy: {
      "^(?!/systems/doomsong)": "http://localhost:30000/",
      "/socket.io": {
        target: "ws://localhost:30000",
        ws: true,
      },
    }
  },
  esbuild: { keepNames: true },
  build: {
    outDir: "dist", // This is the default
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "doomsong",
      entry: "src/doomsong.js",
      formats: ["es"],
      fileName: "doomsong"
    }
  },
});