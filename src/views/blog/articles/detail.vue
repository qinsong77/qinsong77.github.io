<template>
    <div class="article">
        <p class="title">{{article.title}}</p>
        <p class="banner-img">
            <img :src="article.imgUrl">
        </p>
        <div class="markdown-body" ref="content" id="content" v-html="compiledMarkdown">

        </div>
        <div class="div-divider">
        </div>

        <div class="meta" v-show="!$store.state.app.Loading">
            <p class="item">文章来源：{{article.origin}}</p>
            <p class="item">
                本文发表于{{article.createdAt}}
                <span style="margin-left: 10px">发布在{{article.dirs ? article.dirs[0].name : ''}}分类下，以被围观{{article.viewCount}}次</span>
            </p>
            <p class="item">相关标签：
                <a v-for="item in article.tags" :key="item.id" @click="toTagArticle(item.id)">{{item.name}}</a>
            </p>
        </div>
        <div class="div-divider">
        </div>
        <!--<comment/>-->
        </div>
</template>

<script>
    // import comment from '../components/comment'
    import marked from 'marked'
    import Prism from 'prismjs'
    import 'prismjs/themes/prism.css'
    import 'prismjs/plugins/line-numbers/prism-line-numbers'
    import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
    import 'github-markdown-css/github-markdown.css'
    // import '../../../utils/line-number-plugins'
    export default {
        name: 'detail',
        // components: { comment },
        data () {
            return {
                article: {}
            }
        },
        computed: {
            compiledMarkdown () {
                return marked(this.article.content || '', {
                    // sanitize: true
                })
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to)
                this.$store.commit('showLoading')
                this.$Axios.get(`/article/${this.$route.params.id}`).then(res => {
                    this.article = res.content
                }).finally(() => { this.$store.commit('hideLoading') })
            }
        },
        created () {
            this.$store.commit('showLoading')
            this.$Axios.get(`/article/${this.$route.params.id}`).then(res => {
                this.article = res.content
            }).finally(() => { this.$store.commit('hideLoading') })
        },

        mounted () {
            console.log(Prism.languages)
            marked.setOptions({
                renderer: new marked.Renderer(),
                breaks: true,
                gfm: true,
                headerIds: true,
                tables: true,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                highlight: (code, language) => {
                    if (language === 'sass' || language === 'less'){
                        language = 'css'
                    }
                    return Prism.highlight(code, Prism.languages[language])
                }
            })
        },

        methods: {
            toTagArticle (id) {
                if (id) {
                    this.$router.push({
                        name: 'tag',
                        params: {
                            id: id
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .article{
        background: $container-bg;
        padding: $container-pd;
        .markdown-body{
            overflow-x: auto;
            padding: 10px 15px;
            margin: 10px 0 20px  0;
            color: $text;
        }
        .title{
            font-size: $font-size-h3;
            text-align: center;
            padding: 20px 0;
        }
        .banner-img{
            padding: 10px 15px;
            text-align: center;
            img{
                max-height: 25vh;
                max-width: 100%;
            }
        }
        .div-divider{
            height: 15px;
            width: 105%;
            background-color: $app-bg;
            margin-left: -10px;
            overflow: hidden;
        }
        .meta{
            letter-spacing: 1px;
            padding: 10px;
            .item{
                padding: 3px 10px;
                margin-bottom: 10px;
                border-left: $app-bg 6px solid;
                a{
                    margin-right: 7px;
                    &:hover{
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>
