<template>
    <div id="app" :class="$store.state.app.theme">
        <router-view/>
        <particles-bg/>
    </div>
</template>

<style lang="scss">
    #app {
        position: relative;
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
    }
</style>
<script>
    import ParticlesBg from './components/layout/particles-bg'
    export default {
        components: { ParticlesBg }
    }
</script>
