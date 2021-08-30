<template>
    <div
        class="heditor-toolbar__btn"
    >
        <button
            title="symbols"
            @click="handleClick($event)"
        >
            <Symbol theme="outline" size="16" />
        </button>
        <svgs-pannel v-if="dialogFlag.svgs" @selectSvg="getSVG($event)" />
    </div>
</template>
<script>
import { defineComponent, inject, nextTick } from 'vue'
import { getRange, insertInRange, isEffectRange, reselectRange } from '../../use/useSelection'
import { useStore } from 'vuex'
import { Symbol } from '@icon-park/vue-next'
import useEditor from '../../use/useEditor'
import SvgsPannel from './SvgsPannel.vue'
export default defineComponent({
    name      : 'Svgs',
    components: {
        SvgsPannel,
        Symbol
    },
    props: {},
    setup() {
        const store = useStore()
        const { dialogFlag, setDialogFlag, addRecord }  = useEditor(store)
        // 当前选区
        const selectRange = inject('selectRange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            if (!selectRange.value) {
                return false
            }
            // 是否是有效选区
            if (isEffectRange(selectRange.value.endContainer)) {
                // 设置本开关状态，强制关闭其它状态
                setDialogFlag({
                    svgs: !dialogFlag.value.svgs
                })
            }
        }
        // 获取用户选择的svg，插入到选区
        const getSVG = svg => {
            // 恢复选区
            reselectRange(selectRange.value)
            // 插入图标
            insertInRange('<span>' + svg + '</span>')
            // 更新选区数据
            nextTick(() => {
                updateSelectRange(getRange())
                addRecord()
            })
            return false
        }
        return {
            handleClick,
            dialogFlag,
            getSVG
        }
    }
})
</script>
