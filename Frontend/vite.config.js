import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// npm run dev                 # localhost
// npx vite --mode remote      # dev.vanfossi.com

export default defineConfig(({ mode }) => {
  const remote = mode === 'remote'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      ...(remote && {
        allowedHosts: ['dev.vanfossi.com'],
        hmr: { host: 'dev.vanfossi.com', protocol: 'wss', clientPort: 443 },
      }),
      proxy: {
        '/api': {
          target: 'https://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'https://127.0.0.1:3000',
          ws: true,
          secure: false,
        },
        '/quiz-images': {
          target: 'https://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: 'https://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})