import { kebabCase } from 'lodash-es'
import { filter, isTruthy, join, map, pipe } from 'remeda'
import { defineConfig, presetUno } from 'unocss'

const PREFIX = 'bg|text|border' as const

export default defineConfig({
  theme: {
    colors: {
      primary: '#6AB98B',
      secondary: '#26A69A',
      accent: '#9C27B0',
      dark: '#1D1D1D',
      positive: '#21BA45',
      negative: '#F45252',
      info: '#31CCEC',
      warning: '#F2C037',
    },
  },
  shortcuts: [
    {
      'fit': 'w-full h-full',
      'flex-col': 'flex flex-col',
      'flex-center': 'flex justify-center items-center',
      'border': 'border-solid border-1 border-[#F1F1F1]',
    },
  ],
  rules: [
    [
      new RegExp(`(${PREFIX})-(.*)$`),
      ([prefix, value], { theme }) => {
        const typeCssMap = {
          bg: 'background-color',
          text: 'color',
          border: 'border-color',
        }

        const name = typeCssMap[prefix]

        if (theme.colors?.[value]) {
          return {
            [name]: theme.colors[value],
          }
        }
      },
    ],
  ],
  safelist: [
    /** 相容 quasar color 參數用法，需要事先產生 class
     *
     * https://quasar.dev/style/color-palette#adding-your-own-colors
     * https://unocss.dev/guide/extracting#safelist
     */
    ({ theme }) => {
      const prefixes = PREFIX.split('|')
      const suffixes = Object.keys(theme.colors || {})

      // 組合所有可能的 class
      const combinations = prefixes.flatMap((prefix) =>
        suffixes.map((suffix) => `${prefix}-${kebabCase(suffix)}`),
      )

      return combinations
    },
  ],
  preflights: [
    {
      // 覆蓋 Quasar 預設 color 之 CSS 變數
      getCSS({ theme }) {
        const list = pipe(
          Object.entries(theme.colors || {}),
          map(([key, value]) => {
            if (typeof value === 'string' && value.startsWith('#'))
              return `--q-${kebabCase(key)}: ${value}`
          }),
          filter(isTruthy),
          join(';'),
        )

        return `:root { ${list} }`
      },
    },
  ],
  presets: [
    presetUno(),
  ],
})
