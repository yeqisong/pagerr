import { createApp } from 'vue'
import {
    createStore
} from 'vuex'
import editor from './store/modules/editor'
import App from './App.vue'
import { extend } from './use/useUtil'
import { initTheme } from './use/useTheme'
import colorPicker from 'vue3-colorpicker'
import 'vue3-colorpicker/bundle.css'
import './assets/index.css'
// app实例
export default class {
    // 默认属性
    options = {
        // 默认挂载节点
        container   : '#app',
        width       : '100%',
        innerWidth  : '100%',
        height      : '650px',
        // 初始内容设置
        content     : '请输入内容...',
        // 主题配置
        theme       : 'default',
        // 图片上传函数配置，参数为用户选择的文件，返回
        uploadImgFun: file => new Promise((resolve, reject) => { reject('base64') }),
        // 默认模式
        mode        : 'pc',
        // 可否编辑
        editable    : true,
        svgsurl     : 'https://dyimg.bosslib.com/bootstrap-icons.js',
        svgurl      : 'https://dyimg.bosslib.com/'
    }
    // 构造函数
    constructor(options) {
        extend(this.options, options)
        this._init()
    }
    // 初始化
    _init () {
        this.app = createApp(App)
        if (process.env.NODE_ENV === 'production') {
            this.app.config.devtools = true
        }
        this.store = createStore({
            strict : process.env.NODE_ENV !== 'production',
            modules: {
                editor
            }
        })
        this.app.use(this.store)
        // 挂在颜色选择器
        this.app.use(colorPicker)
        // 图片上传函数配置
        this.app.config.globalProperties.$uploadImg = this.options.uploadImgFun
        this.app.config.globalProperties.$svgurl = this.options.svgurl
        this.app.mount(this.options.container)
        // 初始化主题
        initTheme(this.options.theme, this.options)
        // 默认内容
        this.store.commit('editor/content', this.options.content + ' ')
        // 设置内容
        this._setContent(this.options.content)
        // 设置尺寸
        this._setSize({ width: this.options.width, height: this.options.height, innerWidth: this.options.innerWidth })
        // 默认编辑器模式
        this.store.commit('editor/mode', this.options.mode)
        // 初始化编辑器可否编辑
        this._setEditable(this.options.editable)
    }
    // 设置尺寸
    _setSize (wh) {
        wh.width = wh.width || this.options.width
        wh.innerWidth = wh.innerWidth || this.options.innerWidth
        wh.height = wh.height || this.options.height
        this.store.commit('editor/size', wh)
    }
    // 设置内容
    _setContent (html) {
        this.store.commit('editor/tmpContent', html)
        this.store.commit('editor/record')
    }
    // 设置可否编辑
    _setEditable (b) {
        this.store.commit('editor/editable', b)
    }
    // 保存接口
    save (cb) {
        cb(this.store.state.editor.tmpContent)
    }
    // 设置内容接口
    content (html) {
        this._setContent(html)
    }
    // 设置尺寸接口
    size (wh) {
        this._setSize(wh)
    }
    // 修改可否编辑
    editable (b) {
        this._setEditable(b)
    }
}
