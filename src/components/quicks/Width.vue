<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="设置宽度"
            @click.stop="handleBttonClick($event)"
        >
            <fullwidth theme="outline" size="16" />
        </button>
    </div>
    <teleport to=".heditor-quickbar__dialog-body">
        <fieldset v-if="attrPannel==='width'">
            <legend>宽度设置</legend>
            <input
                v-model.lazy="utype"
                type="radio"
                value="px"
                name="w"
                :checked="blockAttrWdith.indexOf('px')>-1"
            >
            <input
                :value="blockAttrWdith.indexOf('px')>-1?unwrapUnit(blockAttrWdith):0"
                type="number"
                @change="blockAttrWdith=$event.target.value+'px'"
            >
            <span>px</span>
            <br>
            <input
                v-model.lazy="utype"
                type="radio"
                value="%"
                name="w"
                :checked="blockAttrWdith.indexOf('%')>-1"
            >
            <input
                :value="blockAttrWdith.indexOf('%')>-1?unwrapUnit(blockAttrWdith):100"
                type="number"
                @change="blockAttrWdith=$event.target.value+'%'"
            >
            <span>%</span>
            <br>
            <input
                v-model.lazy="utype"
                type="radio"
                value="auto"
                name="w"
                :checked="blockAttrWdith==='auto'"
            >
            <input value="auto" type="text" disabled>
            <br>
        </fieldset>
    </teleport>
</template>
<script>
import { defineComponent, ref, watch } from '@vue/runtime-core'
import { Fullwidth } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { unwrapUnit } from '../../use/useUtil'
export default defineComponent({
    name      : 'Width',
    components: {
        Fullwidth
    },
    setup() {
        const store = useStore()
        const { setAttrPannel, attrPannel, blockAttrWdith } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            setAttrPannel('width')
        }
        // 设置宽度，如果选择了auto进行单独处理设置为auto
        const utype = ref('px')
        watch(utype, ut => {
            if (ut === 'auto') {
                blockAttrWdith.value = 'auto'
            } else if (ut === '%') {
                blockAttrWdith.value = '100%'
            }
        })
        return {
            attrPannel,
            handleBttonClick,
            unwrapUnit,
            utype,
            blockAttrWdith
        }
    }
})
</script>
