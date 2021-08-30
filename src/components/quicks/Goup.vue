<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="向上移"
            :class="{
                disabled: !hsactive
            }"
            @click.stop="handleBttonClick($event)"
        >
            <up-two theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, nextTick, ref } from '@vue/runtime-core'
import { UpTwo } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import Selector from '../../class/Selector'
export default defineComponent({
    name      : 'Goup',
    components: {
        UpTwo
    },
    setup() {
        const store = useStore()
        const { blockAttr, addRecord, setQuick } = useEditor(store)
        // 显示属性编辑菜单
        const hsactive = ref(true)
        const handleBttonClick = event => {
            Selector('.' + blockAttr.value.className).up()
            setQuick({
                display: false
            })
            nextTick(() => {
                addRecord()
                // 更新按钮状态
                if (blockAttr.value.className && Selector('.' + blockAttr.value.className).hasPreviousElement()) {
                    hsactive.value = true
                } else {
                    hsactive.value = false
                }
            })
        }
        if (blockAttr.value.className && Selector('.' + blockAttr.value.className).hasPreviousElement()) {
            hsactive.value = true
        } else {
            hsactive.value = false
        }
        return {
            handleBttonClick,
            hsactive
        }
    }
})
</script>
