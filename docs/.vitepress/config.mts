import { defineConfig } from 'vitepress'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  title: '个人网站',
  description: '我的个人网站',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' },
      { text: '博客', link: '/blog' },
      { text: 'CSS 特效', link: '/effects' }
    ],
    sidebar: {
      '/blog/': [
        {
          text: '博客文章',
          items: [
            { text: '第一篇文章', link: '/blog/post-1' },
            { text: '第二篇文章', link: '/blog/post-2' },
            { text: '第三篇文章', link: '/blog/post-3' }
          ]
        }
      ]
    }
  },
  vite: {
    server: {
      fs: {
        allow: [resolve(__dirname, '..')]
      }
    }
  }
})