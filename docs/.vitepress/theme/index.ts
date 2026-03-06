import DefaultTheme from 'vitepress/theme'
import './style.css'
import './effects.js'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 可以在这里添加自定义全局组件或插件
  }
}