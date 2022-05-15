<template>
<div class="personal-info-wrapper">
  <img
    class="personal-img"
    :src="avatar"
    alt="author-avatar"
  >
  <p
    class="name"
  >
    Sysuke
  </p>

  <!-- 支持 hover 展示文案、图片 -->
  <ul class="social-links">
    <li
      class="social-item"
      v-for="(item, index) in socialLinks"
      :key="index"
    >
      <icon :icon="item.icon" :link="item.link" />
    </li>
  </ul>
  <hr>
</div>
</template>

<script setup>
import { withBase } from "@vuepress/client";
import { createOneColor } from "../utils";

const avatar = withBase('/images/avatar.jpeg')
const socialLinks = [{
  icon: 'icon-github',
  link: 'https://github.com/qinsong77',
  color: createOneColor()
}]
</script>
<style lang="scss">
.personal-info-wrapper {
  .personal-img {
    @apply block mt-8 mb-4 mx-auto w-24 h-24 rounded-1/2;
  }
  .name {
    @apply text-base text-center font-semibold;
  }
  .social-links {
    @apply box-border flex flex-wrap p-2;
    .social-item {
      @apply text-center list-none transform transition-transform;
      @apply hover:scale-125;
    }
  }
}
</style>
