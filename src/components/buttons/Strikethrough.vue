<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            :class="{
                active: tn==='line-through'
            }"
            title="删除线"
        >
            <span class="i-icon i-icon-text-strikethrough">
                <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24H43" stroke="#555555" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M24 24C40 30 34 44 24 44C13.9999 44 12 36 12 36" stroke="#555555" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M35.9999 12C35.9999 12 33 4 23.9999 4C14.9999 4 11.4359 11.5995 15.6096 18" stroke="#555555" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /><path d="M12 36C12 36 15.9999 44 24 44C32 44 36.564 36.4005 32.3903 30" stroke="#555555" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
        </button>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { execCommand } from '../../use/useExecCommand'
import { getRange } from '../../use/useSelection'
import { getStyleTextDecoration } from '../../use/useUtil'
export default defineComponent({
    name : 'Strikethrough',
    props: {},
    setup() {
        const { addRecord, saveRange } = useEditor(useStore())
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            if (selectRange.value && selectRange.value.startContainer) {
                execCommand({ command: 'Strikethrough' }, () => {
                    updateSelectRange(getRange())
                    // saveRange()
                    addRecord()
                })
            }
            return false
        }
        // 监听
        const tn = ref('none')
        watch(rangeChange, rc => {
            if (selectRange.value && selectRange.value.startContainer) {
                tn.value = getStyleTextDecoration(selectRange.value.startContainer.parentNode).indexOf('line-through') > -1 ? 'line-through' : 'none'
                // console.log('---delete', getStyleTextDecoration(selectRange.value.startContainer.parentNode))
            }
        })
        return {
            handleClick,
            tn
        }
    }
})
</script>
