import type { UserConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default {
    plugins: [vue()],
    server: {
        port: 4200
    },
    build: {
        rollupOptions: {
            input: {
                sidePanel: resolve(__dirname, 'sidePanel/index.html'),
            }
        }
    }
} satisfies UserConfig