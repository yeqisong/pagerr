import { mergeJSON } from '../../use/useUtil'
const state = () => ({
    // 可否编辑
    editable: true,
    // 编辑器尺寸
    size    : {
        width     : '100%',
        innerWidth: '100%',
        height    : '500px'
    },
    // 编辑器的位置
    appPos: {
        left: 0,
        top : 0
    },
    // 设备模式
    mode      : 'pc',
    // 编辑区是否滚动
    scroll    : false,
    scrollTop : 0,
    // 当前内容
    content   : '',
    tmpContent: '',
    // 历史记录
    record    : {
        // 记录数据
        data   : [],
        // 当前记录指针
        step   : 0,
        // 最大保留的记录数
        maxStep: 100
    },
    // 选区数据
    range: {
        // 选区文本
        string        : '',
        // 是否单选
        collapsed     : true,
        // 所有父节点类型
        parentNodeType: [],
        // 是否是有效选区，在编辑区的选区才是有效选区
        flag          : false
    },
    // 主题色配置
    theme: {
    },
    // dialogFlag，统一控制各个弹窗的展示规则
    dialogFlag: {
        blocks     : false,
        links      : false,
        fontcolor  : false,
        backcolor  : false,
        svgs       : false,
        align      : false,
        heading    : false,
        fontsize   : false,
        fontfamily : false,
        underline  : false,
        unorderlist: false,
        orderlist  : false,
        tables     : false
    },
    // 快捷菜单数据
    quick: {
        // 是否显示
        display: false,
        // 位置 x轴偏移
        x      : 0,
        // 位置，y轴偏移
        y      : 0,
        // 当前操作对象标识，可以放class\data等，用于设置当前正在操作的对象。如果是block，则建议设置到blockAttr中，可以自动更新对应的css
        d      : null,
        // 要显示的按钮
        btns   : []
    },
    // 属性编辑器是否显示
    attrPannel: false,
    // 组件操作
    blockAttr : {
        // 正在编辑的元素class
        className           : undefined,
        // 更新属性后元素自动加样式，会记录历史，加入该标志为true时不记录历史
        initDef             : true,
        // 长度
        width               : undefined,
        realWdith           : undefined,
        // 高度
        height              : undefined,
        // 真实绝对高度
        realHeight          : undefined,
        // 背景颜色
        backgroundColor     : 'transparent',
        // 背景图片
        backgroundImage     : undefined,
        // 背景图片重复
        backgroundRepeat    : undefined,
        // 背景图片大小
        backgroundSize      : undefined,
        // 背景图片位置
        backgroundPosition  : undefined,
        backgroundOrigin    : undefined,
        backgroundClip      : undefined,
        backgroundAttachment: undefined,
        // 图片
        imageSrc            : undefined,
        objectFit           : undefined,
        imageAlt            : undefined
    }
})
const getters = {
}
const mutations = {
    // 可否编辑
    editable (state, b) {
        state.editable = b !== false
    },
    // 设置内容（初始内容或最终内容）
    content (state, html) {
        state.content = html
    },
    // 设置临时内容
    tmpContent (state, html) {
        state.tmpContent = html
    },
    // 设置编辑器尺寸
    size (state, wh) {
        if (wh.width && wh.height) {
            state.size = wh
        }
    },
    // 修改编辑器位置
    appPos (state, cfg) {
        if (cfg.left) {
            state.appPos.left = cfg.left
        }
        if (cfg.right) {
            state.appPos.top = cfg.top
        }
    },
    // 修改模式
    mode (state, ds) {
        state.mode = ds === 'mobile' ? 'mobile' : 'pc'
    },
    // 设置编辑区滚动标识
    scroll (state, bool) {
        state.scroll = bool
    },
    // 滚动的距离
    scrollTop (state, dst) {
        state.scrollTop = dst
    },
    // 设置range
    range (state, rag) {
        state.range = rag
    },
    // 设置记录
    record (state) {
        let record_len = state.record.data.length
        // 如果当前所在记录条数小于最条数，新增记录时需要舍弃后面的记录
        if (state.record.step < record_len) {
            let s = state.record.data.splice(state.record.step)
        } else if (record_len >= state.record.maxStep) {
            // 如果当前所在记录条数大于最大记录数，则需要舍弃一条最开始的记录
            state.record.data[-1] = state.record.data.splice(0, 1)[0]
            state.record.step -= 1
        }
        // 直接添加记录到最后
        state.record.data.push(state.tmpContent)
        state.record.step += 1
    },
    // 撤销
    undo (state) {
        if (state.record.step > 1) {
            state.record.step -= 1
            state.content = state.record.data[state.record.step - 1]
        }
    },
    // 恢复
    redo (state) {
        if (state.record.step < state.record.data.length) {
            state.content = state.record.data[state.record.step]
            state.record.step += 1
        }
    },
    /**
     * dialogFlag各弹窗的开关设置，支持四种形式
     * @param {*} state
     * @param  {...any} args
     * false 全部关
     * true 全部开
     * [string, string] 忽略该key，其它关
     * [object, object] 指定key设置，其它关
     */
    dialogFlag (state, ...args) {
        // 如果是boolean，则指定全部开关
        if (args[0] === false || args[0] === true) {
            for (let key in state.dialogFlag) {
                state.dialogFlag[key] = args[0]
            }
        } else {
            // 配置格式
            let fmt = typeof args[0] === 'string'
            for (let key in state.dialogFlag) {
                // 如果是string,则检查key在不在args中，在则不变，否则清0
                state.dialogFlag[key] = fmt
                    // string的处理
                    ? (args.indexOf(key) > -1 ? state.dialogFlag[key] : false)
                    // json的处理
                    : (function (jsnArr, k) {
                        let dd = false
                        for (let thek in jsnArr) {
                            // 如果args中有该配置，则返回它
                            if (jsnArr[thek][k] !== undefined) {
                                dd = jsnArr[thek][k]
                                break
                            }
                        }
                        return dd
                    }(args, key))
            }
        }
    },
    /**
     * 设置quick信息
     * @param {*} state
     * @param {*} cfg
     */
    quick (state, cfg) {
        // console.log('2:', cfg.btns)
        mergeJSON(state.quick, cfg)
        // console.log('3', state.quick)
    },
    /**
     * 设置属性编辑器状态
     * @param {*} state
     * @param {*} bool
     */
    attrPannel (state, attrname) {
        state.attrPannel = attrname
    },
    // switchAttrPannel (state) {
    //     state.attrPannel = !state.attrPannel
    // },
    /**
     * 设置正在编辑的元素的属性
     * @param {*} state
     * @param {*} obj
     */
    blockAttr (state, obj) {
        mergeJSON(state.blockAttr, obj)
    },
    /**
     * 清空当前正在编辑的元素
     * @param {*} state
     */
    blockAttrClear (state) {
        Object.keys(state.blockAttr).forEach(key => { state.blockAttr[key] = undefined })
        state.blockAttr.initDef = true
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations
}
