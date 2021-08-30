<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="设置高度"
            @click.stop="handleBttonClick($event)"
        >
            <sort-four theme="outline" size="16" />
        </button>
    </div>
    <teleport to=".heditor-quickbar__dialog-body">
        <fieldset v-if="attrPannel==='height'">
            <legend>高度设置</legend>
            <input
                v-model.lazy="utype"
                type="radio"
                value="px"
                name="seth"
                :checked="blockAttrHeight.indexOf('px')>-1"
            >
            <input
                :value="blockAttrHeight.indexOf('px')>-1?unwrapUnit(blockAttrHeight):0"
                type="number"
                @change="blockAttrHeight=$event.target.value+'px'"
            >
            <span>px</span>
            <br>
            <input
                v-model.lazy="utype"
                type="radio"
                value="%"
                name="seth"
                :checked="blockAttrHeight.indexOf('%')>-1"
            >
            <input
                :value="blockAttrHeight.indexOf('%')>-1?unwrapUnit(blockAttrHeight):100"
                type="number"
                @change="blockAttrHeight=$event.target.value+'%'"
            >
            <span>%</span>
            <br>
            <input
                v-model.lazy="utype"
                type="radio"
                value="auto"
                name="seth"
                :checked="blockAttrHeight==='auto'"
            >
            <input value="auto" type="text" disabled>
            <br>
        </fieldset>
    </teleport>
</template>
<script>
import { defineComponent, ref, watch } from '@vue/runtime-core'
import { SortFour } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import { unwrapUnit } from '../../use/useUtil'
import useEditor from '../../use/useEditor'
export default defineComponent({
    name      : 'Height',
    components: {
        SortFour
    },
    setup() {
        const store = useStore()
        const { attrPannel, blockAttrHeight, setAttrPannel } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            setAttrPannel('height')
        }
        const utype = ref('px')
        watch(utype, ut => {
            if (ut === 'auto') {
                blockAttrHeight.value = 'auto'
            } else if (ut === '%') {
                blockAttrHeight.value = '100%'
            }
        })
        return {
            unwrapUnit,
            handleBttonClick,
            utype,
            attrPannel,
            blockAttrHeight
        }
    }
})
</script>
