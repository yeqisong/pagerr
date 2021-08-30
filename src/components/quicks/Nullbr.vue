<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="上下插入空行"
            @click.stop="handleBttonClick($event)"
        >
            <distribute-vertically theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, nextTick } from '@vue/runtime-core'
import { DistributeVertically } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Selector from '../../class/Selector'
import { htmlToFragment } from '../../use/useUtil'
export default defineComponent({
    name      : 'Nullbr',
    components: {
        DistributeVertically
    },
    setup() {
        const store = useStore()
        const { blockAttr, addRecord } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            let c = Selector('.' + blockAttr.value.className)
            c.before(htmlToFragment('<br/>'))
            c.after(htmlToFragment('<br/>'))
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
