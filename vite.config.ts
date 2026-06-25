import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = caminho do repositório no GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/admin-dashboard/',
});
