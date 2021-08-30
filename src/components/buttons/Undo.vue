<template>
    <div class="heditor-toolbar__btn">
        <button
            :class="{
                disabled: record.step <= 1
            }"
            title="撤销"
            @click.prevent="handleClick($event)"
        >
            <back theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, inject, nextTick } from 'vue'
import { Back } from '@icon-park/vue-next'
import useEditor from '../../use/useEditor'
import { useStore } from 'vuex'
import { getRange } from '../../use/useSelection'
export default defineComponent({
    name      : 'Undo',
    components: {
        Back
    },
    props: {},
    setup() {
        const { record, undo } = useEditor(useStore())
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            undo()
            nextTick(() => {
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
