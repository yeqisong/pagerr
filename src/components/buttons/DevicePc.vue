<template>
    <div
        class="heditor-toolbar__btn device-btn"
        @click.stop="mode='pc'"
    >
        <button
            :class="{
                active: mode==='pc'
            }"
            title="切换到PC模式"
        >
            <Computer theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { Computer } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
export default defineComponent({
    name      : 'DevicePc',
    components: {
        Computer
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
