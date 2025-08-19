import { defineConfig } from 'vite';
import { replaceInFileSync } from 'replace-in-file'
import { svelte } from '@sveltejs/vite-plugin-svelte';


export default defineConfig({
  base: "/systems/doomsong/",
  root: "src/",
  publicDir: "../public", 
  server: {
    port: 20001,
    open: "/",
    proxy: {
      "^(?!/systems/doomsong)": "http://localhost:20000",
      "/socket.io": {
        target: "ws://localhost:20000",
        ws: true,
      },
    }
  },
  esbuild: { keepNames: true },
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "system",
      entry: "system.mjs",
      formats: ["es"],
      fileName: "system"
    }
  },
  plugins: [
    fixSystemJson(),
    svelte()
  ]
});

// Handles not release versions
function fixSystemJson() {
  return {
    name: 'fix-system-json',

    buildEnd(options) {
      const fs = require('fs');
      fs.mkdirSync("dist", { recursive: true })
      const replace_options = {
        files: 'system.json',
        from: "#{VERSION}#",
        getTargetFile: src => `dist/${src}`,
        to: '0.0.0',
      };
    }
  }
}