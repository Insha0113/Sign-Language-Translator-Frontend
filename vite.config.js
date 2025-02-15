import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: "/Sign-Language-Translator-Frontend/", // 👈 Add this line
});