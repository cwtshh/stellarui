import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Binda a todos os endereços IP
    port: 5173 // Porta padrão do Vite
  }
})
