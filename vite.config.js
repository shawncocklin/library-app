import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => ({
  base: '/library-app/',

  build: {
    outDir: 'docs'
  }
  
}));