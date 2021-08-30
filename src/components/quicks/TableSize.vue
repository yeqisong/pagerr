<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="表格尺寸"
            @click.stop="handleBttonClick($event)"
        >
            <fullwidth theme="outline" size="16" />
        </button>
    </div>
    <teleport to=".heditor-quickbar__dialog-body">
        <basic-size
            v-if="attrPannel==='tablesize'"
            v-model:width="width"
            v-model:height="height"
            :description="sizeTip"
        />
    </teleport>
</template>
<script>
import { computed, defineComponent, ref, watch } from '@vue/runtime-core'
import { Fullwidth } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import BasicSize from '../comps/BasicSize.vue'
import Xtable from '../../class/Xtable'
export default defineComponent({
    name      : 'TableSize',
    components: {
        Fullwidth,
        BasicSize
    },
    setup() {
        const store = useStore()
        const { setAttrPannel, attrPannel, quick, addRecord } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            setAttrPannel('tablesize')
        }
        // 修改尺寸
        const width = ref(null)
        const height = ref(null)
        const tbl = ref(null)
        const sizeTip = ref(null)
        // 初始化
        tbl.value = Xtable('.' + quick.value.d)
        if (tbl.value.hasSelectedCells()) {
            sizeTip.value = '设置每一个选中单元格的尺寸'
        } else {
            sizeTip.value = '设置该Table的尺寸'
            width.value = tbl.value.table.css('width')
            height.value = tbl.value.table.css('height')
        }
        // 监听尺寸修改
        watch([width, height], ([width, height]) => {
            tbl.value.setSize({ width, height }, () => {
                addRecord()
            })
        })
        return {
            attrPannel,
            handleBttonClick,
            width,
            height,
            sizeTip
        }
    }
})
</script>
