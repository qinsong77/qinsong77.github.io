<template>
  <div class="post-list-container">
    <PostItem v-for="(item, index) in data" :key="index" :data="item" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import PostItem from './PostItem.vue'

export default defineComponent({
  components: { PostItem },

  props: {
    data: {
      type: Array,
      default: () => [],
    }
  },

  setup(props) {
    // const { data } = toRefs(props)
    return {}
  },
})
</script>
