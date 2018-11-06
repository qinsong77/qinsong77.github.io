<template>
    <div class="recent">
        <blog-top-slider/>
        <blog-article-link-card/>
    </div>
</template>

<script>
    import BlogTopSlider from './components/blog-top-slider'
    import BlogArticleLinkCard from './components/blog-article-link-card'
    export default {
        name: 'recent',
        components: { BlogArticleLinkCard, BlogTopSlider },
        data () {
            return {}
        },
        computed: {},

        created () {
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
