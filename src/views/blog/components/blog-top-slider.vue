<template>
    <div class="blog-slider">
        <swiper :options="swiperOption">
            <swiper-slide v-for="(item,index) in data" :key="item.id">
                <div class="slider-container" @click="toDetail(item.id)">
                    <img :src="item.imgUrl" />
                    <a class="title">{{item.title}}</a>
                </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
        name: 'blog-top-slider',
        components: {
            swiper,
            swiperSlide
        },
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        data () {
            return {
                swiperOption: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                    slidesPerGroup: 3,
                    loop: true,
                    loopFillGroupWithBlank: true,
                    autoplay: {
                        delay: 3500,
                        disableOnInteraction: false
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                }
            }
        },
        computed: {},

        created () {
        },

        mounted () {
        },

        methods: {
            toDetail (id) {
                if (id) {
                    this.$router.push({
                        name: 'article',
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
    .blog-slider{
        .swiper-slide{
            height: 150px;
        }
        .slider-container{
            cursor: pointer;
            position: relative;
            img{
                width: 100%;
                height: 160px;
            }
            .title{
                z-index: 10;
                position: absolute;
                margin: 0;
                top: 1.5rem;
                right: 2rem;
                color: var(--link-color);
                padding-right: .6em;
                padding-left: 1em;
                height: 2em;
                line-height: 2em;
                font-size: 1em;
                font-weight: 700;
                border-radius: 1px;
                letter-spacing: .3px;
                max-width: 75%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                -webkit-background-clip: text;
                background: linear-gradient(90deg,transparent,$container-bg-opacity,$container-bg,)
            }
        }
    }
</style>
