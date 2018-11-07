<template>
    <div class="article-link-card">
        <img src="../../../assets/1212.png">
        <div class="card-info">
            <div>
                <p class="title"><a>这是一个文章标题</a></p>
                <p class="sub-title">这是一个文章简单简绍</p>
            </div>
            <div class="info-list">
                <span class="time"><i class="iconfont icon-time-circle"></i>2018.12.10</span>
                <span class="red-mounts"><i class="iconfont icon-eye"></i>12</span>
                <span class="comment"><i class="iconfont icon-message"></i>31</span>
                <span class="tags"><i class="iconfont icon-tag"></i>Vue.js</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'blog-article-link-card'
    }
</script>

<style lang="scss">
    .article-link-card {
        background: $container-bg;
        display: flex;
        margin-top: 10px;
        padding: 15px;
        transition: $trans;
        &:hover {
            box-shadow: $box-shadow;
            >img{
                transform: translateX(-10px);
            }
        }
        img {
            transition: transform .3s cubic-bezier(.215,.61,.355,1);
            cursor: pointer;
        }
        .card-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 10px;
            .title {
                font-weight: 600;
                font-size: 15px;
                padding: 5px 0;
                >a{
                    transition: $trans;
                    &:hover{
                        text-decoration: underline;
                        margin-left: 15px;
                    }
                }
            }
            .sub-title{
                padding: 5px 0;
            }
            .info-list{
                padding: 5px 0;
                display: flex;
                justify-content: space-between;
                >span{
                    margin-right: 5px;
                    >i{
                        margin-right: 5px;
                        font-size: $font-size-l;
                        vertical-align: -.08em;
                    }
                }
            }
        }
    }
</style>
