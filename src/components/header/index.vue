<template>
    <header class="header">
        <nav class="header-container">
            <div class="header-log">
                <router-link to="/blog">Sysuke</router-link>
            </div>
            <div class="header-menu">
                <ul>
                    <!-- 阻止单击事件继续传播 -->
                    <li class="nav-bar-menu" @click.stop="setShowNav" v-show="showNavByRoute">
                        <span>
                            <icon icon="#icon-menu"/>
                        </span>
                    </li>
                    <li>
                        <router-link to="/blog" title="博客">
                            <icon icon="#icon-mind_map"/>
                            <span>博客</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/demos">
                            <icon icon="#icon-bottle"/>
                            <span>Demos</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/archive">
                            <icon icon="#icon-approval"/>
                            <span>Archive</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/me">
                            <icon icon="#icon-mms"/>
                            <span>Me</span>
                        </router-link>
                    </li>
                    <!--<div class="tabs-ink-bar"></div>-->
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
    export default {
        name: 'index',
        data () {
            return {
                showNavByRoute: true
            }
        },
        watch: {
            '$route' (to, from) {
                if (to.path.indexOf('/blog') !== -1) {
                    this.showNavByRoute = true
                } else {
                    this.showNavByRoute = false
                }
            }
        },
        mounted () {

        },
        methods: {
            setShowNav () {
                this.$store.commit('setShowNav')
            }
        }
    }
</script>

<style lang="scss">
    .header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        height: $header-height;
        line-height: $header-height;
        width: 100%;
        background-color: $container-bg-opacity;
        box-shadow: 0 1px 2px rgba(0,0,0,.1);
        > .header-container {
            @include margin-auto-width;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > .header-log {
                > a {
                    padding-left: 25px;
                    line-height: 1.4;
                    font-size: $font-size-h1;
                    color: $primary-darken;
                    &:hover{
                        background: transparent;
                    }
                }
            }
            > .header-menu {
                .nav-bar-menu{
                    padding: 0 15px;
                    display: none;
                }
                ul {
                    position: relative;
                    display: flex;
                    .router-link-active:before{
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-bottom: 2px solid $primary;
                        transition: 0.2s all linear;
                    }
                    li{
                        height: 100%;
                    }
                    a {
                        position: relative;
                        transition: all 0.3s ease-in-out;
                        display: block;
                        font-size: $font-size-menu;
                        height: 56px;
                        padding: 0 15px;
                        text-decoration: none;
                        cursor: pointer;
                        &:before {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: 100%;
                            width: 0;
                            height: 100%;
                            border-bottom: 2px solid $primary;
                            transition: 0.2s all linear;
                        }
                        &:hover{
                            color: $primary-lighten;
                            &:before{
                                width: 100%;
                                left: 0;
                            }
                            &:hover ~ &::before {
                                left: 0;
                            }
                        }
                        &:active{
                            background: $module-hover-bg;
                        }
                        >span{
                            margin-left: 5px;
                        }
                    }
                }
            }
        }
        /*.tabs-ink-bar {*/
            /*width: 100%;*/
            /*z-index: 1;*/
            /*position: absolute;*/
            /*left: 0;*/
            /*bottom: 1px;*/
            /*box-sizing: border-box;*/
            /*height: 2px;*/
            /*background-color: rgb(24, 144, 255);*/
            /*transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s, width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;*/
        /*}*/
    }
</style>
