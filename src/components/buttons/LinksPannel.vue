<template>
    <Dialog
        :description="'设置链接相关属性（输入时，选区会临时消失，确认后会自动恢复）'"
        style="width:430px; display:block;"
    >
        <template #body>
            <fieldset>
                <legend>链接设置</legend>
                <label class="left_label">地址</label>
                <input
                    v-model="links_info.url"
                    type="text"
                    placeholder="请输入链接url地址"
                    style="width:300px;"
                >
                <br>
                <label class="left_label">标题</label>
                <input
                    v-model="links_info.title"
                    type="text"
                    placeholder="请输入链接标题文本"
                    style="width:300px;"
                >
                <br>
                <label class="left_label">打开方式</label>
                <select
                    v-model="links_info.target"
                    name="opentype"
                >
                    <option disabled value="">请选择</option>
                    <option value="_blank">新页面打开</option>
                    <option value="_self">当前页打开</option>
                </select>
                <br>
                <label class="left_label">替换文本</label>
                <input
                    v-model="links_info.text"
                    type="text"
                    placeholder="请输入链接文本"
                    style="width:300px;"
                >
                <br>
                <br>
                <div class="heditor-dialog__btn heditor-dialog__btn-group right">
                    <button
                        class="heditor-dialog__btn-text cancel"
                        @click.stop="handleCancle"
                    >取消</button>
                    <button
                        v-if="range.parentNodeType.indexOf('A') > -1"
                        class="heditor-dialog__btn-text delete"
                        title="删除当前链接"
                        @click.stop="handleDelete"
                    >删除</button>
                    <button
                        class="heditor-dialog__btn-text submit"
                        @click.stop="handleSubmit"
                    >确定</button>
                </div>
            </fieldset>
        </template>
    </Dialog>
</template>
<script>
import {  defineComponent, inject, reactive } from '@vue/runtime-core'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { execCommand } from '../../use/useExecCommand'
import { getRange, reselectRange } from '../../use/useSelection'
import { htmlToFragment, isUrl } from '../../use/useUtil'
import Dialog from '../Dialog.vue'
export default defineComponent({
    name      : 'LinksPannel',
    components: { Dialog },
    props     : {
        shref: {
            type   : String,
            default: ''
        },
        stitle: {
            type   : String,
            default: ''
        },
        starget: {
            type   : String,
            default: '_blank'
        },
        stext: {
            type   : String,
            default: ''
        }
    },
    setup(props) {
        const store = useStore()
        const { setDialogFlag, range, addRecord }  = useEditor(store)
        const selectRange = inject('selectRange')
        const updateSelectRange = inject('updateSelectRange')
        // 设置的信息
        const links_info = reactive({
            url   : props.shref,
            target: props.starget || '_self',
            title : props.stitle,
            text  : props.stext
        })
        // 取消设置
        const handleCancle = () => {
            // 恢复选区
            reselectRange(selectRange.value)
            // 关闭弹窗
            setDialogFlag({
                links: false
            })
        }
        // 确认信息
        const handleSubmit = () => {
            reselectRange(selectRange.value, () => {
                // 执行命令
                if (!isUrl(links_info.url)) {
                    alert('链接地址是必须的！')
                } else {
                    execCommand({ command: 'CreateLink', value: links_info.url }, () => {
                        let r = getRange()
                        // 设置属性
                        if (links_info.title) {
                            r.startContainer.parentNode.title = links_info.title
                        }
                        r.startContainer.parentNode.setAttribute('target', links_info.target || '_blank')
                        if (links_info.text) {
                            // range.startContainer.textContent = links_info.text
                            r.deleteContents()
                            r.insertNode(htmlToFragment(links_info.text))
                        }
                        // 更新选区数据
                        updateSelectRange(r)
                        addRecord()
                    })
                }
            })
        }
        // 删除链接
        const handleDelete = () => {
            // console.log('====delete link:', range)
            if (selectRange.value) {
                // 如果已经是A标签，强制全部选择完
                if (range.value.parentNodeType.indexOf('A') > -1) {
                    execCommand({ command: 'UnLink' }, () => {
                        // 全选A标签, 更新选区
                        updateSelectRange(getRange())
                        addRecord()
                    })
                }
            }
        }
        return {
            range,
            links_info,
            handleSubmit,
            handleCancle,
            handleDelete
        }
    }
})
</script>
