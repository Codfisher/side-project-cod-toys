/**
 * 專案使用 UnoCSS，保留此檔案是為了讓 VSCode 的 Tailwind CSS IntelliSense 啟用
 *
 * 因為 UnoCSS 的 IntelliSense 排序做得不太好。ლ(・´ｪ`・ლ)
 *
 * 由於兩者的 class 基本上相容，所以可以使用 Tailwind CSS IntelliSense
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '600px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px',
    },
  },
  plugins: [],
}
