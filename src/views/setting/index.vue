<template>
    <div class="setting">
        <switch-btn v-model="checked" style="margin:15px;float: right;">
            <span slot="left">light</span>
            <span slot="right">dark</span>
        </switch-btn>

        <h1>PC Theme Color</h1>
        <div class="app-theme" id="app-theme-color">
            <div class="app-bg">app-bg</div>
            <div class="container-bg">container-bg</div>
            <div class="container-bg-opacity">container-bg-opacity</div>

            <div class="secondary-bg">secondary-bg</div>
            <div class="secondary-bg-darken">secondary-bg-darken</div>
            <div class="secondary-bg-lighten">secondary-bg-lighten</div>

            <div class="module-hover-bg">module-hover-bg</div>
            <div class="module-hover-bg-darken">module-hover-bg-darken</div>
            <div class="module-hover-bg-lighten">module-hover-bg-lighten</div>

            <div class="primary">primary</div>
            <div class="primary-darken">primary-darken</div>
            <div class="primary-lighten">primary-lighten</div>

            <div class="info">info</div>
            <div class="success">success</div>
            <div class="warning">waring</div>
            <div class="error">error</div>
            <div></div>
            <div></div>
            <div class="text">text</div>
            <div class="text-dark">text-dark</div>
            <div class="text-light">text-light</div>
            <div class="text-secondary">text-secondary</div>
            <div class="text-invert">text-invert</div>
            <div class="disabled">disabled</div>
            <div class="dividers">dividers</div>
        </div>
        <div class="app-font">
            <table>
                <thead>
                <tr>
                    <th>中文字体</th>
                    <th>示例</th>
                    <th>粗细</th>
                    <th>颜色</th>
                    <th>字号</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>主标题</td>
                    <td>我是标题</td>
                    <td>加粗</td>
                    <td ref="td1" style="color: #121212">{{color}}</td>
                    <td>16px</td>
                </tr>
                <tr>
                    <td>次级标题</td>
                    <td>我是标题</td>
                    <td>加粗</td>
                    <td>#464c5b</td>
                    <td>14px</td>
                </tr>
                <tr>
                    <td>主标题</td>
                    <td>我是标题</td>
                    <td>加粗</td>
                    <td>#464c5b</td>
                    <td>16p</td>
                </tr>
                <tr>
                    <td>主标题</td>
                    <td>我是标题</td>
                    <td>加粗</td>
                    <td>#464c5b</td>
                    <td>16p</td>
                </tr>
                <tr>
                    <td>主标题</td>
                    <td>我是标题</td>
                    <td>加粗</td>
                    <td>#464c5b</td>
                    <td>16p</td>
                </tr>
                </tbody>
            </table>
        </div>

        <icon-list/>
    </div>
</template>

<script>
    import SwitchBtn from '_c/switchbtn'
    import { mapGetters, mapMutations } from 'vuex'
    import IconList from './icon-list'
    export default {
        name: 'index',
        components: { IconList, SwitchBtn },
        data () {
            return {
                color: ''
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
        mounted () {
            setTimeout(() => {
                this.color = this.$refs.td1.style.color
                let nodes = document.getElementById('app-theme-color').childNodes
                Array.from(nodes).forEach((item) => {
                    console.log(item.getAttribute('backgroundColor'))
                })
            }, 1000)
        },

        methods: {
            ...mapMutations([
                'setTheme'
            ])
        }
    }
</script>

<style lang="scss">
    .setting {
        background: $container-bg;
        > h1 {
            text-align: center;
            padding: 25px 0;
            font-size: $font-size-h1;
        }
        .app-font {
            display: flex;
            justify-content: center;
            table {
                margin: 10px;
                border: $border;
                thead{
                    background-color: $app-bg;
                }
                th,td{
                    padding: 10px 35px;
                    border: $border;
                }
            }
        }
    }

    .app-theme {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        > div {
            width: 26%;
            margin: 20px;
            padding: 25px;
            box-shadow: $box-shadow;
            border-radius: 5px;
        }

        .app-bg {
            background-color: $app-bg;

        }

        .container-bg {
            background-color: $container-bg;
        }

        .secondary-bg {
            background-color: $secondary-bg;
        }

        .secondary-bg-darken {
            background-color: $secondary-bg-darken;
        }

        .secondary-bg-lighten {
            background-color: $secondary-bg-lighten;
        }

        .module-hover-bg {
            background-color: $module-hover-bg;
        }

        .module-hover-bg-darken {
            background-color: $module-hover-bg-darken;
        }
        .module-hover-bg-lighten {
            background-color: $module-hover-bg-complement;
        }
        .container-bg-opacity {
            background-color: $container-bg-opacity;
        }

        .primary {
            background-color: $primary;
        }
        .primary-darken{
            background-color: $primary-darken;
        }
        .primary-lighten{
            background-color: $primary-lighten;
        }

        .info{
            background-color: $info;
        }
        .success{
            background-color: $success;
        }
        .warning{
            background-color: $warning;
        }
        .error{
            background-color: $error;
        }

        .text{
            background-color: $text;
        }
        .text-dark{
            background-color: $text-dark;
        }
        .text-light{
            background-color: $text-light;
        }
        .text-secondary{
            background-color: $text-secondary;
        }
        .text-invert{
            background-color: $text-invert;
        }
        .disabled{
            background-color: $disabled;
        }
        .dividers{
            background-color: $dividers;
        }
    }

</style>
