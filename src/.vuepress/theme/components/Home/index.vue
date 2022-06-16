<script setup>
import { withBase, usePageFrontmatter } from '@vuepress/client'
import Blog from "./Blog.vue";
import { onMounted, onUnmounted, onUpdated, reactive, ref } from "vue";

const frontmatter = usePageFrontmatter()

// const bannerImage = withBase('/images/home_banner.jpeg')
const background = ref(`url(${withBase(frontmatter && frontmatter?.value?.banner?.bg || '/images/bg2.jpeg')}) center/cover no-repeat`)

// const icons = reactive([])
// onMounted(() => {
//   setTimeout(() => {
//     Array.from(document.querySelectorAll("symbol[id^=icon-]")).map(item => icons.push(item?.id))
//   }, 1000)
// })

onUpdated(() => {
  // const header = document.getElementsByClassName('navbar')[0];
  // console.log(window.getComputedStyle(header).backgroundColor)
  // header && (header.style.backgroundColor = 'rgba(var(--c-bg-navbar), 0.6)')
})
onUnmounted(() => {
  // const header = document.getElementsByClassName('navbar')[0];
  // header && (header.style.backgroundColor = 'var(--c-bg-navbar)')
})
</script>
<template>
  <main class="home-wrapper">
    <!-- banner -->
    <section class="banner-wrapper" :style="{background: background }">
      <div class="banner-content">
        <!--        <img :src="bannerImage" alt="banner image"-->
        <!--        />-->
        <h1 v-if="frontmatter?.banner?.h1">{{ frontmatter?.banner?.h1 }}</h1>
        <p v-if="frontmatter?.banner?.p">{{ frontmatter?.banner?.p }}</p>
      </div>
    </section>
    <Blog />
<!--    <Icon v-for="item in icons" :key="item" :icon="item" />-->
    <div class="previous-content">
      <Content />
    </div>
  </main>
</template>

<style lang="scss">
.dark {
  .banner-wrapper {
    filter: invert(110%) hue-rotate(180deg);
    opacity: .8;
  }
}
.home-wrapper {
  .banner-wrapper {
    @apply w-screen h-screen-3/5 flex justify-center items-center overflow-hidden;
    .banner-content {
      img {
        @apply block mx-auto w-32 sm:w-40 md:w-60 mb-16;
      }

      h1 {
        @apply text-center mb-6 text-cyan-50;
      }

      p {
        @apply text-center italic text-cyan-50;
      }
    }
  }

  .previous-content {
    @apply block items-start mx-auto mt-4 mb-16 px-4 max-w-screen-lg;
  }
}
</style>