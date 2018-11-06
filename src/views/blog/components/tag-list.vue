<template>
    <div class="tags-container">
        <ul>
            <li class="tag-li">
                <a><i class="iconfont icon-chrome"></i>Chrome</a>
            </li>
            <li class="tag-li">
                <a><i class="iconfont icon-code"></i>Code</a>
            </li>
            <li class="tag-li">
                <a><i class="iconfont icon-star"></i>Star</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'tag-list',
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
                padding: 5px 10px 5px 3px;
                transition: $trans;
                &:hover{
                    background: $secondary-bg-darken;
                }
                >i{
                    margin-right: 3px;
                }
            }
        }
    }
</style>
