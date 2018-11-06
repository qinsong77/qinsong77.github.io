<template>
    <div class="blog-right-box">
        <div class="setting-container">
            <i class="iconfont icon-setting"></i>
            <!--<span class="setting-label">theme：</span>-->
            <switch-btn v-model="checked" style="margin-left: 7px">
                <span slot="left">dark</span>
                <span slot="right">light</span>
            </switch-btn>
        </div>
        <tag-list/>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import SwitchBtn from '_c/switchbtn'
    import TagList from './tag-list'
    export default {
        name: 'blog-right-box',
        components: { TagList, SwitchBtn },
        data () {
            return {
                checked: false
            }
        },
        computed: {
            ...mapState({
                theme: state => state.theme
            })
        },
        watch: {
            checked (oldval, newVal) {
                if (newVal) {
                    this.$store.commit('setTheme', 'theme-default')
                } else {
                    this.$store.commit('setTheme', 'theme-dark')
                }
            }
        },
        methods: {
            ...mapMutations
        }
    }
</script>

<style lang="scss">
    .blog-right-box {
        width: 200px;
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
