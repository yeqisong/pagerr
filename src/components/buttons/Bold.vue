<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            :class="{
                active: fw>=700?true:false
            }"
            title="加粗"
        >
            <text-bold theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { TextBold } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { getStyleFontWeight } from '../../use/useUtil'
import { getRange } from '../../use/useSelection'
export default defineComponent({
    name      : 'Bold',
    components: {
        TextBold
    },
    props: {},
    setup() {
        const store = useStore()
        const { addRecord }  = useEditor(store)
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            if (selectRange.value) {
                execCommand({ command: 'Bold' }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                    // console.log('bold new range:', getRange().cloneRange())
                })
            }
            return false
        }
        // 当前字重
        const fw = ref('400')
        watch(rangeChange, rc => {
            // console.log('bold range change----------------', rc)
            if (selectRange.value && selectRange.value.startContainer) {
                // console.log('font bold:', getStyleFontWeight(selectRange.value.startContainer.parentNode))
                fw.value = getStyleFontWeight(selectRange.value.startContainer.parentNode)
            }
        })
        return {
            handleClick,
            fw
        }
    }
})
</script>
