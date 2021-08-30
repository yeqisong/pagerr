import { extend, createStyle, loadScript }  from './useUtil'
import Selector from '../class/Selector'
// 内置主题色定义
const themeDef = {
    default: {
        // 品牌色
        brand          : 'rgb(64, 158, 255)',
        // 场景色
        primary        : '#409EFF',
        success        : '#67C23A',
        warn           : '#E6A23C',
        danger         : '#F56C6C',
        info           : '#909399',
        transparent    : 'transparent',
        // 工具按钮
        btnTextNormal  : '#555',
        btnTextHover   : '#333',
        btnTextActive  : '#333',
        btnTextDisabled: '#ddd',
        btnBgNormal    : 'transparent',
        btnBgHover     : '#f5f5f5',
        btnBgActive    : '#ddd',
        btnBgDisabled  : '#fff'
    }
}
// 初始化主题方法
export const initTheme = (tm, options) => {
    let ct
    if (typeof tm === 'string') {
        ct = themeDef[tm] || themeDef['default']
    } else if (typeof tm === 'object') {
        ct = extend(themeDef['default'], tm)
    } else {
        ct = themeDef['default']
    }
    // 根变量定义
    let lk = Selector('head').prepend2type('LINK', createStyle(`
            :root {
                --hdbrand: ${ct.brand};
                --hdprimary: ${ct.primary};
                --hdsuccess: ${ct.success};
                --hdwarn: ${ct.warn};
                --hddanger: ${ct.danger};
                --hdinfo: ${ct.info};
                --hdtransparent: ${ct.transparent};
                --hdbtnTextNormal: ${ct.btnTextNormal};
                --hdbtnTextHover: ${ct.btnTextHover};
                --hdbtnTextActive: ${ct.btnTextActive};
                --hdbtnTextDisabled: ${ct.btnTextDisabled};
                --hdbtnBgNormal: ${ct.btnBgNormal};
                --hdbtnBgHover: ${ct.btnBgHover};
                --hdbtnBgActive: ${ct.btnBgActive};
                --hdbtnBgDisabled: ${ct.btnBgDisabled};
            }
            .heditor-toolbar .heditor-toolbar__btn button, .heditor-quickbar .heditor-quickbar__btn button, .heditor-dialog .heditor-dialog__btn button{
                color: ${ct.btnTextNormal};
                background: ${ct.btnBgNormal};
            }
            .heditor-toolbar .heditor-toolbar__btn button:hover, .heditor-quickbar .heditor-quickbar__btn button:hover, .heditor-dialog .heditor-dialog__btn button:hover{
                color: ${ct.btnTextHover};
                background: ${ct.btnBgHover};
            }
            .heditor-toolbar .heditor-toolbar__btn button.active, .heditor-quickbar .heditor-quickbar__btn button.active, .heditor-dialog .heditor-dialog__btn button.active{
                color: ${ct.btnTextActive};
                background: ${ct.btnBgActive};
            }
            .heditor-toolbar .heditor-toolbar__btn button.active span svg, .heditor-quickbar .heditor-quickbar__btn button.active span svg, .heditor-dialog .heditor-dialog__btn button.active span svg{
                stroke: ${ct.btnTextActive};
            }
            .heditor-toolbar .heditor-toolbar__btn button.disabled, .heditor-quickbar .heditor-quickbar__btn button.disabled, .heditor-dialog .heditor-dialog__btn button.disabled{
                color: ${ct.btnTextDisabled};
                background: ${ct.btnBgDisabled};
            }
            .heditor-toolbar .heditor-toolbar__btn button.disabled span svg, .heditor-quickbar .heditor-quickbar__btn button.disabled span svg, .heditor-dialog .heditor-dialog__btn button.disabled span svg{
                stroke: ${ct.btnTextDisabled};
            }
    `))
    // 载入icon svg sprite文件
    loadScript(options.svgsurl, () => '')
}
