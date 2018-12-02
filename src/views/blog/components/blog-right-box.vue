<template>
    <div class="blog-right-box">
        <div class="setting-container">
            <router-link to="/setting">
                设置 <icon icon="#icon-settings__one"/>
            </router-link>
            <!--<span class="setting-label">theme：</span>-->
            <switch-btn v-model="checked" style="margin-left: 7px">
                <span slot="left">light</span>
                <span slot="right">dark</span>
            </switch-btn>
        </div>
        <tag-list :tags="tags"/>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import SwitchBtn from '_c/switchbtn'
    import TagList from './tag-list'
    export default {
        name: 'blog-right-box',
        components: { TagList, SwitchBtn },
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
        computed: {
            ...mapGetters([
                'checkTheme'
            ]),
            'checked': {
                get () {
                    return this.checkTheme
                },
                set (value) {
                    if (value) {
                        this.setTheme('theme-default')
                    } else {
                        this.setTheme('theme-dark')
                    }
                }
            }
        },
        methods: {
            ...mapMutations([
                'setTheme'
            ])
        }
    }
</script>

<style lang="scss">
    .blog-right-box {
        //width: 200px; 对于flex这行不管用
        flex:0 0 200px;
        height: 100%;
        margin-left: 10px;
        > div {
            background: $container-bg;
        }
        .setting-container{
            padding: 10px;
            display: flex;
            align-items: center;
            >.setting-label{
                margin-left: 5px;
            }
        }
    }
</style>
