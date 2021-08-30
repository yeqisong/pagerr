<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="删除组件"
            @click.stop="handleBttonClick($event)"
        >
            <delete theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, nextTick } from '@vue/runtime-core'
import { Delete } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Selector from '../../class/Selector'
export default defineComponent({
    name      : 'Deletei',
    components: {
        Delete
    },
    setup() {
        const store = useStore()
        const { blockAttr, addRecord, setQuick } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            Selector('.' + blockAttr.value.className).delete()
            setQuick({
                display: false
            })
            nextTick(() => {
                addRecord()
            })
        }
        return {
            handleBttonClick
        }
    }
})
</script>
