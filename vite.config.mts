import process from 'node:process'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import electron from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    css: {
      preprocessorOptions: {
        sass: {
          silenceDeprecations: ['legacy-js-api'],
          // FIX: 會導致 [sass] Can't find stylesheet to import.，待確認原因
          // api: 'modern-compiler', // or 'modern'
        },
      },
    },
    plugins: [
      VueRouter({
        // 只有 index 或 ] 結尾名稱會變成 route
        filePatterns: ['**/*index', '**/*]'],
      }),
      // VueDevTools(),
      vue({
        template: { transformAssetUrls },
      }),

      quasar(),

      Unocss(),

      electron({
        main: {
          entry: 'electron/main.ts',
          vite: {
            build: {
              rollupOptions: {
                external: [
                  'node-llama-cpp',
                ],
              },
            },
            optimizeDeps: {
              exclude: [
                'node-llama-cpp',
              ],
            },
          },
        },
        preload: {
          input: 'electron/preload.ts',
        },
        renderer: {},
      }),
    ],
    test: {
      environment: 'happy-dom',
      coverage: {
        reporter: ['html'],
      },
    },

  }
})
