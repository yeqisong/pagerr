<template>
    <div class="heditor-toolbar__btn">
        <button
            title="表格"
            @click="handleClick($event)"
        >
            <insert-table theme="outline" size="16" />
        </button>
        <Dialog
            v-show="dialogFlag.tables"
            class="noheader"
        >
            <template #body>
                <div class="select-tables">
                    <table>
                        <tr v-for="i in new Array(10).keys()" :key="i">
                            <td
                                v-for="j in new Array(10).keys()"
                                :key="j"
                                :data-row="i"
                                :data-col="j"
                                :class="{
                                    shover: (tableN.row>=i && tableN.col>=j)
                                }"
                                @mousemove="handleMove($event)"
                                @click.stop="handleTableNClick($event)"
                            >&nbsp;</td>
                        </tr>
                    </table>
                    <div class="select-tables__tip">{{ parseInt(tableN.row)+1 }}×{{ parseInt(tableN.col)+1 }}</div>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script>
import { defineComponent, inject, reactive, ref, watch } from 'vue'
import { execCommand } from '../../use/useExecCommand'
import { InsertTable } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { getRange, isEffectRange, reselectRange } from '../../use/useSelection'
import {  createTableByRowCol, getStyleColor } from '../../use/useUtil'
import Dialog from '../Dialog.vue'
import Xtable from '../../class/Xtable'
export default defineComponent({
    name      : 'Tables',
    components: {
        InsertTable,
        Dialog
    },
    props: {},
    setup() {
        const store = useStore()
        const { addRecord, dialogFlag, setDialogFlag }  = useEditor(store)
        const selectRange = inject('selectRange')
        const rangeChange = inject('rangeChange')
        const updateSelectRange = inject('updateSelectRange')
        // 选择的表格个数
        const tableN = reactive({
            row: 0,
            col: 0
        })
        // 按钮点击
        const handleClick = event => {
            if (!selectRange.value) {
                return false
            }
            // 是否是有效选区
            if (isEffectRange(selectRange.value.endContainer)) {
                // 设置本开关状态，强制关闭其它状态
                setDialogFlag({
                    tables: !dialogFlag.value.tables
                })
                tableN.row = 0
                tableN.col = 0
            }
        }
        // 选择表格
        const handleMove = event => {
            tableN.row = event.target.dataset.row
            tableN.col = event.target.dataset.col
        }
        // 确认表格
        const handleTableNClick = event => {
            tableN.row = event.target.dataset.row
            tableN.col = event.target.dataset.col
            // 插入
            if (selectRange.value) {
                // 获取table源码
                let talhtml = createTableByRowCol(tableN.row, tableN.col)
                let talnode = Xtable(talhtml).table[0]
                execCommand({ command: 'InsertTable', value: talnode }, () => {
                    updateSelectRange(getRange())
                    addRecord()
                })
            }
            return false
        }
        return {
            tableN,
            dialogFlag,
            handleClick,
            handleMove,
            handleTableNClick
        }
    }
})
</script>
<style scoped>
.noheader .select-tables{
    width: 150px;
    height: 180px;
    padding: 10px 0px;
}
.noheader table{
    border-collapse: collapse;
    border: 1px solid #555;
    border: 1px solid var(--hdbtnTextNormal);
    width: 150px;
    height: 150px;
    border-spacing: 0;
}
.noheader table td{
    border-collapse:collapse;
    border: 1px solid #555;
    border: 1px solid var(--hdbtnTextNormal);
    width:15px;
    height: 15px;
    line-height: 0px;
    font-size: 0px;
    transition: all .5s;
}
.noheader table td.shover{
    background-color: #409EFF;
    background-color: var(--hdprimary);
}
.noheader .select-tables__tip{
    height: 20px;
    line-height: 20px;
    text-align: center;
    margin-top: 5px;
    width: 100%;
}
</style>
