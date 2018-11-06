<template>
    <footer class="footer">
        <section class="container">
            <p class="copy-right">
                Copyright © 2018 Qinsong Inc. All rights reserved.  Power by node.js & Vue.js</p>
        </section>
    </footer>
</template>

<script>

    export default {
        name: 'app-footer'
    }
</script>

<style lang="scss">
    .footer {
        width: 100%;
        //background: $container-bg;
        >.container{
            @include margin-auto-width;
            margin-top: 15px;
            padding: 25px 10px;
            text-align: center;
        }

    }
</style>
