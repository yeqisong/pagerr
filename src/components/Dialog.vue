<template>
    <transition name="fade">
        <div class="heditor-dialog" @click.stop="function(){return false}">
            <div class="heditor-dialog__header">
                <div v-if="title" class="heditor-dialog__header_title">{{ title }}</div>
                <div v-if="description" class="heditor-dialog__header_description">{{ description }}</div>
                <slot name="header" />
            </div>
            <div class="heditor-dialog__body">
                <slot name="body" />
            </div>
            <div class="heditor-dialog__footer">
                <slot name="footer" />
            </div>
        </div>
    </transition>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name : 'Dialog',
    props: {
        title: {
            type   : String,
            default: undefined
        },
        description: {
            type   : String,
            default: undefined
        }
    },
    setup() {
        return {}
    }
})
</script>
<style lang="stylus" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
