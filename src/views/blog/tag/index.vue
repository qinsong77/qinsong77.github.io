<template>
    <div class="recent">
        <template v-for="(item,index) in articles">
            <blog-article-link-card :data="item" :key="index"/>
        </template>
    </div>
</template>

<script>
    import BlogArticleLinkCard from '../components/blog-article-link-card'
    export default {
        name: 'tag',
        components: { BlogArticleLinkCard },
        data () {
            return {
                articles: []
            }
        },
        computed: {},
        watch: {
            '$route' (to, from) {
                console.log(to)
                this.$store.commit('showLoading')
                this.$Axios.get('/article/query', { tag: to.params.id }).then(res => {
                    if (res.result) {
                        this.articles = res.content.data
                    }
                }).finally(() => { this.$store.commit('hideLoading') })
            }
        },
        created () {
            this.$store.commit('showLoading')
            this.$Axios.get('/article/query', { tag: this.$route.params.id }).then(res => {
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
