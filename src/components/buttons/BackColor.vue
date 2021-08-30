<template>
    <div class="heditor-toolbar__btn">
        <button
            title="文字背景"
            @click="handleClick($event)"
        >
            <Fill
                theme="outline"
                size="16"
                :fill="textcolor==='rgb(255, 255, 255)' || textcolor==='rgba(0, 0, 0, 0)'?'#555555':'#f5f5f5'"
                :style="{
                    backgroundColor: textcolor
                }"
            />
        </button>
        <Dialog
            v-show="dialogFlag.backcolor"
            class="colorpicker"
        >
            <template #body>
                <fk-color-picker v-model:color="thecolor" format="hex8" />
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
import { closestNode, getStyle, getStyleBackColor } from '../../use/useUtil'
import { Fill } from '@icon-park/vue-next'
import Dialog from '../Dialog.vue'
export default defineComponent({
    name      : 'BackColor',
    components: {
        Fill,
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
                    backcolor: !dialogFlag.value.backcolor
                })
            }
        }
        // 选择的颜色
        const thecolor = ref('')
        watch(thecolor, c => {
            reselectRange(selectRange.value)
            if (selectRange.value) {
                execCommand({ command: 'BackColor', value: c }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
        })
        // 检测选区变化，更新文字颜色
        const textcolor = ref('rgb(255, 255, 255)')
        watch(rangeChange, r => {
            if (selectRange.value && selectRange.value.startContainer) {
                // console.log('-====backcolor:', selectRange.value.startContainer.parentNode)
                textcolor.value = getStyleBackColor(selectRange.value.startContainer.nodeType === 3 ? selectRange.value.startContainer.parentNode : selectRange.value.startContainer)
            }
        })
        return {
            dialogFlag,
            thecolor,
            textcolor,
            handleClick
        }
    }
})
</script>
