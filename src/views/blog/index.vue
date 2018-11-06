<template>
    <div class="blog-container">
        <blog-nav :class="{'blog-nav-open':showNav}"/>
        <div class="blog-main-container" :class="{'translateX':showNav}">
            <transition name="slide-up" mode="out-in">
                <router-view/>
            </transition>
        </div>
        <blog-right-box/>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import BlogNav from './components/blog-nav'
    import BlogRightBox from './components/blog-right-box'

    export default {
        name: 'index',
        components: { BlogRightBox, BlogNav },
        data () {
            return {}
        },
        computed: {
            ...mapState({
                showNav: state => state.app.showNav
            })
        },

        created () {
        },

        mounted () {
        },

        methods: {}
    }
</script>

<style lang="scss">
    .blog-container {
        display: flex;
        > .blog-main-container {
            transition: $trans;
            margin-left: 210px;
            width: calc(100% - 420px);
            /*min-height: calc(100vh - 200px);*/
            padding: $container-pd;
            transform: translateX(0);
        }
        > .translateX {
            position: fixed;
            transform: translateX(210px);
        }
    }
</style>
