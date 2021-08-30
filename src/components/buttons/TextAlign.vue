<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            title="水平对齐"
        >
            <align-text-left v-show="rtextAlign === 'justifyLeft'" theme="outline" size="16" />
            <align-text-center v-show="rtextAlign === 'justifyCenter'" theme="outline" size="16" />
            <align-text-right v-show="rtextAlign === 'justifyRight'" theme="outline" size="16" />
            <align-text-both v-show="rtextAlign === 'justifyFull'" theme="outline" size="16" />
        </button>
        <Dialog
            v-show="dialogFlag.align"
            class="noheader"
        >
            <template #body>
                <button title="左对齐" class="align_btn" :class="{active:rtextAlign === 'justifyLeft'}">
                    <align-text-left theme="outline" size="16" @click="handleExec($event, 'justifyLeft')" />
                </button>
                <br>
                <button title="居中对齐" class="align_btn" :class="{active:rtextAlign === 'justifyCenter'}">
                    <align-text-center theme="outline" size="16" @click="handleExec($event, 'justifyCenter')" />
                </button>
                <br>
                <button title="右对齐" class="align_btn" :class="{active:rtextAlign === 'justifyRight'}">
                    <align-text-right theme="outline" size="16" @click="handleExec($event, 'justifyRight')" />
                </button>
                <br>
                <button title="两端对齐" class="align_btn" :class="{active:rtextAlign === 'justifyFull'}">
                    <align-text-both theme="outline" size="16" @click="handleExec($event, 'justifyFull')" />
                </button>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { AlignTextBoth, AlignTextLeft, AlignTextCenter, AlignTextRight } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Dialog from '../Dialog.vue'
import { getRange } from '../../use/useSelection'
export default defineComponent({
    name      : 'TextAlign',
    components: {
        AlignTextBoth, AlignTextLeft, AlignTextCenter, AlignTextRight,
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
                align: !dialogFlag.value.align
            })
            return false
        }
        // 执行命令
        const handleExec = (event, type) => {
            if (selectRange.value) {
                execCommand({ command: 'TextAlign', value: type }, () => {
                    updateSelectRange(getRange())
                    // saveRange()
                    addRecord()
                })
            }
            return false
        }
        // 实时监测选区的对齐状态
        const rtextAlign = ref('justifyLeft')
        watch(rangeChange, rc => {
            if (selectRange.value && selectRange.value.startContainer) {
                rtextAlign.value = document.queryCommandState('justifyLeft') ? 'justifyLeft'
                    : document.queryCommandState('justifyCenter') ? 'justifyCenter'
                        : document.queryCommandState('justifyRight') ? 'justifyRight'
                            : document.queryCommandState('justifyFull') ? 'justifyFull' : 'justifyLeft'
            }
        })
        return {
            rtextAlign,
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
    height: 50px !important;
    min-width: 160px !important;
    width: 160px;
}
.noheader .align_btn {
    margin: 0px 5px;
}
</style>
