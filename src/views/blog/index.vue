<template>
    <div class="blog-container">
        <blog-nav :class="{'blog-nav-open':showNav}" :hotList="hotList"/>
        <div class="blog-main-container">
            <loading :visible="Loading"/>
            <transition name="slide-up" mode="out-in">
                <router-view/>
            </transition>
        </div>
        <blog-right-box :tags="tags"/>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import BlogNav from './components/blog-nav'
    import BlogRightBox from './components/blog-right-box'
    import Loading from '_c/loading'
    export default {
        name: 'index',
        components: { BlogRightBox, BlogNav, Loading },
        data () {
            return {
                tags: [],
                hotList: []
            }
        },
        computed: {
            ...mapState({
                showNav: state => state.app.showNav,
                Loading: state => state.app.Loading
            })
        },

        created () {
            this.$Axios.get('/tag/all').then(res => {
                if (res.result) {
                    this.tags = res.content
                }
            })
            this.$Axios.get('/article/queryhotlist').then(res => {
                if (res.result) {
                    this.hotList = res.content
                }
            })
        },

        methods: {}
    }
</script>

<style lang="scss">
    .blog-container {
        display: flex;
        > .blog-main-container {
            position: relative;
            transition: $trans;
            margin-left: 210px;
            width: calc(100% - 420px);
            //min-height: calc(100vh - 200px);
            //padding: $container-pd;
            transform: translateX(0);
        }
        /*> .translateX {*/
            /*position: fixed;*/
            /*transform: translateX(210px);*/
        /*}*/
    }
</style>
