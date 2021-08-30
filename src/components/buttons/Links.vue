<template>
    <div
        class="heditor-toolbar__btn"
    >
        <button
            title="编辑链接"
            @click.stop="handleClick($event)"
        >
            <link-one v-show="!(range.parentNodeType.indexOf('A') > -1)" theme="outline" size="16" />
            <unlink v-show="range.parentNodeType.indexOf('A') > -1" theme="outline" size="16" />
        </button>
        <links-pannel v-if="dialogFlag.links" v-bind="definfo" />
    </div>
</template>
<script>
import { defineComponent, inject, reactive } from 'vue'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import {  expandRange } from '../../use/useSelection'
import { LinkOne, Unlink } from '@icon-park/vue-next'
import LinksPannel from './LinksPannel.vue'
export default defineComponent({
    name      : 'Links',
    components: {
        LinkOne,
        Unlink,
        LinksPannel
    },
    props: {},
    setup() {
        const store = useStore()
        const { range, dialogFlag, setDialogFlag, saveRange }  = useEditor(store)
        const selectRange = inject('selectRange')
        // const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        const definfo = reactive({
            shref  : '',
            starget: '_blank',
            stitle : '',
            stext  : ''
        })
        // 按钮点击
        const handleClick = event => {
            if (selectRange.value) {
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
                // 设置本开关状态，强制关闭其它状态
                setDialogFlag({
                    links: !dialogFlag.value.links
                })
            }
        }
        return {
            range,
            handleClick,
            definfo,
            dialogFlag
        }
    }
})
</script>
