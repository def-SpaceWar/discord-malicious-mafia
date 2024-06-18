import { PluginOption, defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
    envDir: '../../',
    plugins: [svelte()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
        hmr: {
            clientPort: 443,
        },
    },
})
