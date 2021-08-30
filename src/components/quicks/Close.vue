<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="返回"
        >
            <left theme="outline" size="16" />
        </button>
    </div>
</template>
<script>
import { defineComponent } from '@vue/runtime-core'
import { Left } from '@icon-park/vue-next'
export default defineComponent({
    name      : 'Close',
    components: {
        Left
    },
    setup() {
    }
})
</script>
