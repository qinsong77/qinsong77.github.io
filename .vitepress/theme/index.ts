// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'
import ReloadPrompt from './components/ReloadPrompt..vue'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'layout-bottom': () => h(ReloadPrompt)
    })
  },
  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // }
}
