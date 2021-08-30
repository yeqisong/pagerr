<template>
    <div
        class="heditor-toolbar"
        :class="{
            scroll: scroll
        }"
        @click.stop="function(){return false}"
    >
        <div class="heditor-toolbar__section">
            <Blocks />
        </div>
        <div class="heditor-toolbar__section">
            <Undo />
            <Redo />
        </div>
        <div class="heditor-toolbar__section">
            <font-family />
            <font-size />
            <text-heading />
        </div>
        <div class="heditor-toolbar__section">
            <text-align />
            <Bold />
            <Italic />
            <text-underline />
            <Strikethrough />
            <list-unorder />
            <list-order />
        </div>
        <div class="heditor-toolbar__section">
            <font-color />
            <back-color />
        </div>
        <div class="heditor-toolbar__section">
            <Links />
            <Svgs />
        </div>
        <div class="heditor-toolbar__section">
            <device-pc />
            <device-mobile />
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import useEditor from '../use/useEditor'
import BackColor from './buttons/BackColor.vue'
import Blocks from './buttons/Blocks.vue'
import Bold from './buttons/Bold.vue'
import DeviceMobile from './buttons/DeviceMobile.vue'
import DevicePc from './buttons/DevicePc.vue'
import FontColor from './buttons/FontColor.vue'
import FontFamily from './buttons/FontFamily.vue'
import FontSize from './buttons/FontSize.vue'
import Italic from './buttons/Italic.vue'
import Links from './buttons/Links.vue'
import ListOrder from './buttons/ListOrder.vue'
import ListUnorder from './buttons/ListUnorder.vue'
import Redo from './buttons/Redo.vue'
import Strikethrough from './buttons/Strikethrough.vue'
import Svgs from './buttons/Svgs.vue'
// import Tables from './buttons/Tables.vue'
import TextAlign from './buttons/TextAlign.vue'
import TextHeading from './buttons/TextHeading.vue'
import TextUnderline from './buttons/TextUnderline.vue'
import Undo from './buttons/Undo.vue'
export default defineComponent({
    components: {
        Bold,
        Undo,
        Redo,
        Italic,
        Blocks,
        Strikethrough,
        DevicePc,
        DeviceMobile,
        FontColor,
        BackColor,
        Links,
        Svgs,
        TextAlign,
        TextHeading,
        FontSize,
        FontFamily,
        TextUnderline,
        ListUnorder,
        ListOrder
    },
    props: {},
    setup() {
        const store = useStore()
        const { scroll } = useEditor(store)
        return {
            scroll
        }
    }
})
</script>
<style lang="stylus" scoped>
</style>
