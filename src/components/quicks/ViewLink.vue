<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="查看链接"
            @click.stop="handleBttonClick($event)"
        >
            <preview-open theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent, inject } from '@vue/runtime-core'
import { PreviewOpen } from '@icon-park/vue-next'
import { openWindow } from '../../use/useUtil'
export default defineComponent({
    name      : 'ViewLink',
    components: {
        PreviewOpen
    },
    setup() {
        const selectRange = inject('selectRange')
        // 点击
        const handleBttonClick = event => {
            // console.log('sss:', selectRange.value.startContainer.parentNode.getAttribute('href'))
            let hrf = selectRange.value.startContainer.parentNode.getAttribute('href')
            if (hrf) {
                openWindow(hrf)
            }
        }
        return {
            handleBttonClick
        }
    }
})
</script>
