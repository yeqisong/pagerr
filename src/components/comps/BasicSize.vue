<template>
    <fieldset>
        <legend>基础尺寸</legend>
        <span v-if="description">{{ description }}</span>
        <br>
        <label class="left_label">宽度</label>
        <input
            type="text"
            name="width"
            :value="width"
            placeholder="请输入宽度，并带单位"
            @change="$emit('update:width', $event.target.value)"
        >
        <br>
        <label class="left_label">高度</label>
        <input
            type="text"
            name="height"
            :value="height"
            placeholder="请输入高度，并带单位"
            @change="$emit('update:height', $event.target.value)"
        >
    </fieldset>
</template>
<script>
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
    name : 'BasicSize',
    props: {
        width: {
            type   : String,
            default: '100%'
        },
        height: {
            type   : String,
            default: 'auto'
        },
        description: {
            type   : String,
            default: ''
        }
    },
    setup(props, { emit }) {
        return {}
    }
})
</script>
