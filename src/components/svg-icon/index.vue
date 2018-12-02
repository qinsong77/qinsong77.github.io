<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="icon"></use>
    </svg>
</template>

<script>
    export default {
        name: 'index',
        props: {
            icon: {
                default: '',
                type: String
            }
        }
    }
</script>

<style lang="scss">
    .svg-icon {
        /* 通过设置 font-size 来改变图标大小 */
        width: 1.5em; height: 1.5em;
        /* 图标和文字相邻时，垂直对齐 */
        vertical-align: -0.35em;
        /* 通过设置 color 来改变 SVG 的颜色/fill */
        fill: currentColor;
        /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
           normalize.css 中也包含这行 */
        overflow: hidden;
    }
</style>
