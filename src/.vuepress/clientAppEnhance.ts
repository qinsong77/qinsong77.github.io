import { defineClientAppEnhance } from '@vuepress/client'
import { registerGlobalComponents } from "./theme/utils";
import { withBase } from "@vuepress/client";

export default defineClientAppEnhance(({ app, router, siteData }) => {
  // ...
  // console.log(app)
  // console.log(siteData)
  // console.log(router)
  registerGlobalComponents(app);
  // @ts-ignore
  if (!__VUEPRESS_SSR__) {
    // @ts-ignore
    import('./theme/iconfont.js')
  }

})