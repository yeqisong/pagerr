<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            title="设置标题"
        >
            <H1 v-show="rtagflag === 'H1'" theme="outline" size="16" />
            <H2 v-show="rtagflag === 'H2'" theme="outline" size="16" />
            <H3 v-show="rtagflag === 'H3'" theme="outline" size="16" />
            <level-four-title v-show="rtagflag === 'H4'" theme="outline" size="16" />
            <level-five-title v-show="rtagflag === 'H5'" theme="outline" size="16" />
            <level-six-title v-show="rtagflag === 'H6'" theme="outline" size="16" />
            <Text v-show="rtagflag === 'P'" theme="outline" size="16" />
        </button>
        <Dialog
            v-show="dialogFlag.heading"
            class="noheader"
        >
            <template #body>
                <button title="1级标题" class="align_btn" :class="{active:rtagflag === 'H1'}">
                    <H1 theme="outline" size="16" @click="handleExec($event, 'H1')" />
                </button>
                <br>
                <button title="2级标题" class="align_btn" :class="{active:rtagflag === 'H2'}">
                    <H2 theme="outline" size="16" @click="handleExec($event, 'H2')" />
                </button>
                <br>
                <button title="3级标题" class="align_btn" :class="{active:rtagflag === 'H3'}">
                    <H3 theme="outline" size="16" @click="handleExec($event, 'H3')" />
                </button>
                <br>
                <button title="4级标题" class="align_btn" :class="{active:rtagflag === 'H4'}">
                    <level-four-title theme="outline" size="16" @click="handleExec($event, 'H4')" />
                </button>
                <button title="5级标题" class="align_btn" :class="{active:rtagflag === 'H5'}">
                    <level-five-title theme="outline" size="16" @click="handleExec($event, 'H5')" />
                </button>
                <br>
                <button title="6级标题" class="align_btn" :class="{active:rtagflag === 'H6'}">
                    <level-six-title theme="outline" size="16" @click="handleExec($event, 'H6')" />
                </button>
                <button title="正文" class="align_btn" :class="{active:rtagflag === 'P'}">
                    <Text theme="outline" size="16" @click="handleExec($event, 'P')" />
                </button>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { H1, H2, H3, LevelFourTitle, LevelFiveTitle, LevelSixTitle,  Text } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Dialog from '../Dialog.vue'
import { closestNode, htmlToFragment } from '../../use/useUtil'
import { getRange, insertInRange } from '../../use/useSelection'
export default defineComponent({
    name      : 'TextHeading',
    components: {
        H1, H2, H3, LevelFourTitle, LevelFiveTitle, LevelSixTitle, Text,
        Dialog
    },
    props: {},
    setup() {
        const store = useStore()
        const { addRecord, range, saveRange, dialogFlag, setDialogFlag }  = useEditor(store)
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 按钮点击
        const handleClick = event => {
            // expandRange()
            // 设置本开关状态，强制关闭其它状态
            setDialogFlag({
                heading: !dialogFlag.value.heading
            })
            return false
        }
        // 执行命令
        const rtagflag = ref('P')
        const handleExec = (event, type) => {
            if (selectRange.value) {
                if (type !== 'P') {
                    execCommand({ command: 'Heading', value: type }, () => {
                        updateSelectRange(getRange())
                        // saveRange()
                        addRecord()
                        // console.log('h2 range:', getRange())
                    })
                } else if (type === 'P') {
                    // 标题转变为段落特殊处理，把标题标签去掉即可
                    let f = closestNode(rtagflag.value, getRange().startContainer)
                    if (f) {
                        let rg = getRange()
                        rg.setStartBefore(f)
                        rg.setEndAfter(f)
                        insertInRange(htmlToFragment(f.innerHTML))
                        updateSelectRange(getRange())
                        // saveRange()
                        addRecord()
                    }
                }
            }
            return false
        }
        // 实时监测选区的对齐状态
        watch(rangeChange, rc => {
            let r = range.value
            if (r && r.parentNodeType && r.parentNodeType.indexOf('H1') > -1) {
                rtagflag.value = 'H1'
            } else if (r && r.parentNodeType && r.parentNodeType.indexOf('H2') > -1) {
                rtagflag.value = 'H2'
            } else if (r && r.parentNodeType && r.parentNodeType.indexOf('H3') > -1) {
                rtagflag.value = 'H3'
            } else if (r && r.parentNodeType && r.parentNodeType.indexOf('H4') > -1) {
                rtagflag.value = 'H4'
            } else if (r && r.parentNodeType && r.parentNodeType.indexOf('H5') > -1) {
                rtagflag.value = 'H5'
            } else if (r && r.parentNodeType && r.parentNodeType.indexOf('H6') > -1) {
                rtagflag.value = 'H6'
            } else {
                rtagflag.value = 'P'
            }
        })
        return {
            rtagflag,
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
    width: 260px;
}
.noheader .align_btn {
    margin: 0px 5px;
}
</style>
