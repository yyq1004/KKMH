import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  alias: {},
  base: '/',
  publicPath: '/',
  history: {
    type: 'browser',
  },
  access: {},
  model: {},
  dva: {},
  initialState: {},
  proxy: {
    '/api2': {
      target: 'http://localhost:8000/',
      changeOrigin: true,
      pathRewrite: { '^/api2': '' },
    },
    '/api': {
      target: 'https://www.kuaikanmanhua.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },

    },

  },
  request: {
    dataField: 'data',
  },
  routes: [
    { path: "/", component: "home", title: "首页" },
    { path: "/renew", component: "renew", title: "更新" },
    { path: "/rank", component: "rank", title: "排行榜" },
    { path: "/sort", component: "sort", title: "分类" },
    { path: "/chapter", component: "chapter", title: "章节" },
    { path: "/content/:id", component: "content", title: "章节内容" },
    { path: "/me", component: "me", title: "我的" },
    { path: "/book", component: "book", title: "漫画岛" },
    { path: "/search", component: "search", title: "搜索" },
    { path: "/world", component: "world", title: "世界" },
    {path: "/login", component: "login", title: "登录"},
    {path: "/register", component: "register", title: "注册"}
  ],
  npmClient: 'pnpm',
});
