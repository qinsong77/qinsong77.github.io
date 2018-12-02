<template>
    <div class="recent">
        <blog-top-slider :data="articles"/>
        <template v-for="(item,index) in articles">
            <blog-article-link-card :data="item" :key="index"/>
        </template>
    </div>
</template>

<script>
    import BlogTopSlider from './components/blog-top-slider'
    import BlogArticleLinkCard from './components/blog-article-link-card'
    export default {
        name: 'recent',
        components: { BlogArticleLinkCard, BlogTopSlider },
        data () {
            return {
                articles: []
            }
        },
        computed: {},

        created () {
            this.$store.commit('showLoading')
            this.$Axios.get('/article/page/1').then(res => {
                if (res.result) {
                    this.articles = res.content.data
                }
            }).finally(() => { this.$store.commit('hideLoading') })
        },

        mounted () {
        },

        methods: {}
    }
</script>

<style lang="scss">
    .recent{
        width: 100%;
    }
</style>
