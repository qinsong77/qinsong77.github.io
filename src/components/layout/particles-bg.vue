<template>
    <div class="particles-bg" id="particles">
    </div>
</template>

<script>
    import config from './particles-config'
    require('particles.js')
    export default {
        name: 'particles-bg',
        data () {
            return {}
        },
        created () {
        },

        mounted () {
            // eslint-disable-next-line
            particlesJS('particles', config)
        },

        methods: {}
    }
</script>

<style lang="scss">
    .particles-bg{
        position: absolute;
        width: 100%;
        height: 99vh;
        top:0;
        right: 0;
        bottom:0;
        left:0;
        z-index: 0;
        background: transparent;
        opacity: 0.8;
    }
</style>
