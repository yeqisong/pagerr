<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            :class="{
                active: tn==='italic'
            }"
            title="斜体"
        >
            <text-italic theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { TextItalic } from '@icon-park/vue-next'
import useEditor from '../../use/useEditor'
import { useStore } from 'vuex'
import { getRange } from '../../use/useSelection'
import { getStyleFontItalic } from '../../use/useUtil'
export default defineComponent({
    name      : 'Italic',
    components: {
        TextItalic
    },
    props: {},
    setup() {
        const { addRecord } = useEditor(useStore())
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            if (selectRange.value && selectRange.value.startContainer) {
                execCommand({ command: 'Italic' }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
            return false
        }
        // 监听选区变化，当前选区是否有斜体
        const tn = ref('normal')
        watch(rangeChange, rc => {
            // console.log('=====italic: ', getStyleFontItalic(selectRange.value.startContainer.parentNode))
            if (selectRange.value && selectRange.value.startContainer) {
                tn.value = getStyleFontItalic(selectRange.value.startContainer.parentNode)
            }
        })
        return {
            handleClick,
            tn
        }
    }
})
</script>
