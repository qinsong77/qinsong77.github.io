<template>
    <div class="blog-nav">
        <ul class="nav-menu">
            <li>
                <router-link to="/blog/recent">
                    <icon icon="#icon-clapperboard"/>
                    <span>最近更新</span>
                </router-link>
            </li>
            <li>
                <router-link to="/blog/frontend">
                    <icon icon="#icon-folder"/>
                    <span>前端笔记</span>
                </router-link>
            </li>
            <li>
                <router-link to="/blog/mobile">
                    <icon icon="#icon-two_smartphones"/>
                    <span>移动端</span>
                </router-link>
            </li>
            <li>
                <router-link to="/blog/background">
                    <icon icon="#icon-data_configuration"/>
                    <span>后台壁垒</span>
                </router-link>
            </li>
            <li>
                <router-link to="/blog/notebook">
                    <icon icon="#icon-snow"/>
                    <span>心情日记</span>
                </router-link>
            </li>
        </ul>
        <div class="input-container">
            <input v-model="search" required placeholder="search me"/>
            <button class="search-btn">
                <icon icon="#icon-search1"/>
            </button>
        </div>
        <search-top-list :hotList="hotList"/>
    </div>
</template>

<script>
    import SearchTopList from './search-top-list'

    export default {
        name: 'blog-nav',
        components: { SearchTopList },
        data () {
            return {
                search: ''
            }
        },
        props: ['hotList'],
        computed: {},

        created () {
        },

        mounted () {
            let that = this
            // eslint-disable-next-line
            let menuButton = document.querySelector('.nav-bar-menu')
            let sidebar = document.querySelector('.blog-nav')
            // menuButton.addEventListener('click', function (e) {
            //     that.$store.commit('setShowNav')
            // })
            document.body.addEventListener('click', function (e) {
                if (!sidebar.contains(e.target)) { // 侧边栏外的区域点击隐藏侧边栏 e.target !== menuButton && 去除,menuButton 添加了@click.stop 阻止单击事件继续传播
                    that.$store.commit('closeNav')
                }
            })
            // Toggle sidebar on swipe
            let start = {}
            let end = {}

            document.body.addEventListener('touchstart', function (e) {
                start.x = e.changedTouches[0].clientX
                start.y = e.changedTouches[0].clientY
            })

            document.body.addEventListener('touchend', function (e) {
                end.y = e.changedTouches[0].clientY
                end.x = e.changedTouches[0].clientX

                let xDiff = end.x - start.x
                let yDiff = end.y - start.y

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if (xDiff > 0 && start.x <= 80) that.$store.commit('showNav')
                    else that.$store.commit('closeNav')
                }
            })
        },

        methods: {}
    }
</script>

<style lang="scss">
    .blog-nav {
        z-index: 99;
        top: 66px;
        position: fixed;
        width: 200px;
        background: $app-bg;
        transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
        margin-right: 10px;
        li {
            display: block;
            background: $container-bg;
        }
        .router-link-active {
            border-left-color: $primary !important;
        }
        .nav-menu > li > a {
            border-left: 3px solid transparent;
            transition: $trans;
            display: block;
            font-size: $font-size-menu;
            line-height: $line-height-base;
            padding: 10px 15px;
            margin-bottom: 10px;
            &:hover {
                border-left-color: $primary-lighten !important;
                background-color: $module-hover-bg;
            }
            > span {
                margin-left: 5px;
            }
        }
        .input-container {
            display: flex;
            > input {
                color: $text;
                width: 100%;
                height: 35px;
                background: $secondary-bg;
                border: none;
                padding: 3px 7px;
                outline: 0;
                transition: $trans;
                &::placeholder{
                    color: $text-light;
                }
                &:focus {
                    background: $secondary-bg-darken;
                }
                &:focus:invalid {
                    border-color: #ee3900;
                    color: #ff5722;
                }
            }
            .search-btn {
                color: $text;
                background-color: $secondary-bg-darken;
                border: none;
                outline: 0;
                padding: 3px 7px;
                cursor: pointer;
            }
        }
    }

</style>
