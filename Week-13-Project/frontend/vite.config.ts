import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    minify: 'terser', // use Terser instead of esbuild
    terserOptions: {
      compress: {
        drop_console: true, // remove all console.*
        drop_debugger: true // remove debugger statements
      } 
    } as any
  }
})
