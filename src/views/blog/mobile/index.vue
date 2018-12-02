<template>
    <div class="mobile">
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
            this.$Axios.get('/article/query', { dir: '5bee89b844d9040061d0ef32' }).then(res => {
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
