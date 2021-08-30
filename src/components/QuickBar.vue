<template>
    <transition name="fade">
        <div
            class="heditor-quickbar"
            :style="{
                display: (quick.display && (quick.y-scrollDst>20))? 'block' : 'none',
                transform: `translate3d(${quick.x-appPos.left}px, ${quick.y-scrollDst}px, 0px)`
            }"
            @click.stop="function(){return false}"
        >
            <width v-if="quick.btns.indexOf('width')>-1" />
            <height v-if="quick.btns.indexOf('height')>-1" />
            <table-size v-if="quick.btns.indexOf('tableSize')>-1" />
            <background-image v-if="quick.btns.indexOf('background')>-1" />
            <table-border v-if="quick.btns.indexOf('tableBorder')>-1" />
            <Image v-if="quick.btns.indexOf('image')>-1" />
            <Goup v-if="quick.btns.indexOf('goup')>-1" />
            <Godown v-if="quick.btns.indexOf('godown')>-1" />
            <view-link v-if="quick.btns.indexOf('viewLink')>-1" />
            <edit-link v-if="quick.btns.indexOf('editLink')>-1" />
            <Nullbr v-if="quick.btns.indexOf('nullbr')>-1" />
            <Deletei v-if="quick.btns.indexOf('delete')>-1" />
            <div
                v-show="quick.display && attrPannel!==false"
                ref="quickDg"
                class="heditor-quickbar__dialog"
            >
                <div
                    class="heditor-quickbar__dialog-head"
                >
                    <close @click.stop="closeAttrPannel($event)" />
                </div>
                <div class="heditor-quickbar__dialog-body" />
            </div>
        </div>
    </transition>
</template>
<script>
import { defineComponent, nextTick, ref, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import useEditor from '../use/useEditor'
import { windowSize } from '../use/useUtil'
import BackgroundImage from './quicks/BackgroundImage.vue'
import Close from './quicks/Close.vue'
import Deletei from './quicks/Deletei.vue'
import EditLink from './quicks/EditLink.vue'
import Godown from './quicks/Godown.vue'
import Goup from './quicks/Goup.vue'
import Height from './quicks/Height.vue'
import Image from './quicks/Image.vue'
import Nullbr from './quicks/Nullbr.vue'
import TableBorder from './quicks/TableBorder.vue'
import TableSize from './quicks/TableSize.vue'
import ViewLink from './quicks/ViewLink.vue'
import Width from './quicks/Width.vue'
export default defineComponent({
    name      : 'QuickBar',
    components: { Width, Height,
        BackgroundImage, Close, Image,
        Deletei, Nullbr, Goup, Godown,
        ViewLink, EditLink, TableSize,
        TableBorder },
    setup() {
        const store = useStore()
        const { quick, attrPannel, setAttrPannel, scrollDst, appPos } = useEditor(store)
        // 关闭属性编辑面板
        const closeAttrPannel = event => {
            setAttrPannel(false)
        }
        // 监测弹窗显示，调整到合适的位置
        const quickDg = ref(null)
        watch(attrPannel, q => {
            nextTick(() => {
                if (q) {
                    let qrect = quickDg.value.getBoundingClientRect()
                    let ws = windowSize()
                    // console.log('---', q, quickDg.value, quickDg.value.getBoundingClientRect(), ws)
                    quickDg.value.style.transform = `
                        translate3d(
                            ${qrect.right - ws.width > 0 ? ws.width - qrect.right - 10 : 0}px,
                            ${qrect.bottom - ws.height > 0 ? ws.height - qrect.bottom - 10 : 0}px,
                            0px
                        )
                    `
                } else {
                    quickDg.value.style.transform = 'translate3d(0px,0px,0px)'
                }
            })
        })
        return {
            quick,
            attrPannel,
            closeAttrPannel,
            quickDg,
            scrollDst,
            appPos
        }
    }
})
</script>
<style lang="stylus" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
