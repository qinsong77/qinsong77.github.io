<script setup>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import { usePageFrontmatter } from "@vuepress/client";

const frontmatter = usePageFrontmatter()
</script>

<template>
  <ParentLayout>
    <template #page-top>
      <div class="theme-default-content">
        <h1 style="padding-bottom: 0; margin-bottom: 0"> {{ frontmatter.title }}</h1>
      </div>
    </template>
    <template #page-bottom>
      <div class="my-footer">Life is hard, but still have to move on</div>
    </template>
  </ParentLayout>
</template>

<style lang="css">
.my-footer {
  text-align: center;
  font-size: 14px;
}
</style>