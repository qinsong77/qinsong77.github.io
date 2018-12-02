<template>
    <div class="app-container">
        <app-header/>
        <main class="app-main-container">
            <transition name="page" mode="out-in">
                <router-view/>
            </transition>
        </main>
        <app-footer/>
        <particles-bg/>
    </div>
</template>

<script>
    import AppHeader from '_c/header'
    import AppFooter from '_c/footer'
    import ParticlesBg from './particles-bg'
    export default {
        name: 'index',
        components: { AppHeader, AppFooter, ParticlesBg }
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
        min-height: 100vh;
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
