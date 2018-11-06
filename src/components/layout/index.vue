<template>
    <div class="app-container">
        <app-header/>
        <main class="app-main-container">
            <router-view/>
        </main>
        <app-footer/>
    </div>
</template>

<script>
    import AppHeader from '_c/header'
    import AppFooter from '_c/footer'

    export default {
        name: 'index',
        components: { AppHeader, AppFooter }
    }
</script>

<style lang="scss">
    .app-container {
        /**{*/
            /*z-index: 1;*/
        /*}*/
        position: relative;
        >div,>main{
            z-index:1;
        }
        padding-top: 56px;
        height: 100vh;
        background: $app-bg;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .app-main-container {
            flex-shrink: 0;
            width: 100%;
            @include margin-auto-width();
            padding: $container-pd;
            box-sizing: border-box;
            //background: $container-bg;
            /*margin-top: 10px;*/
            //box-shadow: $box-shadow;
        }
    }
</style>
