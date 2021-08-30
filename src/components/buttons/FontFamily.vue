<template>
    <div
        class="heditor-toolbar__btn full_width_btn"
    >
        <button title="设置字体" :style="{fontFamily: rtagflag}">
            <span v-if="!dialogFlag.fontfamily" class="text-icon f14 " @click.stop="handleClick($event)">
                {{ rtagflag }}
            </span>
            <input
                v-if="dialogFlag.fontfamily"
                type="text"
                class="text-input"
                :value="rtagflag"
                @change="handleExec($event,$event.target.value)"
            >
        </button>
        <Dialog
            v-show="dialogFlag.fontfamily"
            class="noheader"
        >
            <template #body>
                <button
                    v-for="(f,idx) in FF"
                    :key="idx"
                    :title="f.name"
                    :class="{active:rtagflag === f.name}"
                    :style="{
                        fontFamily: f.fontFamily
                    }"
                    class="w120"
                    @click.stop="handleExec($event,f.fontFamily)"
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
import { getStyleFontFamily } from '../../use/useUtil'
import FF from '../../blocks/fontFamily'
export default defineComponent({
    name      : 'FontFamily',
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
        // 字体设置
        // 按钮点击
        const handleClick = event => {
            // 设置本开关状态，强制关闭其它状态
            setDialogFlag({
                fontfamily: !dialogFlag.value.fontfamily
            })
            return false
        }
        // 执行命令
        const handleExec = (event, type) => {
            // 恢复选区后，执行命令
            reselectRange(selectRange.value)
            // 执行字号命令
            if (selectRange.value && selectRange.value.startContainer) {
                execCommand({ command: 'FontFamily', value: type }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                    // console.log('fontsize new range:', getRange().cloneRange())
                })
            }
            return false
        }
        // 实时监测选区的对齐状态
        const rtagflag = ref('sans-serif')
        watch(rangeChange, rc => {
            // 第一次新选区时，检查父类中有无span或font，且包含font-size，实时更新当前的字号
            if (selectRange.value && selectRange.value.startContainer) {
                // console.log('fontsize watch===:', getStyleFontFamily(selectRange.value.startContainer.parentNode).split(',')[0].replace(/\"/g, ''))
                rtagflag.value = getStyleFontFamily(selectRange.value.startContainer.parentNode).split(',')[0].replace(/\"/g, '')
            }
        })
        return {
            rtagflag,
            FF,
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
    width: 140px;
}
.full_width_btn, .full_width_btn button,  .full_width_btn button span, .full_width_btn button input{
    width: 60px !important;
    text-align: center;
}
.noheader .align_btn {
    margin: 0px 5px;
}
.noheader button, .noheader button span{
    width: 120px !important;
    text-align: left;
}
.full_width_btn button span, .noheader button span{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
