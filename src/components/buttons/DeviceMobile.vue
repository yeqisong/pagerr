<template>
    <div
        class="heditor-toolbar__btn device-btn"
        @click.stop="mode='mobile'"
    >
        <button
            :class="{
                active: mode==='mobile'
            }"
            title="切换到手机模式"
        >
            <iphone theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { Iphone } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
export default defineComponent({
    name      : 'DeviceMobile',
    components: {
        Iphone
    },
    props: {},
    setup() {
        const store = useStore()
        const { mode }  = useEditor(store)
        return {
            mode
        }
    }
})
</script>
