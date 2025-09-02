import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';


export default defineConfig({
  base: "/systems/doomsong/",
  root: "src/",
  publicDir: "../public",
  resolve: {
    alias: {
      $assets: './assets'
    }
  },
  server: {
    host: "www.worthy-opponents.com",
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
      let system_json = fs.readFileSync("./system.json", { encoding: 'utf8', flag: 'r' });
      // This only matters if we're not in the ci pipeline
      system_json = system_json.replace("#{VERSION}#", "0.0.0");
      fs.writeFileSync("./dist/system.json", system_json);
    }
  }
}