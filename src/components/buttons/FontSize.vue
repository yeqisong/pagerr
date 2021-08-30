<template>
    <div
        class="heditor-toolbar__btn full_width_btn"
    >
        <button title="设置字号">
            <span v-if="!dialogFlag.fontsize" class="text-icon f14" @click.stop="handleClick($event)">
                {{ rtagflag }}
            </span>
            <input
                v-if="dialogFlag.fontsize"
                type="text"
                class="text-input"
                :value="rtagflag"
                @change="handleExec($event,$event.target.value)"
            >
        </button>
        <Dialog
            v-show="dialogFlag.fontsize"
            class="noheader"
        >
            <template #body>
                <button
                    v-for="(f,idx) in FS"
                    :key="idx"
                    :title="f.name"
                    class="w_btn"
                    :class="{active:rtagflag === f.name}"
                    @click.stop="handleExec($event,f.fontSize)"
                >
                    <span class="text-icon">{{ f.name }}</span>
                </button>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Dialog from '../Dialog.vue'
import { getRange, reselectRange } from '../../use/useSelection'
import { getStyleFontSize } from '../../use/useUtil'
import FS from '../../blocks/fontSize'
export default defineComponent({
    name      : 'FontSize',
    components: {
        Dialog
    },
    props: {},
    setup() {
        const store = useStore()
        const { addRecord, dialogFlag, setDialogFlag }  = useEditor(store)
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            // 设置本开关状态，强制关闭其它状态
            setDialogFlag({
                fontsize: !dialogFlag.value.fontsize
            })
            return false
        }
        // 执行命令
        const handleExec = (event, type) => {
            // 恢复选区后，执行命令
            reselectRange(selectRange.value)
            // 执行字号命令
            if (selectRange.value && selectRange.value.startContainer) {
                execCommand({ command: 'FontSize', value: type }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                    // console.log('fontsize new range:', getRange().cloneRange())
                })
            }
            return false
        }
        // 实时监测选区的对齐状态
        const rtagflag = ref('12px')
        watch(rangeChange, rc => {
            // 第一次新选区时，检查父类中有无span或font，且包含font-size，实时更新当前的字号
            if (selectRange.value && selectRange.value.startContainer) {
                // console.log('fontsize watch===:', getStyleFontSize(selectRange.value.startContainer.parentNode))
                rtagflag.value = getStyleFontSize(selectRange.value.startContainer.parentNode)
            }
        })
        return {
            rtagflag,
            FS,
            handleClick,
            dialogFlag,
            handleExec
        }
    }
})
</script>
<style scoped>
.noheader{
    padding:12px 10px;
    min-height: 50px !important;
    height: auto !important;
    min-width: 70px !important;
    width: 70px;
}
.full_width_btn, .full_width_btn button,  .full_width_btn button span, .full_width_btn button input{
    width: 50px !important;
    text-align: center;
}
.noheader .align_btn {
    margin: 0px 5px;
}
.text-icon{
    width: auto;
}
.text-input{
    height: 24px;
    line-height: 24px;
    outline: none;
    border: 0;
    font-size: 14px;
}
</style>
