import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Svelte options
  extensions: ['.svelte'],
  compilerOptions: {},
  preprocess: [ vitePreprocess() ],
  onwarn: (warning, handler) => {
    if (warning.code.includes("a11y")) return;
    handler(warning)
  },
  // plugin options
  vitePlugin: {
    exclude: [],
    // experimental options
    experimental: {}
  }
};