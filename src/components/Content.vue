<template>
    <div
        class="heditor-content"
        :class="{
            mobile: mode==='mobile'
        }"
        :style="{
            width: size.innerWidth
        }"
        @scroll="handleScroll($event)"
    >
        <div
            ref="contdom"
            class="heditor-content__canvas"
            :contenteditable="editable"
            @keydown="handleKeyDown($event)"
            @keyup="handleKeyUp($event)"
            @mouseover="handleMousemove($event)"
            @click.stop="handleSelect($event)"
            v-html="content"
        />
    </div>
</template>
<script>
import { defineComponent, inject, nextTick, provide, ref, watch } from 'vue'
import {  insertAtRange, getRange } from '../use/useSelection'
import { closestNode,  closestNodeByNode, debounce, domObserver, uuid } from '../use/useUtil'
import Selector from '../class/Selector'
import Xtable from '../class/Xtable'
import { useStore } from 'vuex'
import useEditor from '../use/useEditor'
import blocks from '../blocks'
export default defineComponent({
    components: { },
    props     : {},
    setup() {
        const store = useStore()
        const { editable, setScroll, mode, size, setScrollDst, content, setTmpContent, addRecord, setDialogFlag,
            range, saveRange, clearRange, setQuick, setBlockAttrDft, blockAttrClear,
            blockAttr, setAttrPannel, updateElementStyle, updateElementRealSize } = useEditor(store)
        const contdom = ref(null)
        // 监听编辑区有无元素被选中
        const updateSelectRange = inject('updateSelectRange')
        const handleSelect = event => {
            // 更新当前选区
            updateSelectRange(getRange().cloneRange())
            // 关闭所有菜单弹窗
            setDialogFlag(false)
            return false
        }
        // 除编辑区域外，或指定元素包含data-clearRange=false的元素外，都取消range数据
        document.addEventListener('click', event => {
            // 如果起点在编辑器，松开时在页面其它区域，则视为编辑器，恢复在编辑器选中
            let r = getRange().cloneRange()
            // console.log('---:', r, closestNodeByNode(r.startContainer.parentNode, contdom.value))
            if ((r.startContainer.parentNode.classList && r.startContainer.parentNode.classList.contains('heditor-content__canvas')) || closestNodeByNode(r.startContainer.parentNode, contdom.value)) {
                // console.log('effect click! out canvas!')
                handleSelect(event)
                // contdom.click()
            } else {
                setDialogFlag(false)
                updateSelectRange(null)
                // 优化节点数据
                if (contdom.value) {
                    contdom.value.normalize()
                }
            }
        })
        // 编辑区内容变化保存到store临时数据中
        nextTick(() => {
            // 监听内容区域，有变化就保存到临时内容中
            domObserver(contdom.value, (mt, ob) => {
                // 保存当前正在编辑的内容
                setTmpContent(contdom.value.innerHTML)
            })
        })
        // 监听keydown事件
        const handleKeyDown = event => {
            let key = window.event ? event.keyCode : event.which
            if (key.toString() === '13') {
                event.preventDefault()
                insertAtRange('<br/> ')
                // insertAtRange('<p></p>')
            }
            return false
        }
        // 监听keyup事件
        const handleKeyUp = debounce(event => {
            // 记录历史记录
            addRecord()
        }, 1000)
        // 监听滚动
        const handleScroll = debounce(event => {
            setScrollDst(event.target.scrollTop)
            // console.log('2:', event.target.scrollTop)
            if (event.target.scrollTop > 34) {
                setScroll(1)
            } else {
                setScroll(0)
            }
        }, 200)
        // 元素监听，使用快捷菜单对起进行编辑
        const handleMousemove = debounce(event => {
            // console.log('$$$$:', event.target.className)
            let d = event.target
            if (event.target.classList && event.target.classList.contains('pagerr-edit')) {
                /**
                 * 设置block的快捷菜单
                 */
                // 组件名称
                let block_name = d.dataset.name
                // 当前组件信息
                let block_info = blocks.filter(b => b.name === block_name)[0]
                // 可编辑标识
                let block_element_editable = d.dataset.editable
                // console.log('==========:', block_name, block_info, block_element_editable)
                // 为当前元素生成唯一class标识
                let cls = d.dataset.marked
                if (!cls) {
                    // 添加class标识
                    cls = 'm' + uuid()
                    d.dataset.marked = cls
                    d.classList.add(cls)
                }
                // 如果再次进入，当前class未变，则强制关闭属性编辑框
                // console.log('=====:', blockAttr.className, cls)
                if (blockAttr.value.className !== cls) {
                    setAttrPannel(false)
                }
                // console.log('1:', block_name, block_info, block_element_editable, block_info.editable[block_element_editable])
                // console.log('1:', event.target.getBoundingClientRect().top, contdom.value.getBoundingClientRect().top)
                // 设置快捷菜单
                setQuick({
                    display: true,
                    x      : event.target.getBoundingClientRect().left,
                    y      : event.target.getBoundingClientRect().top - contdom.value.getBoundingClientRect().top + 30,
                    btns   : block_info.editable[block_element_editable]
                })
                // 设置正在编辑的元素默认值
                setBlockAttrDft(Selector(d), {
                    className: cls
                })
                updateElementRealSize(Selector(d))
            } else if (event.target.nodeName === 'A') {
                /**
                 * 设置A的快捷菜单
                 */
                setQuick({
                    display: true,
                    x      : event.target.getBoundingClientRect().left,
                    y      : event.target.getBoundingClientRect().top - contdom.value.getBoundingClientRect().top + 30,
                    btns   : ['viewLink', 'editLink']
                })
            } else if (closestNode('TABLE', event.target)) {
                /**
                 * 设置table的快捷菜单和操作
                 */
                let table = closestNode('TABLE', event.target)
                // console.log('content tbl:', tbl)
                // 快捷操作
                setQuick({
                    display: true,
                    x      : table.getBoundingClientRect().left,
                    y      : table.getBoundingClientRect().top - contdom.value.getBoundingClientRect().top + 30,
                    btns   : ['tableSize', 'tableBorder'],
                    d      : table.dataset.htable
                })
            } else {
                setQuick({
                    display: false,
                    btns   : [],
                    d      : null
                })
                // 清空当前正在编辑元素
                blockAttrClear()
                // 隐藏属性编辑面板
                setAttrPannel(false)
            }
        }, 100)
        // 监听编辑元素的变化，将属性更新到其元素的上
        watch(blockAttr.value, ba => {
            let ele = document.querySelector('.' + ba.className)
            if (ba.className && ele) {
                updateElementStyle(Selector(ele), ba)
                // 元素更新后，更新元素绝对尺寸数据
                nextTick(() => {
                    if (!ba.initDef) {
                        addRecord()
                    }
                    updateElementRealSize(Selector(ele))
                })
            }
        })
        return {
            mode,
            contdom,
            editable,
            size,
            content,
            // handleClick,
            handleSelect,
            handleKeyDown,
            handleKeyUp,
            handleScroll,
            handleMousemove
        }
    }
})
</script>
