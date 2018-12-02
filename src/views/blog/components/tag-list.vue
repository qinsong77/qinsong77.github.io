<template>
    <div class="tags-container">
        <ul>
            <li class="tag-li" v-for="tag in tags" :key="tag.id">
                <a @click="toTagArticle(tag.id)">
                    {{tag.name}}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'tag-list',
        data () {
            return {
            }
        },
        props: {
            tags: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        computed: {},

        mounted () {
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
    .tags-container{
        margin-top: 10px;
        padding: 10px;
        ul>li{
            display: inline-block;
            margin-right: 7px;
            margin-bottom: 10px;
            a{
                display: inline-block;
                background-color: $secondary-bg;
                padding: 7px 10px;
                transition: $trans;
                &:hover{
                    background: $secondary-bg-darken;
                    box-shadow: $box-shadow;
                }
                >i{
                    margin-right: 3px;
                }
            }
        }
    }
</style>
