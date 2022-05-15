import plugin from 'tailwindcss/plugin'
import { colors as customColors } from './custom-colors'

export default {
  // 路径必须写，且是项目的root路径和，twailwind配置文件无关
  content: ['./src/.vuepress/**/*.vue'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundOpacity: {
        98: '.98'
      },
      borderRadius: {
        '1/2': '50%',
      },
      borderWidth: {
        6: '6px',
      },
      // boxShadow 不支持嵌套
      boxShadow: {
        light: '0 1px 8px 0 rgba(0, 0, 0, 0.1)',
        'light-heavier': '0 2px 16px 0 rgba(0, 0, 0, 0.2)',
        dark:'0 1px 8px 0 rgba(0, 0, 0, .6)',
        'dark-heavier': '0 2px 16px 0 rgba(0, 0, 0, .7)'
      },
      colors: customColors,
      height: (): Record<string, any> => ({ 'screen-3/5': '60vh' }),
      zIndex: {
        'negative-10': -10
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // plugin(function ({addUtilities, addComponents, e, prefix, config}) {
    //   // Add your custom styles here
    //   addUtilities({
    //     '.hhhhh': {
    //       height: '60vh',
    //     },
    //   })
    // }),
  ],
  // https://tailwindcss.com/docs/upgrade-guide#base-layer-must-be-present
  corePlugins: {
    preflight: false,
  },
}