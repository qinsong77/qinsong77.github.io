---
title: 常用笔记vue
---

### [大文件上传和断点续传](https://juejin.im/post/6844904046436843527)


#### 自定义指令实现在文本超长缩略时才显示tooltip;render中添加自定义指令写法

```vue
<template>
  <cm-tooltip 
    :content="item.fieldName" 
    :disabled="!showTooltips.includes(item.fieldId)" 
    placement="top-start" 
    transfer 
    max-width="300" 
    theme="dark">
      <span class="field-name" v-addtooltip="item.fieldId">{{ item.fieldName }}</span>
  </cm-tooltip>
</template>
<script>
export default {
  directives: {
    addtooltip: {
      inserted: (el, binding, vnode) => {
        if (el.scrollWidth > el.clientWidth) {
          if (!vnode.context.showTooltips.includes(binding.value)) vnode.context.showTooltips.push(binding.value)
        }
      }
    }
  },
  data () {
    return {
      showTooltips: [],
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.row)
                  }
                },
                directives: [ // render中添加自定义指令写法
                  {
                    name: 'hide-btn'
                  }
                ]
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delete(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
    ] 
    }
  }
}
</script>
<style>
 .field-name {
        display: inline-block;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
</style>
```
