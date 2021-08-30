<template>
    <div
        class="heditor-quickbar__btn"
    >
        <button
            title="设置图片"
            @click.stop="handleBttonClick($event)"
        >
            <Picture theme="outline" size="16" />
        </button>
    </div>
    <teleport to=".heditor-quickbar__dialog-body">
        <fieldset v-if="attrPannel==='image'">
            <legend>图片设置</legend>
            <label class="left_label">图片裁剪</label>
            <select v-model="blockAttrObjectFit" name="bsize" :class="{disabled: !blockAttrObjectFit}">
                <option disabled value="">请选择</option>
                <option value="fill">fill</option>
                <option value="contain">contain</option>
                <option value="cover">cover</option>
                <option value="none">none</option>
                <option value="scale-down">scale-down</option>
                <option value="initial">initial</option>
            </select>
            <br>
            <label class="left_label">图片文本</label>
            <input
                :value="blockAttrImageAlt || ''"
                type="text"
                placeholder="请输入图片Alt文本"
                @change="blockAttrImageAlt=$event.target.value"
            >
            <div class="b-img-wrap">
                <div
                    class="b-img-wrap__tip"
                    :style="{
                        transform:`translate3d(0, ${(290/blockAttr.realWidth)*blockAttr.realHeight/2-15}px,0)`
                    }"
                >
                    +{{ blockAttrImageSrc?'更换':'选择' }}图片
                </div>
                <img
                    class="b-img-wrap__m"
                    :src="blockAttrImageSrc"
                    :style="{
                        width: wrapUnit(blockAttr.realWidth),
                        transform: `scale(${290/blockAttr.realWidth<1 ? 290/blockAttr.realWidth : 1})`,
                        transformOrigin: '0 0',
                        objectFit: blockAttrObjectFit
                    }"
                    @click.stop="chooseImg"
                >
            </div>
            <input v-show="false" ref="imger" type="file" accept="images/*" @change="uploadImg($event)">
        </fieldset>
    </teleport>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { Picture } from '@icon-park/vue-next'
import useEditor from '../../use/useEditor'
import { wrapUnit } from '../../use/useUtil'
export default defineComponent({
    name      : 'Image',
    components: {
        Picture
    },
    setup() {
        const store = useStore()
        const { setAttrPannel, attrPannel, blockAttr, blockAttrWdith, blockAttrImageSrc, blockAttrImageAlt, blockAttrObjectFit } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            setAttrPannel('image')
        }
        // 触发图片选择
        const { proxy } = getCurrentInstance()
        const imger = ref(null)
        const chooseImg = () => {
            proxy.$uploadImg().then(file_url => {
                blockAttrImageSrc.value = file_url
            }).catch(error => {
                // 如果未配置，则转为base64
                if (error === 'base64') {
                    imger.value.click()
                } else if (error === 'cancel') {
                    console.log('upload cancel!')
                } else {
                    // 如果上传出错，提示错误
                    alert(error)
                }
            })
        }
        // 上传图片
        const uploadImg  = event => {
            // 用户选择的文件信息
            let local_file = event.target.files[0]
            let reader = new FileReader()
            reader.onload = data => {
                let res = data.target || data.srcElement
                if (!res.result) {
                    alert('图片上传失败')
                } else {
                    blockAttrImageSrc.value = res.result
                }
            }
            if (!local_file) { return }
            reader.readAsDataURL(local_file)
        }
        return {
            wrapUnit,
            attrPannel,
            handleBttonClick,
            blockAttr,
            blockAttrWdith,
            imger,
            chooseImg,
            uploadImg,
            blockAttrImageSrc,
            blockAttrObjectFit,
            blockAttrImageAlt
        }
    }
})
</script>
