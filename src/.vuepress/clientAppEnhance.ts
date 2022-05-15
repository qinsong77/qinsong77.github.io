import { defineClientAppEnhance } from '@vuepress/client'
import { registerGlobalComponents } from "./theme/utils";

export default defineClientAppEnhance(({ app, router, siteData }) => {
  // ...
  // console.log(app)
  // console.log(siteData)
  // console.log(router)
  registerGlobalComponents(app);
})