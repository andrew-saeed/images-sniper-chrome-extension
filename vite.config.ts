import type { UserConfig } from 'vite'
import { resolve } from 'path'

export default {
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