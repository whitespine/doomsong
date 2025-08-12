import { defineConfig } from 'vite';
import { replaceInFileSync } from 'replace-in-file'


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
      name: "system",
      entry: "src/system.js",
      formats: ["es"],
      fileName: "system"
    }
  },
  plugins: [fixSystemJson()]
});

// Handles not release versions
function fixSystemJson() {
  return {
    name: 'fix-system-json',

    buildEnd(options) {
      const replace_options = {
        files: 'dist/system.json',
        from: "#{VERSION}#",
        to: '0.0.0',
      };

      replaceInFileSync(replace_options);
    }
  }
}