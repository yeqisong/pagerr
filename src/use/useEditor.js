import { computed, nextTick } from 'vue'
import { getSelection } from './useSelection'
import { getAllNodeName, unwrapUnit } from './useUtil'
// dom样式操作工厂
const du = {
    // 设置width样式
    width: (dm, vl) => {
        dm.width(vl)
    },
    backgroundImage: (dm, vl) => {
        // console.log('2:', vl)
        dm.css({
            backgroundImage: vl
        })
    },
    backgroundColor: (dm, vl) => {
        dm.css({
            backgroundColor: vl
        })
    },
    backgroundPosition: (dm, vl) => {
        dm.css({
            backgroundPosition: vl
        })
    },
    backgroundSize: (dm, vl) => {
        // console.log('2:', vl)
        dm.css({
            backgroundSize: vl
        })
    },
    backgroundRepeat: (dm, vl) => {
        // console.log('2:', vl)
        dm.css({
            backgroundRepeat: vl
        })
    },
    backgroundOrigin: (dm, vl) => {
        // console.log('2:', vl)
        dm.css({
            backgroundOrigin: vl
        })
    },
    backgroundClip: (dm, vl) => {
        // console.log('2:', vl)
        dm.css({
            backgroundClip: vl
        })
    },
    backgroundAttachment: (dm, vl) => {
        // console.log('2:', vl)
        dm.css({
            backgroundAttachment: vl
        })
    },
    imageSrc: (dm, vl) => {
        // console.log('2--:', dm, vl)
        dm.attr({
            src: vl
        })
    },
    imageAlt: (dm, vl) => {
        // console.log('2--:', dm, vl)
        dm.attr({
            alt: vl
        })
    },
    objectFit: (dm, vl) => {
        dm.css({
            objectFit: vl
        })
    },
    height: (dm, vl) => {
        dm.height(vl)
    }
}
// 编辑器数据操作处理函数
export default function (store) {
    // 保存记录
    const addRecord = () => {
        store.commit('editor/record')
    }
    return {
        // 可否编辑
        editable: computed({
            get: () => store.state.editor.editable,
            set: b => store.commit('editor/editable', b)
        }),
        // 尺寸
        size  : computed(() => store.state.editor.size),
        // 编辑器位置
        appPos: computed({
            get: () => store.state.editor.appPos,
            set: p => store.commit('editor/appPos', p)
        }),
        // 模式
        mode: computed({
            get: () => store.state.editor.mode,
            set: md => store.commit('editor/mode', md)
        }),
        // 设置模式
        setMode: md => {
            store.commit('editor/mode', md)
        },
        // 编辑区是否滚动
        scroll      : computed(() => store.state.editor.scroll),
        // 滚动的距离
        scrollDst   : computed(() => store.state.editor.scrollTop),
        // 设置滚动的距离
        setScrollDst: dst => {
            store.commit('editor/scrollTop', dst)
        },
        // 设置编辑区是否滚动
        setScroll: bool => {
            store.commit('editor/scroll', bool)
        },
        // 内容
        content   : computed(() => store.state.editor.content),
        // 临时内容（编辑过程中的内容）
        tmpContent: computed(() => store.state.editor.tmpContent),
        // 设置内容
        setContent: html => {
            store.commit('editor/content', html)
        },
        // 设置临时内容（编辑过程中的内容）
        setTmpContent: html => {
            store.commit('editor/tmpContent', html)
        },
        // 记录
        record: computed(() => store.state.editor.record),
        addRecord,
        // 撤销
        undo  : () => {
            store.commit('editor/undo')
        },
        // 恢复
        redo: () => {
            store.commit('editor/redo')
        },
        // dialogFlag
        dialogFlag   : computed(() => store.state.editor.dialogFlag),
        // 设置dialogFlag
        setDialogFlag: (...cfg) => {
            store.commit('editor/dialogFlag', ...cfg)
        },
        // 当前的range
        range    : computed(() => store.state.editor.range),
        // 更新range内容
        saveRange: rg => {
            // 选区
            let range = rg ? rg.cloneRange() : (function (selection) {
                return selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null
            })(getSelection())
            // 提取选区数据并保存
            store.commit('editor/range', {
                string        : range.toString(),
                collapsed     : range.collapsed,
                parentNodeType: getAllNodeName(range.startContainer),
                flag          : true
                // r             : range.cloneRange()
            })
            // console.log('saveRange====: ', range)
        },
        // 取消选区数据
        clearRange: () => {
            store.commit('editor/range', {
                string        : '',
                collapsed     : true,
                parentNodeType: [],
                flag          : false
            })
        },
        // quickbar数据
        quick   : computed(() => store.state.editor.quick),
        // 设置quick数据
        setQuick: cfg => {
            store.commit('editor/quick', cfg)
        },
        // 属性编辑面板
        attrPannel   : computed(() => store.state.editor.attrPannel),
        // 设置属性编辑面板
        setAttrPannel: attr => {
            store.commit('editor/attrPannel', attr)
        },
        // 切换属性编辑面板
        // switchAttrPannel: () => {
        //     store.commit('editor/switchAttrPannel')
        // },
        // 当前编辑元素信息
        blockAttr   : computed(() => store.state.editor.blockAttr),
        // 设置当前正在编辑元素的信息
        setBlockAttr: obj => {
            store.commit('editor/blockAttr', obj)
        },
        // 设置当前正在编辑元素的默认值
        setBlockAttrDft: (sdm, jsn) => {
            store.commit('editor/blockAttr', Object.assign({
                initDef             : true,
                width               : sdm.widthStyle(),
                realWidth           : sdm.widthReal(),
                height              : sdm.heightStyle(),
                realHeight          : sdm.heightReal(),
                backgroundImage     : sdm.css('backgroundImage'),
                backgroundColor     : sdm.css('backgroundColor') || 'transparent',
                backgroundPosition  : sdm.css('backgroundPosition'),
                backgroundSize      : sdm.css('backgroundSize'),
                backgroundRepeat    : sdm.css('backgroundRepeat'),
                backgroundOrigin    : sdm.css('backgroundOrigin'),
                backgroundClip      : sdm.css('backgroundClip'),
                backgroundAttachment: sdm.css('backgroundAttachment'),
                imageSrc            : sdm.attr('src'),
                objectFit           : sdm.css('objectFit')
            }, jsn))
        },
        // 清空属性
        blockAttrClear: () => {
            store.commit('editor/blockAttrClear')
        },
        // 编辑元素的width属性
        blockAttrWdith: computed({
            get: () => store.state.editor.blockAttr.width,
            set: value => store.commit('editor/blockAttr', { width: value, initDef: false })
        }),
        // 编辑元素的backgroundImage属性
        blockAttrBackgroundImage: computed({
            get: () => store.state.editor.blockAttr.backgroundImage,
            set: value => store.commit('editor/blockAttr', { backgroundImage: value, initDef: false })
        }),
        // 编辑元素的颜色属性
        blockAttrBackgroundColor: computed({
            get: () => store.state.editor.blockAttr.backgroundColor,
            set: value => store.commit('editor/blockAttr', { backgroundColor: value, initDef: false })
        }),
        blockAttrBackgroundPosition: computed({
            get: () => store.state.editor.blockAttr.backgroundPosition,
            set: value => store.commit('editor/blockAttr', { backgroundPosition: value, initDef: false })
        }),
        blockAttrBackgroundSize: computed({
            get: () => store.state.editor.blockAttr.backgroundSize,
            set: value => store.commit('editor/blockAttr', { backgroundSize: value, initDef: false })
        }),
        blockAttrBackgroundRepeat: computed({
            get: () => store.state.editor.blockAttr.backgroundRepeat,
            set: value => store.commit('editor/blockAttr', { backgroundRepeat: value, initDef: false })
        }),
        blockAttrBackgroundOrigin: computed({
            get: () => store.state.editor.blockAttr.backgroundOrigin,
            set: value => store.commit('editor/blockAttr', { backgroundOrigin: value, initDef: false })
        }),
        blockAttrBackgroundClip: computed({
            get: () => store.state.editor.blockAttr.backgroundClip,
            set: value => store.commit('editor/blockAttr', { backgroundClip: value, initDef: false })
        }),
        blockAttrBackgroundAttachment: computed({
            get: () => store.state.editor.blockAttr.backgroundAttachment,
            set: value => store.commit('editor/blockAttr', { backgroundAttachment: value, initDef: false })
        }),
        // 图片链接
        blockAttrImageSrc: computed({
            get: () => store.state.editor.blockAttr.imageSrc,
            set: value => store.commit('editor/blockAttr', { imageSrc: value, initDef: false })
        }),
        blockAttrObjectFit: computed({
            get: () => store.state.editor.blockAttr.objectFit,
            set: value => store.commit('editor/blockAttr', { objectFit: value, initDef: false })
        }),
        blockAttrImageAlt: computed({
            get: () => store.state.editor.blockAttr.imageAlt,
            set: value => store.commit('editor/blockAttr', { imageAlt: value, initDef: false })
        }),
        blockAttrHeight: computed({
            get: () => store.state.editor.blockAttr.height,
            set: value => store.commit('editor/blockAttr', { height: value, initDef: false })
        }),
        // 更新dom的style
        updateElementStyle: (dom, styles) => {
            // console.log('1:', styles)
            Object.keys(styles).forEach(key => {
                if (styles[key] !== undefined && du[key]) {
                    du[key](dom, styles[key])
                }
            })
        },
        // 更新当前正在编辑元素的绝对真实尺寸
        updateElementRealSize: dom => {
            // console.log('updateElementRealSize', dom)
            store.commit('editor/blockAttr', {
                realWidth : dom.widthReal(),
                realHeight: dom.heightReal()
            })
        }
    }
}
