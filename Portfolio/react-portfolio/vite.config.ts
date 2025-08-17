import { defineConfig } from 'vite';

// Minimal Vite config (React works via esbuild + react-jsx tsconfig)
export default defineConfig({
  esbuild: {
    jsx: 'automatic'
  },
  server: { port: 5173 },
  preview: { port: 5173 }
});
