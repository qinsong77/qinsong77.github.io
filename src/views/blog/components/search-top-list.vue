<template>
    <div class="search-top-list">
        <div class="input-container">
            <input v-model="search" required placeholder="search me"/>
            <button class="search-btn">
                <i class="iconfont icon-search"></i>
            </button>
        </div>
        <div class="top-list-container">
            <div class="title">
                <i class="iconfont icon-vertical-align-top"></i>
                TOP LIST
            </div>
            <ul class="top-list">
                <li v-for="(value,key,index) in items" :key="key">
                    <span class="index">{{index+1}}</span>
                    <a>{{value}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'search-top-list',
        data () {
            return {
                search: '',
                items: {
                    'dsjfkas': '发贺卡1',
                    'dsj1fkas': '发贺卡2',
                    'dsjfekas': '发贺卡3',
                    'dsjfkeas': '发贺卡4',
                    'dsjfek2as': '发贺卡5'
                }
            }
        }
    }
</script>
<style lang="scss">
    .search-top-list {
        > div {
            background: $container-bg;
        }
        .input-container {
            padding: 5px 10px;
            display: flex;
            > input {
                color: $text;
                width: 100%;
                height: 30px;
                background: $secondary-bg;
                border: none;
                padding: 3px 7px;
                outline: 0;
                transition: $trans;
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
        .top-list-container {
            margin-top: 15px;
            .title {
                > i {
                    font-size: 20px;
                    margin-right: 5px;
                }
                padding: 12px 10px;
                border-bottom: 1px solid $app-bg;
            }
            .top-list li {
                padding: 12px 10px;
                &:first-child .index {
                    background-color: rgba(245, 24, 11, 0.6);
                }
                &:nth-child(2) .index {
                    background-color: rgba(245, 144, 13, 0.6);
                }
                &:nth-child(3) .index {
                    background-color: rgba(0, 136, 245, .6);
                }
                > .index {
                    color: $text;
                    counter-increment: hot-article-list;
                    background: $secondary-bg;
                    width: 1.5em;
                    height: 1.5em;
                    line-height: 1.5em;
                    display: inline-block;
                    text-align: center;
                    margin-right: .5em;
                    font-size: .8em;
                }
                a {
                    cursor: pointer;
                    transition: margin-left .2s linear;
                    &:hover {
                        text-decoration: underline;
                        margin-left: 10px;
                        background: transparent;
                    }
                }
            }
        }
    }
</style>
