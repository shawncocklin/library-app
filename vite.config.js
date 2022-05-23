import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => ({
  base: '/library-app/',

  build: {
    outDir: 'docs'
  }
  
}));