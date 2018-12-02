<template>
    <div class="article-link-card">
        <div class="card-img">
            <span class="origin">{{data.origin}}</span>
            <img :src="data.imgUrl+'?imageView/2/w/90/h/150/q/100/format/png'" @click="toDetail">
        </div>
        <div class="card-info">
            <div>
                <p class="title"><a @click="toDetail">{{data.title}}</a></p>
                <p class="sub-title">{{data.desc}}</p>
            </div>
            <div class="info-list">
                <span class="time"><icon icon="#icon-time"/>{{data.createdAt.substr(0,10)}}</span>
                <span class="red-mounts"><icon icon="#icon-icon-test"/>{{data.viewCount}}</span>
                <span class="comment"><icon icon="#icon-like"/>31</span>
                <span class="comment"><icon icon="#icon-comments"/>31</span>
                <span class="tags"><icon icon="#icon-list-color"/>{{data.dirs[0].name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'blog-article-link-card',
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            toDetail () {
                if (this.data.id) {
                    this.$router.push({
                        name: 'article',
                        params: {
                            id: this.data.id
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .article-link-card {
        background: $container-bg;
        display: flex;
        margin-top: 10px;
        padding: 15px;
        transition: $trans;
        height: 130px;
        &:hover {
            box-shadow: $box-shadow;
            .card-img>img,.origin{
                transform: translateX(-10px);
            }
            .card-img>.origin{
                opacity: 1;
                background: $secondary-bg;
            }
        }
        .card-img {
            position: relative;
            width: 35%;
            .origin{
                transition: transform .3s cubic-bezier(.215,.61,.355,1);
                z-index: 9;
                position: absolute;
                color: $text-invert;
                padding: 3px 5px;
                background: $secondary-bg-darken;
                opacity: 0.5;
            }
            >img {
                min-width: 100%;
                max-width: 100%;
                max-height: 100%;
                transition: transform .3s cubic-bezier(.215,.61,.355,1);
                cursor: pointer;
            }
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
                    &:first-child,&:last-child{
                        flex: 1.5;
                    }
                    /*margin-right: 5px;*/
                    flex: 1;
                    >svg{
                        margin-right: 5px;
                    }
                }
                .tags{
                    >span{
                        /*margin-right: 5px;*/
                    }
                }
            }
        }
    }
</style>
