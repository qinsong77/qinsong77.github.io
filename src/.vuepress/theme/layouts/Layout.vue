<script setup>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import '../iconfont'
</script>

<template>
  <ParentLayout>
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