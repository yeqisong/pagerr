<template>
    <div
        class="heditor-quickbar__btn"
        @click.stop="handleBttonClick($event)"
    >
        <button
            title="设置背景图"
        >
            <lattice-pattern theme="outline" size="16" />
        </button>
    </div>
    <teleport to=".heditor-quickbar__dialog-body">
        <fieldset v-if="attrPannel==='background'">
            <legend>背景参数</legend>
            <label class="left_label">颜色</label>
            <popu-color-picker v-model:color="blockAttrBackgroundColor" mode="fk" :picker-props="{format:'hex8'}" />
            <br>
            <label class="left_label">位置</label>
            <select v-model="blockAttrBackgroundPosition" name="bpostion" :class="{disabled: !blockAttrBackgroundPosition}">
                <option disabled value="">请选择</option>
                <option value="0% 0%">0% 0%</option>
                <option value="left top">left top</option>
                <option value="center top">center top</option>
                <option value="right top">right top</option>
                <option value="left center">left center</option>
                <option value="center center">center center</option>
                <option value="right center">right center</option>
                <option value="left bottom">left bottom</option>
                <option value="center bottom">center bottom</option>
                <option value="right bottom">right bottom</option>
            </select>
            <br>
            <label class="left_label">大小</label>
            <select v-model="blockAttrBackgroundSize" name="bsize" :class="{disabled: !blockAttrBackgroundSize}">
                <option disabled value="">请选择</option>
                <option value="auto">auto</option>
                <option value="cover">cover</option>
                <option value="contain">contain</option>
                <option value="50% 50%">50% 50%</option>
                <option value="100% 100%">100% 100%</option>
            </select>
            <br>
            <label class="left_label">重复</label>
            <select v-model="blockAttrBackgroundRepeat" name="brepeat" :class="{disabled: !blockAttrBackgroundRepeat}">
                <option disabled value="">请选择</option>
                <option value="repeat">repeat</option>
                <option value="no-repeat">no-repeat</option>
                <option value="repeat-x">repeat-x</option>
                <option value="repeat-y">repeat-y</option>
            </select>
            <br>
            <label class="left_label">定位区域</label>
            <select v-model="blockAttrBackgroundOrigin" name="borigin" :class="{disabled: !blockAttrBackgroundOrigin}">
                <option disabled value="">请选择</option>
                <option value="padding-box">padding-box</option>
                <option value="border-box">border-box</option>
                <option value="content-box">content-box</option>
            </select>
            <br>
            <label class="left_label">绘制区域</label>
            <select v-model="blockAttrBackgroundClip" name="bclip" :class="{disabled: !blockAttrBackgroundClip}">
                <option disabled value="">请选择</option>
                <option value="border-box">border-box</option>
                <option value="padding-box">padding-box</option>
                <option value="content-box">content-box</option>
            </select>
            <br>
            <label class="left_label">视差效果</label>
            <select v-model="blockAttrBackgroundAttachment" name="battachment" :class="{disabled: !blockAttrBackgroundAttachment}">
                <option disabled value="">请选择</option>
                <option value="scroll">scroll</option>
                <option value="fixed">fixed</option>
            </select>
            <br>
        </fieldset>
        <fieldset v-if="attrPannel==='background'">
            <legend>背景图片</legend>
            <div class="b-img-wrap">
                <div
                    class="b-img-wrap__tip"
                    :style="{
                        transform:`translate3d(0, ${(290/blockAttr.realWidth)*blockAttr.realHeight/2-15}px,0)`
                    }"
                >
                    +{{ blockAttrBackgroundImage?'更换':'选择' }}图片
                </div>
                <div
                    class="b-img-wrap__m"
                    :style="{
                        backgroundImage: blockAttrBackgroundImage,
                        width:wrapUnit(blockAttr.realWidth),
                        height:wrapUnit(blockAttr.realHeight),
                        transform: `scale(${290/blockAttr.realWidth})`,
                        transformOrigin:'0 0',
                        backgroundColor: blockAttrBackgroundColor,
                        backgroundPosition: blockAttrBackgroundPosition,
                        backgroundSize: blockAttrBackgroundSize,
                        backgroundRepeat: blockAttrBackgroundRepeat,
                        backgroundOrigin: blockAttrBackgroundOrigin,
                        backgroundClip: blockAttrBackgroundClip,
                        backgroundAttachment: blockAttrBackgroundAttachment
                    }"
                    @click.stop="chooseImg"
                />
            </div>
            <input v-show="false" ref="imger" type="file" accept="images/*" @change="uploadImg($event)">
        </fieldset>
    </teleport>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { LatticePattern } from '@icon-park/vue-next'
import { useStore } from 'vuex'
import useEditor from '../../use/useEditor'
import { wrapUnit, unwrapUnit } from '../../use/useUtil'
export default defineComponent({
    name      : 'BackgroundImage',
    components: {
        LatticePattern
    },
    setup() {
        const store = useStore()
        const { attrPannel, setAttrPannel, blockAttr, blockAttrBackgroundImage,
            blockAttrBackgroundColor, blockAttrBackgroundPosition, blockAttrBackgroundSize,
            blockAttrBackgroundRepeat, blockAttrBackgroundOrigin, blockAttrBackgroundClip, blockAttrBackgroundAttachment } = useEditor(store)
        // 显示属性编辑菜单
        const handleBttonClick = event => {
            setAttrPannel('background')
        }
        const color = ref('#ff6900')
        // 触发图片选择
        const { proxy } = getCurrentInstance()
        const imger = ref(null)
        const chooseImg = () => {
            proxy.$uploadImg().then(file_url => {
                blockAttrBackgroundImage.value = `url(${file_url})`
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
                    blockAttrBackgroundImage.value = `url(${res.result})`
                }
            }
            if (!local_file) { return }
            reader.readAsDataURL(local_file)
        }
        return {
            attrPannel,
            handleBttonClick,
            wrapUnit,
            unwrapUnit,
            color,
            imger,
            chooseImg,
            uploadImg,
            blockAttr,
            blockAttrBackgroundImage,
            blockAttrBackgroundColor,
            blockAttrBackgroundPosition,
            blockAttrBackgroundSize,
            blockAttrBackgroundRepeat,
            blockAttrBackgroundOrigin,
            blockAttrBackgroundClip,
            blockAttrBackgroundAttachment
        }
    }
})
</script>
