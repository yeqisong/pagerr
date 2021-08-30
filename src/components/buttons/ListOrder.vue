<template>
    <div
        class="heditor-toolbar__btn"
        @click.stop="handleClick($event)"
    >
        <button
            title="无序列表"
        >
            <ordered-list theme="outline" size="16" />
        </button>
        <Dialog
            v-show="dialogFlag.orderlist"
            class="noheader"
        >
            <template #body>
                <button
                    v-for="(l,idx) in orders"
                    :key="idx"
                    :title="l.name"
                    class="w_btn"
                    :class="{
                        active:tg === l.type
                    }"
                    @click.stop="handleExec($event, l.type)"
                >
                    <span
                        class="list-tpe w120"
                        :class="'list-tpe-'+l.type"
                        :style="{
                            listStyleType:l.type
                        }"
                    >text</span>
                </button>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { OrderedList } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Dialog from '../Dialog.vue'
import { getRange } from '../../use/useSelection'
import { getStyleListStyleType } from '../../use/useUtil'
import { orders } from '../../blocks/listStyles'
export default defineComponent({
    name      : 'ListOrder',
    components: {
        OrderedList,
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
                orderlist: !dialogFlag.value.orderlist
            })
            return false
        }
        const tg = ref('none')
        // 执行命令
        const handleExec = (event, type) => {
            if (selectRange.value) {
                execCommand({ command: 'OrderList', value: type }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
            return false
        }
        // 实时监测选区的对齐状态
        watch(rangeChange, rc => {
            if (selectRange.value && selectRange.value.startContainer) {
                tg.value = getStyleListStyleType(selectRange.value.startContainer.parentNode)
                // console.log('====:', tg.value)
            }
        })
        return {
            tg,
            handleClick,
            dialogFlag,
            handleExec,
            orders
        }
    }
})
</script>
<style scoped>
.noheader{
    padding:12px 10px;
    min-height: 50px !important;
    height: auto !important;
    min-width: 80px !important;
    width: 100px;
}
.noheader button{
    width: 80px !important;
    text-align: left;
}
.noheader button span{
    margin-left: 40px;
    width: 40px !important;
    text-align: left;
}
.list-tpe{
    display: list-item !important;
    margin-left: 24px;
}
.noheader .align_btn {
    margin: 0px 5px;
}
span.list-tpe-none{
    margin-left: 0px !important;
}
span.list-tpe-none::before{
    content:'无';
}
</style>
