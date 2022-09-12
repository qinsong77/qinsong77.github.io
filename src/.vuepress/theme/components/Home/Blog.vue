<template>
  <section class="home-blog-content">
    <section class="blog-list">
      <PostList :data="posts" />
    </section>
    <section class="info-wrapper">
      <PersonalInfo />

      <h4 class="module-title">
        <Icon icon="icon-folder" text="Categories" />
      </h4>
      <ul class="category-wrapper">
        <li class="category-item" v-for="(value, key, index) in categories" :key="index">
          <a class="category-link">
            <span class="text">{{ value.label }}</span>
            <span class="num">{{ value.length }}</span>
          </a>
        </li>
      </ul>

      <h4 class="module-title">
        <Icon icon="icon-tag" text="Tags" />
      </h4>
      <ul class="tag-wrapper">
        <li class="tag-item" v-for="tag in tags" :key="tag" :style="{ borderColor: createOneColor() }">
          <a class="tag-link">{{ tag }}</a>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { withBase, usePageFrontmatter } from '@vuepress/client'
import { createOneColor } from '../../utils'
import PostList from '../PostList/index.vue'
import PersonalInfo from '../PersonalInfo.vue'
import Icon from "../global/Icon.vue";

const mdData = usePageFrontmatter();


const posts = mdData.value?.posts?.reverse() || []

const categories = mdData.value?.categories || []

const tags = mdData.value?.tags || []

</script>
<style lang="scss">
.home-blog-content {
  a {
    color: inherit;
  }

  @apply block items-start mx-auto mt-4 mb-16 px-4 max-w-screen-lg;
  @apply md:flex;
  .blog-list {
    @apply flex-auto;
  }

  .info-wrapper {
    @apply sticky top-20 mb-8 p-6 rounded shadow-light;
    @apply md:ml-4;
    @apply hover:shadow-light-heavier dark:hover:shadow-dark-heavier;
    flex: 0 0 300px;

    .module-title {
      @apply mt-4 mb-2 pt-0;
    }

    .category-wrapper {
      @apply list-none pl-0;
      .category-item {
        @apply mb-4 rounded cursor-pointer border-brand border-2 border-solid border;
        .category-link {
          @apply flex justify-between px-4 py-1.5;
          .text {
            @apply mr-1 text-xs leading-5 text-text-light;
          }

          .num {
            @apply inline-block h-5 px-2 bg-brand rounded text-white text-xs leading-5;
          }
        }

        &:hover {
          @apply bg-brand-light;
          .category-link {
            .text {
              @apply text-white;
            }

            .num {
              @apply text-white;
            }
          }
        }
      }
    }

    .tag-wrapper {
      @apply list-none pl-0;
      .tag-item {
        @apply inline-block mr-2 mb-2 rounded cursor-pointer border-2 border-solid;
        .tag-link {
          @apply flex justify-between px-2.5 py-1.5 leading-none text-xs;
        }

        &:hover {
          @apply bg-brand-light text-white;
          .tag-link {
            @apply text-white;
          }
        }
      }
    }
  }

  .pagation-container {
    @apply my-8;
  }
}

/* 兼容 */
.home-blog-content .info-wrapper {
  @apply dark:shadow-dark;
}

.home-blog-content .info-wrapper .category-wrapper .category-item .category-link .text {
  @apply dark:text-text-dark;
}
</style>
