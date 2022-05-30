import type { Theme, DefaultThemeOptions } from 'vuepress'
import { defaultTheme } from 'vuepress'
import { path } from '@vuepress/utils'

export const localTheme = (options: DefaultThemeOptions): Theme => {
  return {
    name: 'vuepress-theme-local',
    extends: defaultTheme(options),
    layouts: {
      Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
      BlogLayout: path.resolve(__dirname, 'layouts/BlogLayout.vue'),
    },
    alias: {
      '@theme/Home.vue': path.resolve(__dirname, './components/Home/index.vue'),
    },
    extendsBundlerOptions: (bundlerOptions, app) => {
      // console.log(bundlerOptions);
      // console.log(app);
      // bundlerOptions.vuePluginOptions
    }
  }
}