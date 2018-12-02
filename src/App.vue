<template>
    <div id="app" :class="$store.state.app.theme">
        <router-view/>
    </div>
</template>

<style lang="scss">
    #app {
        min-height: 100%;
        background: $app-bg;
        color: $text;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        font-family: DINRegular, -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "微软雅黑", sans-serif;;
    }
    .router-link-active{
        color: $link-active-color;
        >.iconfont{
            color: $primary-darken;
        }
    }
</style>
<script>
    export default {
        name: 'app'
    }
</script>
