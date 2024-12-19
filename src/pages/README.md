# unplugin-vue-router

此範例使用 unplugin-vue-router，同 Nuxt Page Route 一樣，可以自動生成 Vue Router 的路由設定。

詳細說明請看[文件](https://uvr.esm.is/introduction.html)

## 注意事項

目前設計為只有檔名為 index 或 ] 結尾的元件才會變成頁面（route），其他元件作為頁面的私有元件。

例：

- `src\pages\page\page-card.vue` 不會產生路由。
- `src\pages\page\index.vue` 產生 `/page` 路由。
- `src\pages\page\sub-page.index.vue` 產生 `/page/sub-page` 路由。
