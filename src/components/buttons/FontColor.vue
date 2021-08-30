<template>
    <div class="heditor-toolbar__btn">
        <button
            title="文字颜色"
            @click="handleClick($event)"
        >
            <span
                class="text-icon"
                :style="{
                    color: textcolor,
                    borderBottonColor: textcolor
                }"
            >A</span>
        </button>
        <Dialog
            v-show="dialogFlag.fontcolor"
            class="colorpicker"
        >
            <template #body>
                <fk-color-picker v-model:color="thecolor" format="hex6" />
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { getRange, isEffectRange, reselectRange } from '../../use/useSelection'
import {  getStyleColor } from '../../use/useUtil'
import Dialog from '../Dialog.vue'
export default defineComponent({
    name      : 'FontColor',
    components: {
        Dialog
    },
    props: {},
    setup() {
        const store = useStore()
        const { addRecord, dialogFlag, setDialogFlag }  = useEditor(store)
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            if (!selectRange.value) {
                return false
            }
            // 是否是有效选区
            if (isEffectRange(selectRange.value.endContainer)) {
                // 设置本开关状态，强制关闭其它状态
                setDialogFlag({
                    fontcolor: !dialogFlag.value.fontcolor
                })
            }
        }
        // 选择的颜色
        const thecolor = ref('')
        watch(thecolor, c => {
            reselectRange(selectRange.value)
            // console.log('----3:', thecolor.value)
            // 是否是有效选区
            if (isEffectRange(selectRange.value.endContainer)) {
            // 设置本开关状态，强制关闭其它状态
                execCommand({ command: 'FontColor', value: c }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
        })
        // 检测选区变化，更新文字颜色
        const textcolor = ref('#555555')
        watch(rangeChange, rc => {
            // console.log('======range change: ', r)
            if (selectRange.value && selectRange.value.startContainer) {
                textcolor.value = getStyleColor(selectRange.value.startContainer.parentNode)
            }
        })
        return {
            thecolor,
            textcolor,
            dialogFlag,
            handleClick
        }
    }
})
</script>
<style scoped>
span.text-icon{
    display: block;
    width: 16px !important;
    font-size: 16px;
    height:18px !important;
    line-height: 18px !important;
    border-bottom: 2px solid;
    margin: 0 auto;
}
</style>
