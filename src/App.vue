<template>
    <div
        ref="dm"
        class="heditor"
        :class="{
            viewmode: editable===false
        }"
        :style="{
            width:size.width,
            height:size.height
        }"
    >
        <ToolBar />
        <Content />
        <QuickBar />
    </div>
</template>
<script>
import { useStore } from 'vuex'
import Content from './components/Content.vue'
import ToolBar from './components/ToolBar.vue'
import QuickBar from './components/QuickBar.vue'
import useEditor  from './use/useEditor'
import { ref } from '@vue/reactivity'
import { nextTick, provide } from '@vue/runtime-core'
export default {
    components: {
        ToolBar,
        Content,
        QuickBar
    },
    setup() {
        const { size, appPos, editable, saveRange, clearRange } = useEditor(useStore())
        // 初始设置或窗口变化时设置编辑器的位置
        const dm = ref(null)
        nextTick(() => {
            appPos.value = {
                left: dm.value.getBoundingClientRect().left,
                top : dm.value.getBoundingClientRect().top
            }
        })
        window.addEventListener('scroll', () => {
            appPos.value = {
                left: dm.value.getBoundingClientRect().left,
                top : dm.value.getBoundingClientRect().top
            }
        })
        // 提供核心选区变量和选区更新标识：用于兄弟组件之间传递
        // selectRange 当前编辑器实例中的选区
        const selectRange = ref(null)
        // rangeChange 选区有变化（安全做法，通过该变量的变化监听，更新菜单按钮状态。因为多个css在font下时，css变化但getRange并不会变化。）
        const rangeChange = ref(1)
        // 更新选区信息
        const updateSelectRange = v => {
            rangeChange.value = !rangeChange.value
            selectRange.value = v
            if (v === null) {
                clearRange()
            } else {
                saveRange()
            }
        }
        provide('selectRange', selectRange)
        provide('rangeChange', rangeChange)
        provide('updateSelectRange', updateSelectRange)
        return {
            dm,
            size,
            editable
        }
    }
}
</script>
