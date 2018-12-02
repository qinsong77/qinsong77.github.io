<template>
    <div class="background">
        <template v-for="(item,index) in articles">
            <blog-article-link-card :data="item" :key="index"/>
        </template>
    </div>
</template>

<script>
    import BlogArticleLinkCard from '../components/blog-article-link-card'
    export default {
        name: 'background',
        components: { BlogArticleLinkCard },
        data () {
            return {
                articles: []
            }
        },
        computed: {},
        created () {
            this.$store.commit('showLoading')
            this.$Axios.get('/article/query', { dir: '5bf67228303f39005ea3435f' }).then(res => {
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
    .background{

    }
</style>
