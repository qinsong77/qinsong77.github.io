<template>
  <div class="post-item-container">
    <div class="title">
      <RouterLink :to="data.path">{{ data.title }}</RouterLink>
    </div>
    <div class="abstract" v-html="data.abstract" v-if="!!data.abstract"></div>
    <div class="page-info">
      <Icon icon="icon-advertising" :text="author" size="small"/>
      <Icon icon="icon-time" :text="data.date" size="small"/>
      <Icon icon="icon-folder" size="small">
        {{ data.category }}
      </Icon>
      <Icon icon="icon-tag" size="small">{{ data.tag }}</Icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  setup() {
    return {
      author: 'Sysuke'
    }
  },
})
</script>
<style lang="scss">
.post-item-container {
  @apply mb-8 p-6 rounded shadow-light;
  @apply dark:shadow-dark;
  @apply hover:shadow-light-heavier dark:hover:shadow-dark-heavier;

  .title {
    @apply relative mb-2 inline-block text-lg font-medium;

    &:after {
      @apply absolute left-0 -bottom-2 w-full;

      content: "";
      height: 2px;
      visibility: hidden;
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      transition: 0.3s ease-in-out;
      @apply bg-brand;
    }

    &:hover a {
      @apply text-brand;
    }

    &:hover:after {
      visibility: visible;
      transform: scaleX(1);
    }
  }

  .page-info {
    @apply flex flex-wrap mt-2;
    .icon-container{
      a {
        color: inherit;
        &:hover {
          @apply text-brand;
        }
      }
      a:not(:last-child) {
        @apply mr-2;
      }
      &:not(:last-child) {
        @apply mr-5;
      }
    }
  }
}
</style>