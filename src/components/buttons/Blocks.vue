<template>
    <div
        class="heditor-toolbar__btn"
    >
        <button
            title="组件"
            :class="{
                disabled: !range.flag
            }"
            @click="handleClick($event)"
        >
            <plus-cross theme="filled" size="16" />
        </button>
        <Dialog
            v-show="dialogFlag.blocks"
            :description="'请选择组件，点击插入页面光标处'"
            class="heditor-toolbar__list"
            style="width:500px"
        >
            <template #body>
                <div
                    v-for="(block, index) in blocks"
                    :key="index"
                    :data-blockid="index"
                    class="heditor-toolbar__list_b"
                    @click.stop="handleBlockSelect($event)"
                >
                    <div class="heditor-toolbar_list_thumb">
                        <img :src="block.thumb" :title="block.title">
                    </div>
                    <div class="heditor-toolbar_list_name">
                        {{ block.title }}
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, nextTick } from 'vue'
import { getSelection, getRange, insertAtRange, isEffectRange } from '../../use/useSelection'
import { PlusCross } from '@icon-park/vue-next'
import Dialog from '../Dialog.vue'
import blocks from '../../blocks'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Selector from '../../class/Selector'
export default defineComponent({
    name      : 'Blocks',
    components: {
        PlusCross,
        Dialog
    },
    props: {},
    setup() {
        const store = useStore()
        const { dialogFlag, setDialogFlag, range, addRecord }  = useEditor(store)
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
                    blocks: !dialogFlag.value.blocks
                })
            }
        }
        // 组件选择点击
        const handleBlockSelect = event => {
            if (!isEffectRange(selectRange.value.endContainer)) {
                return false
            }
            let bk = blocks[event.currentTarget.dataset.blockid]
            if (selectRange.value) {
                let r = getRange()
                // 检查是否包裹在block中
                let inlay = Selector(r.endContainer).findClosestClass('pagerr-block', 'node')
                if (inlay) {
                    // 如果在，检查block设置：是否可以被嵌套block元素
                    let nestset = inlay.dataset.nest
                    if (nestset !== 'true') {
                        alert('当前组件不允许嵌套其它组件，请换个位置插入组件')
                        return false
                    }
                }
                // 检查父元素是否包含i,em,b,font,span等，不允许插入div
                insertAtRange(bk.content + '<br/>', getSelection())
                nextTick(() => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
            return false
        }
        return {
            handleClick,
            range,
            dialogFlag,
            blocks,
            handleBlockSelect
        }
    }
})
</script>
