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
        <borders-pannel
            v-if="attrPannel==='tableborder'"
            @border="borderSet($event)"
        />
    </teleport>
</template>
<script>
import { computed, defineComponent, ref, watch } from '@vue/runtime-core'
import { Fullwidth } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Xtable from '../../class/Xtable'
import BordersPannel from '../comps/BordersPannel.vue'
export default defineComponent({
    name      : 'TableBorder',
    components: {
        Fullwidth,
        BordersPannel
    },
    setup() {
        const store = useStore()
        const { setAttrPannel, attrPannel, quick, addRecord } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            setAttrPannel('tableborder')
        }
        // 初始化
        const tbl = ref(null)
        tbl.value = Xtable('.' + quick.value.d)
        // 获取组件的边框设置
        const borderSet = bor => {
            tbl.value.setBorder(bor)
        }
        return {
            attrPannel,
            handleBttonClick,
            borderSet
        }
    }
})
</script>
