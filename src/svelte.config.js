import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Svelte options
  extensions: ['.svelte'],
  compilerOptions: {},
  preprocess: [ vitePreprocess() ],
  onwarn: (warning, handler) => handler(warning),
  // plugin options
  vitePlugin: {
    exclude: [],
    // experimental options
    experimental: {}
  }
};