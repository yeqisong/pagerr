<template>
    <div class="heditor-toolbar__btn">
        <button
            :class="{
                disabled: record.step === record.data.length
            }"
            title="重做"
            @click.prevent="handleClick($event)"
        >
            <next theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, inject, nextTick } from 'vue'
import { Next } from '@icon-park/vue-next'
import useEditor from '../../use/useEditor'
import { useStore } from 'vuex'
import { getRange } from '../../use/useSelection'
export default defineComponent({
    name      : 'Redo',
    components: {
        Next
    },
    props: {},
    setup() {
        const { record, redo } = useEditor(useStore())
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            redo()
            nextTick(() => {
                // saveRange()
                updateSelectRange(getRange())
            })
        }
        return {
            handleClick,
            record
        }
    }
})
</script>
