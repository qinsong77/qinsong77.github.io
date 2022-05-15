<template>
  <template v-if="link">
    <a :href="link" target="_blank"  :class="'svg-icon-' + size">
      <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="'#' + icon"></use>
      </svg>
      <span v-if="!!text || slots.default" class="svg-icon-text">
        <slot>{{ text }}</slot>
      </span>
    </a>
  </template>
  <template v-else>
    <a :class="'svg-icon-' + size">
      <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="'#' + icon"></use>
      </svg>
      <span v-if="!!text || slots.default" class="svg-icon-text">
        <slot>{{ text }}</slot>
    </span>
    </a>
  </template>
</template>

<script setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>
<script>
export default {
  name: 'Icon',
  props: {
    icon: {
      default: '',
      type: String
    },
    link: {
      default: '',
      type: String
    },
    text: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'middle'
    }
  },
}
</script>

<style lang="scss">
.svg-icon {
  /* 通过设置 font-size 来改变图标大小 */
  //width: 1.5em;
  //height: 1.5em;
  ///* 图标和文字相邻时，垂直对齐 */
  //vertical-align: -0.35em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  fill: currentColor;
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
     normalize.css 中也包含这行 */
  overflow: hidden;
  font-size: 12px;
  vertical-align: middle;
}
.svg-icon-text {
  @apply ml-1 align-middle;
}
.svg-icon-small {
  @apply text-xs;
  > .svg-icon {
    @apply w-5 h-5
  }
  + .svg-icon-small {
    @apply ml-5;
  }
}
.svg-icon-middle {
  @apply text-base;
  > .svg-icon {
    @apply w-7 h-7
  }
  + .svg-icon-small {
    @apply ml-5;
  }
}
</style>