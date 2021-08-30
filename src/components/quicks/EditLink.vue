<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="编辑链接"
            @click.stop="handleBttonClick($event)"
        >
            <edit theme="outline" size="16" />
        </button>
        <teleport to=".heditor-quickbar__dialog-body">
            <links-pannel v-if="attrPannel==='editLink'" class="inline-mode" v-bind="definfo" style="width:399px;" />
        </teleport>
    </div>
</template>
<script>
import { defineComponent, inject, reactive } from '@vue/runtime-core'
import { Edit } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import LinksPannel from '../buttons/LinksPannel.vue'
import { expandRange } from '../../use/useSelection'
export default defineComponent({
    name      : 'EditLink',
    components: {
        Edit,
        LinksPannel
    },
    setup() {
        const store = useStore()
        const { attrPannel, setAttrPannel, range, saveRange } = useEditor(store)
        const selectRange = inject('selectRange')
        const updateSelectRange = inject('updateSelectRange')
        const definfo = reactive({
            shref  : '',
            starget: '_blank',
            stitle : '',
            stext  : ''
        })
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            if (range.value.flag) {
                // 如果已经是A标签，强制全部选择完
                if (range.value.parentNodeType.indexOf('A') > -1) {
                    // 全选A标签, 更新选区
                    updateSelectRange(expandRange(selectRange))
                    saveRange()
                    // 该链接的初始数据
                    definfo.shref = selectRange.value.startContainer.parentNode.href
                    definfo.stitle = selectRange.value.startContainer.parentNode.getAttribute('title')
                    definfo.starget = selectRange.value.startContainer.parentNode.getAttribute('target')
                    definfo.stext = selectRange.value.startContainer.parentNode.text
                } else {
                    definfo.shref = ''
                    definfo.stitle = ''
                    definfo.starget = '_self'
                    definfo.stext = ''
                }
            }
            setAttrPannel('editLink')
        }
        return {
            handleBttonClick,
            attrPannel,
            definfo
        }
    }
})
</script>
