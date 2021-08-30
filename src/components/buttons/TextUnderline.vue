<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            title="下划线"
        >
            <writing-fluently theme="outline" size="16" />
        </button>
        <Dialog
            v-show="dialogFlag.underline"
            class="noheader"
        >
            <template #body>
                <button
                    v-for="(l,idx) in LS"
                    :key="idx"
                    :title="l.name"
                    class="align_btn"
                    :class="{active:tg === l.type}"
                    @click.stop="handleExec($event, l.type)"
                >
                    <span :class="'underline-'+l.type">&nbsp;U&nbsp;</span>
                </button>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { WritingFluently } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Dialog from '../Dialog.vue'
import { getRange } from '../../use/useSelection'
import { getStyleBorderBottomStyle } from '../../use/useUtil'
import LS from '../../blocks/underlines'
export default defineComponent({
    name      : 'TextUnderline',
    components: {
        WritingFluently,
        Dialog
    },
    props: {},
    setup() {
        const store = useStore()
        const { addRecord, saveRange, dialogFlag, setDialogFlag }  = useEditor(store)
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            // 设置本开关状态，强制关闭其它状态
            setDialogFlag({
                underline: !dialogFlag.value.underline
            })
            return false
        }
        const tg = ref('none')
        // 执行命令
        const handleExec = (event, type) => {
            if (selectRange.value) {
                execCommand({ command: 'TextUnderline', value: type }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
            return false
        }
        // 实时监测选区的对齐状态
        watch(rangeChange, rc => {
            if (selectRange.value && selectRange.value.startContainer) {
                // console.log('====:', getStyleBorderBottomStyle(selectRange.value.startContainer.parentNode))
                tg.value = getStyleBorderBottomStyle(selectRange.value.startContainer.parentNode)
            }
        })
        return {
            tg,
            handleClick,
            dialogFlag,
            handleExec,
            LS
        }
    }
})
</script>
<style scoped>
.noheader{
    padding:12px 10px;
    min-height: 50px !important;
    height: 50px !important;
    min-width: 160px !important;
    width: 190px;
}
.undeline-none{
    border-bottom-style: none;
}
.noheader .align_btn {
    margin: 0px 5px;
}
</style>
