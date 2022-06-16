<script setup>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import { Icon } from "../components/global";
import { usePageFrontmatter } from "@vuepress/client";

const frontmatter = usePageFrontmatter()
const clickToggleNavButton = () => {
  const navMenu = document.getElementsByClassName('table-of-contents')[0]
  if (navMenu) {
    navMenu.classList.toggle('table-of-contents-fixed')
  }
}
</script>

<template>
  <ParentLayout>
    <template #page-top>
      <div class="theme-default-content">
        <h1 style="padding-bottom: 0; margin-bottom: 0"> {{ frontmatter.title }}</h1>
      </div>
    </template>
    <template #page-bottom>

      <Icon icon="icon-menu" class="toggle-nav-button" title="toggle nav" aria-expanded="false" role="button" tabindex="0" @click="clickToggleNavButton"/>
      <div class="my-footer">Life is hard, but still have to move on</div>
    </template>
  </ParentLayout>
</template>

<style lang="scss">
.my-footer {
  text-align: center;
  font-size: 14px;
}
.toggle-nav-button {
  display: none;
  &:hover {
    cursor: pointer;
  }
  position: fixed;
  bottom: 4rem;
  right: 2.5rem;
  svg {
    fill: var(--back-to-top-color);
  }
}
@media only screen and (max-width: 1170px)  {
  .toggle-nav-button {
    display: block;
  }
}
.table-of-contents-fixed {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  position: fixed!important;
  bottom: 100px!important;
  right: 10px!important;
  font-size: 12px!important;
  z-index: 9999;
  > ul {
    list-style: none;
    padding: 10px;
    background: white;
  }
}
</style>