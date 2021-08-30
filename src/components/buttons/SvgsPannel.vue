<template>
    <Dialog
        :description="'请选择图标，点击插入页面光标处或替换图标'"
        class="heditor-dialog__list"
        style="width:500px; display:block;"
    >
        <template #body>
            <div
                v-for="(sg, index) in pages.icons"
                :key="sg"
                :data-svgname="index"
                class="heditor-dialog__list_i"
                @click.stop="handleIconsSelect($event)"
            >
                <svg class="bi" width="16" height="16" fill="currentColor">
                    <use :xlink:href="'#'+index" />
                </svg>
            </div>
        </template>
        <template #footer>
            <div class="heditor-dialog__list-pager">
                <ul
                    @click.stop="handlePageerClick($event)"
                >
                    <li
                        v-for="i in pages.plist"
                        :key="i"
                        class="heditor-dialog__list-pager-li"
                        :class="{
                            current: i===cur_page_num
                        }"
                        :data-pnum="i"
                    >{{ i+1 }}</li>
                </ul>
            </div>
        </template>
    </Dialog>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import Svgs from '../../blocks/bootsvgs.js'
import Dialog from '../Dialog.vue'
import useEditor from '../../use/useEditor.js'
import { ajax } from '../../use/useUtil.js'
export default defineComponent({
    name      : 'SvgsPannel',
    components: {
        Dialog
    },
    props: {
        currentPageNum: {
            type   : Number,
            default: 0
        }
    },
    emits: ['selectSvg'],
    setup(props, { emit }) {
        const store = useStore()
        const { range } = useEditor(store)
        // 图标分页信息
        const cur_page_num = ref(props.currentPageNum)
        const svgskeys = Object.keys(Svgs)
        const page_total = svgskeys.length
        const pages = computed(() => ({
            icons: ((c, t) => {
                let tmp = {}
                for (let i = c * 100; i <= (c + 1) * 100 && i < page_total; i++) {
                    tmp[svgskeys[i]] = Svgs[svgskeys[i]]
                }
                return tmp
            })(cur_page_num.value, page_total),
            plist: ((c, t) => [...new Array(Math.floor(t / 100)).keys()])(cur_page_num.value, page_total)
        }))
        // 分页点击
        const handlePageerClick = event => {
            if (event.target.classList.contains('heditor-dialog__list-pager-li') && (!event.target.classList.contains('current'))) {
                cur_page_num.value = parseInt(event.target.dataset.pnum)
            }
        }
        // 选择图标
        const { proxy } = getCurrentInstance()
        const handleIconsSelect = event => {
            // 远程获取svg内容
            ajax({
                url: `${proxy.$svgurl}${event.currentTarget.dataset.svgname}.svg`,
                success(res) {
                    emit('selectSvg', res)
                }
            })
        }
        return {
            page_total,
            cur_page_num,
            pages,
            handlePageerClick,
            handleIconsSelect
        }
    }
})
</script>
<style scoped>
.heditor-dialog__list_i:hover{
    color: #409eff;
    color: var(--hdprimary);
}
</style>
