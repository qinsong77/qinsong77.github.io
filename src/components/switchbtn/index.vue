<template>
    <div class="switch-container">
        <slot name="left" class="left-span"></slot>
        <input id="switchbtn"
               class="switchInput"
               type="checkbox"
               name="checkbox"
               v-bind:checked="checked"
               v-on:change="$emit('change', $event.target.checked)"/>
        <label for="switchbtn" class="switchbtn-label"></label>
        <slot name="right" class="right-span"></slot>
    </div>
</template>

<script>
    export default {
        name: 'index',
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: {
            default: true,
            checked: Boolean
        }
    }
</script>

<style lang="scss">
    .switch-container {
        >span:first-child{
            margin-right: 5px;
        }
        >span:last-child{
            margin-left: 5px;
        }
        .switchInput{
            display: none;
        }
        .switchbtn-label{
            cursor: pointer;
            vertical-align: text-bottom;
            box-shadow: $box-shadow;
            width: 40px;
            height: 20px;
            border-radius: 20px;
            display: inline-block;
            position: relative;
            background: #51ccee;
            overflow: hidden;
        }
        .switchbtn-label:before{
            content:'';
            position: absolute;
            left:20px;
            width: 20px;
            height: 20px;
            display: inline-block;
            border-radius: 20px;
            background-color: #fff;
            z-index:99;
            transition: $trans;
        }
        .switchInput:checked+label.switchbtn-label:before{
            left: 0;
        }
        .switchInput:checked+label.switchbtn-label{
            background: #bdbdbd;
        }
    }
</style>
