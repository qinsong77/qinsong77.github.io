<template>
    <transition name="fade">
        <div
                v-show="visible"
                class="loading">
            <div class="el-loading-spinner">
                <icon icon="#icon-loadingout" class="loading-icon"/>
                <p class="loading-text" v-if="text">{{ text }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'loading',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: ''
            }
        }
    }
</script>
<style lang="scss">
    .loading{
        z-index:10;
        background: $container-bg;
        width: 100%;
        position: absolute;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        .loading-icon{
            font-size: 30px;
            animation: rotaing 2s linear infinite;
        }
    }
    @keyframes rotaing {
        0%{
            transform: rotate(0deg);
        }
        100% {
           transform:rotate(360deg);
        }
    }
</style>
