export const isJSON = target => typeof target === 'object' && target.constructor === Object
/**
 * 生成全局唯一值
 * @returns
 */
export const uuid = () => {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}
export const isUrl = url => /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url)
export const openWindow = url => {
    let link = document.createElement('a')
    link.target = '_blank'
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
// ajax函数
export const ajax = option => {
    // 用户配置option 默认配置init
    let init = {
        type : 'get',
        async: true,
        url  : '',
        success () { },
        error () { },
        data : {},
        beforeSend () {
            // console.log('发送前...')
            return true
        }
    }
    // TODO step1: 合并参数
    for (let k in option) {
        init[k] = option[k]
    }
    // TODO step2: 参数转换
    let params = ''
    for (let k in init.data) {
        params += '&' + k + '=' + init.data[k]
    }
    let xhr = new XMLHttpRequest()
    // type url
    // TODO step3: 区分get和post,进行传参
    let url = init.url + '?__=' + new Date().getTime()
    // TODO step4: 发送前
    let flag = init.beforeSend()
    if (!flag) {
        return
    }
    if (init.type.toLowerCase() === 'get') {
        url += params
        xhr.open(init.type, url, init.async)
        xhr.send()
        console.log('ajax get', url)
    } else {
        xhr.open(init.type, url, init.async)
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
        xhr.send(params.substr(1))
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                init.success(xhr.responseText)
            } else {
                // error
                init.error()
            }
        }
    }
}
// 加载js
export const loadScript = (src, callback) => {
    let script = document.createElement('script')
    let head = document.getElementsByTagName('head')[0]
    script.type = 'text/javascript'
    script.charset = 'UTF-8'
    script.src = src
    if (script.addEventListener) {
        script.addEventListener('load', () => {
            callback()
        }, false)
    } else if (script.attachEvent) {
        script.attachEvent('onreadystatechange', () => {
            let target = window.event.srcElement
            if (target.readyState === 'loaded') {
                callback()
            }
        })
    }
    head.appendChild(script)
}
// 单位的正则
const unitRegx = new RegExp(/(px|%|em|rem|vh)$/i)
/**
 * 为样式属性值内容包裹单位
 * @param {*} value
 */
export const wrapUnit = value => {
    // 如果是auto，则直接返回
    if (value === 'auto') {
        return value
    }
    // 如果包含px、%、em、rem、vh等结尾，则直接返回
    if (unitRegx.test(value)) {
        return value
    }
    // 否则转为数字，加上px
    return value + 'px'
}
/**
 * 为样式属性值内容解包单位
 * @param {*} value
 */
export const unwrapUnit = value => {
    // 如果是auto，则直接返回
    if (value === 'auto') {
        return value
    }
    // 如果包含px、%、em、rem、vh等结尾，则去掉单位返回数字
    return parseInt(value)
}
// 子属性合并
export const extend = (target, source) => {
    for (let key in source) {
        target[key] = source[key]
    }
    return target
}
// 深度属性合并
export const mergeJSON = (target = {}, add = {}) => {
    for (let key in add) {
        if (Object.prototype.hasOwnProperty.call(add, key)) {
            if (target[key] && isJSON(target[key]) && isJSON(add[key])) {
                mergeJSON(target[key], add[key])
            } else {
                target[key] = add[key]
            }
        }
    }
    return target
}
// 创建dom元素
export const createElement = (element, args) => {
    element = window.document.createElement(element)
    if (typeof args !== 'undefined') {
        let fn, key
        fn = function (ele, list) {
            for (key in list) {
                // object
                if (typeof list[key] !== 'string' && !list[key].length) {
                    fn(ele[key], list[key])
                } else {
                    ele[key] = list[key]
                }
            }
        }
        fn(element, args)
    }
    return element
}
// 清空子节点
export const removeAllChildNodes = node => {
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild)
    }
    return node
}
// 创建style元素
export const createStyle = csstext => {
    let style = window.document.createElement('style')
    style.type = 'text/css'
    if (style.styleSheet) {
        style.styleSheet.cssText = csstext
    } else {
        style.innerHTML = csstext
    }
    return style
}
// html字符串转文档片段
export const htmlToFragment = html => {
    let fragment = window.document.createDocumentFragment()
    let div = createElement('div', {
        innerHTML: html
    })
    while (div.firstChild) {
        fragment.appendChild(div.firstChild)
    }
    return fragment
}
// 多个节点转为fragment
export const nodesToFragment = (...nodes) => {
    let fragment = window.document.createDocumentFragment()
    nodes.forEach(n => {
        fragment.appendChild(n)
    })
    return fragment
}
/**
 * 获取节点的全部父节点，可以指定最高节点
 */
export const getAllNodeName = (node, rst = [], lastNode = null) => {
    if (!node.parentNode) {
        return rst
    }
    rst.push(node.nodeName)
    return getAllNodeName(node.parentNode, rst)
}
/**
 * 寻找指定tag的第一个祖先节点，返回一个或0个节点
 * @param {*} tagName
 * @param {*} startNode
 */
export const closestNode = (tagName, startNode) => {
    if (!startNode || !startNode.parentNode) { return false }
    // 如果已经找到编辑器容器，则返回false
    if (startNode.classList && startNode.classList.contains('heditor-content__canvas')) {
        return false
    }
    if (startNode.tagName && (startNode.tagName.toUpperCase() === tagName.toUpperCase())) {
        return startNode
    }
    return closestNode(tagName, startNode.parentNode)
}
/**
 * 寻找指定style样式及样式属性的第一个祖先节点，返回一个或0个节点
 * @param {*} startNode
 * @param {*} StyleName
 * @param  {...any} args 样式值，可以指定多个
 * @returns
 */
export const closestNodeByStyleSheet = (startNode = null, styleName = null, ...args) => {
    // console.log('-----:', startNode, styleName)
    // 如果没有样式名或样式值，直接返回当前节点
    if ((!startNode) || startNode.nodeType !== 1 || (!styleName) || args.length < 1) {
        return startNode
    }
    // 如果已经找到编辑器容器，则返回false
    if (startNode.classList && startNode.classList.contains('heditor-content__canvas')) {
        return false
    }
    // 查找节点自身有无目标是样式设置
    if (args.indexOf(startNode.style[styleName]) > -1) {
        return startNode
    }
    // 如果没找到，寻找父节点，如果父节点不存在
    if (startNode.parentNode && startNode.nodeType === 1) {
        return closestNodeByStyleSheet(startNode.parentNode, styleName, ...args)
    } else {
        return false
    }
}
// 数组并集
export const interSection = (...args) => {
    // 如果只有一个数组
    if (args.length <= 1) {
        return args[0]
    }
    // 求前2个数组的并集
    let st = args[0].filter(v => args[1].indexOf(v) > -1)
    // 前2个数组无交集，则一定无交集
    if (!st.length) { return [] }
    // 如果没有第3个数组，直接返回结果
    if (args.length === 2) {
        return st
    }
    // 删除前2个数组，加入结果作为第一个数组
    return interSection(st, ...args.slice(2))
}
export const closestNodeByClass = (startNode = null, ...args) => {
    // 如果没有参数则返回false
    if ((!startNode) || args.length < 1) {
        return false
    }
    // 如果已经找到编辑器容器，则返回false
    if (startNode.classList && startNode.classList.contains('heditor-content__canvas')) {
        return false
    }
    // 查找节点自身，自身元素有class并且class与args的并集＞=1
    if (startNode.classList && interSection(Array.from(startNode.classList), [...args]).length >= 1) {
        return startNode
    }
    // 如果没有找到，则从父元素寻找
    if (startNode.parentNode && startNode.nodeType === 1) {
        return closestNodeByClass(startNode.parentNode, ...args)
    } else {
        return false
    }
}
export const closestNodeByNode = (startNode = null, targetNode) => {
    // 如果没有参数则返回false
    if ((!startNode) || (!targetNode)) {
        return false
    }
    // 当前node如果是目标node
    if (startNode.isSameNode(targetNode)) {
        return startNode
    }
    // 如果没有找到，则从父元素寻找
    if (startNode.parentNode && startNode.nodeType === 1) {
        return closestNodeByNode(startNode.parentNode, targetNode)
    } else {
        return false
    }
}
/**
 * 求多个节点的第一个共同祖先节点
 * @param {*} oNode1
 * @param {*} oNode2
 */
export const commonClosestNode = (...args) => {
    let len = args.length
    if (len < 2) { return 'yyy' }
    // console.log('-----:', len, typeof args[1], args[1])
    // console.log('args[0]', len, args, args[0], args[0].nodeType, args[1], typeof args[1], args[1].nodeType, (args[0].contains(args[1]) || args[0].isSameNode(args[1])))
    if (args[0].contains(args[1]) || args[0].isSameNode(args[1])) {
        if (len === 2) {
            return args[0]
        } else {
            let n2 = args[0]
            args.splice(0, 2)
            return commonClosestNode(n2, ...args)
        }
    }
    let n = args[0].parentNode
    args.splice(0, 1)
    return commonClosestNode(n, ...args)
}
/**
 * 文本节点克隆取截断部分
 * @param {Node} textNode 文本节点
 * @param {Number} offset 截断位置
 * @param {String} direct 方向 L 向左  R 向右
 */
export const getTextNodePartClone = (textNode, offset, direct = 'L') => {
    let n = textNode.cloneNode()
    let m = n.splitText(offset)
    return direct === 'L' ? n : m
}
/**
 * 移除节点片段中的指定tag标签
 * @param {Node} fragment 节点片段
 * @param  {...String} args 标签列表
 */
export const unwrapTagNameInNodes = (fragment, ...args) => {
    // 查找目标节点
    let targetnodes = fragment.querySelectorAll(...args)
    for (let n of targetnodes) {
        n.parentNode.replaceChild(htmlToFragment(n.innerHTML), n)
    }
    return fragment
}
/**
 * 移除子孙节点的空白节点
 * @param {Node} node 目标节点
 * @param {Boolean} mustNext 是否只查找兄弟节点
 * @param {*} rst
 * @returns
 */
export const cleanEmptyTag = (node, mustNext = 0, rst = null) => {
    if (!rst) { rst = node }
    // 如果节点下面无
    let onode
    // console.log('===:', node.cloneNode())
    if (node && node.nodeType === 1 && node.textContent === '') {
        onode = node.nextSibling
        mustNext = 1
        node.parentNode.removeChild(node)
    }
    // 优先下钻子节点
    if (!mustNext && node && node.firstChild) {
        return cleanEmptyTag(node.firstChild, 0, rst)
    }
    // 子节点没有则下钻兄弟节点，否则找父节点的兄弟节点
    if (onode || (node && node.nextSibling)) {
        return cleanEmptyTag(node.nextSibling, 0, rst)
    } else {
        if (node && node.parentNode) {
            return cleanEmptyTag(node.parentNode, 1, rst)
        } else {
            return rst
        }
    }
}
/**
 * 比较2个节点是否相似（不包含子节点，只比较tagname和属性）
 * @param {*} node1
 * @param {*} node2
 * @returns
 */
export const nodeWithNotChildEquel = (node1, node2) => {
    if (node1.nodeType !== 1 || node2.nodeType !== 1) { return false }
    let node11 = node1.cloneNode()
    let node22 = node2.cloneNode()
    if (node11.isEqualNode(node22)) {
        return true
    }
    return false
}
/**
 * 合并属性相同的兄弟节点
 * @param {Node} node
 */
export const mergeSameNextTag = (node, mustNext = 0, rst = null) => {
    if (!rst) { rst = node }
    let onode
    // 合并兄弟节点
    if (node && node.nodeType === 1 && node.nextSibling && nodeWithNotChildEquel(node, node.nextSibling)) {
        node.appendChild(htmlToFragment(node.nextSibling.innerHTML))
        node.parentNode.removeChild(node.nextSibling)
    }
    // 优先下钻子节点
    if (!mustNext && node.firstChild) {
        return mergeSameNextTag(node.firstChild, 0, rst)
    }
    // 子节点没有则
    if (onode || node.nextSibling) {
        return mergeSameNextTag(node.nextSibling, 0, rst)
    } else {
        if (node.parentNode) {
            return mergeSameNextTag(node.parentNode, 1, rst)
        } else {
            return rst
        }
    }
}
/**
 * 优化节点：合并text，去除空标签，合并相同属性的标签
 * @param {Node} node
 */
export const optimizeNodes = node => {
    if (!node || !node.nodeType) { return node }
    // 移除全部空节点
    cleanEmptyTag(node)
    // 合并属性相同的兄弟节点
    mergeSameNextTag(node)
    // 优化文本节点
    node.normalize()
    return node
}
/**
 * 向左边截取node片段，直到取完目标节点
 * @param {Node} targetNode 目标Node
 * @param {Node} startNode 开始node
 * @param {Fragment} fragment 结果片段
 */
export const splitNodeLeftFragment = (targetNode, range, startNode = null, fragment = null) => {
    if (!fragment) {
        fragment = window.document.createDocumentFragment()
        // 把起始文本节点，克隆为第一个节点
        let offst
        if (!startNode) {
            startNode = range.startContainer
            offst = range.startOffset
        } else {
            offst = range.endOffset
        }
        if (startNode.nodeType === 3) {
            fragment.appendChild(getTextNodePartClone(startNode, offst))
        }
    }
    let newStart
    if (startNode.previousSibling) {
        // 前面有兄弟节点，拷贝到fragment中
        fragment.insertBefore(startNode.previousSibling.cloneNode(true), fragment.childNodes[0])
        newStart = startNode.previousSibling
    } else {
        // 前面无兄弟节点，但有父节点，则拷贝父节点来包裹原来fragment的内容
        if (startNode.parentNode) {
            let pp = startNode.parentNode.cloneNode(true)
            // 清空该父节点内容
            pp = removeAllChildNodes(pp)
            // 把fragment的全部内容加入到pp中
            pp.appendChild(fragment)
            // 把pp替换到fragment中
            let f2 = window.document.createDocumentFragment()
            f2.appendChild(pp)
            fragment = f2
            newStart = startNode.parentNode
            // 如果父节点已经是最外层目标节点，则返回结果
            if (startNode.parentNode.isSameNode(targetNode)) {
                return fragment
            }
        } else {
            return fragment
        }
    }
    // 用新的开始节点获取下一个node片段
    return splitNodeLeftFragment(targetNode, range, newStart, fragment)
}
/**
 * 向右边截取node片段，直到取完目标节点
 * @param {Node} targetNode 目标Node
 * @param {Node} startNode 开始node
 * @param {Fragment} fragment 结果片段
 */
export const splitNodeRightFragment = (targetNode, range, startNode = null, fragment = null) => {
    if (!fragment) {
        fragment = window.document.createDocumentFragment()
        // 把起始文本节点，克隆为第一个节点
        startNode = range.endContainer
        if (startNode.nodeType === 3) {
            let startText = startNode.cloneNode().splitText(range.endOffset)
            fragment.appendChild(startText)
        }
    }
    let newStart
    if (startNode.nextSibling) {
        // 有兄弟节点，拷贝到fragment中
        fragment.appendChild(startNode.nextSibling.cloneNode(true))
        newStart = startNode.nextSibling
    } else {
        // 前面无兄弟节点，但有父节点，则拷贝父节点来包裹原来fragment的内容
        if (startNode.parentNode) {
            let pp = startNode.parentNode.cloneNode(true)
            // 清空该父节点内容
            pp = removeAllChildNodes(pp)
            // 把fragment的全部内容加入到pp中
            pp.appendChild(fragment)
            // 把pp替换到fragment中
            let f2 = window.document.createDocumentFragment()
            f2.appendChild(pp)
            fragment = f2
            newStart = startNode.parentNode
            // 如果父节点已经是最外层目标节点，则返回结果
            if (startNode.parentNode.isSameNode(targetNode)) {
                return fragment
            }
        } else {
            return fragment
        }
    }
    // 用新的开始节点获取下一个node片段
    return splitNodeRightFragment(targetNode, range, newStart, fragment)
}
export const splitNodeMiddleFragment = (targetNode, range, startNode = null, fragment = null, endNode = null, finded = false) => {
    if (!endNode) {
        endNode = range.endContainer
    }
    if (!fragment && !startNode) {
        fragment = window.document.createDocumentFragment()
        startNode = range.startContainer
        // 把起始文本节点，克隆为第一个节点
        if (startNode.nodeType === 3) {
            let startText = startNode.cloneNode().splitText(range.startOffset)
            fragment.appendChild(startText)
        }
        // 起始文本是不是结束节点
        if (targetNode.isSameNode(endNode)) {
            finded = true
        }
    }
    let newStart
    if (!finded && startNode.nextSibling) {
        // 兄弟节点===结束节点, 放入兄弟节点并设置已找到
        if (startNode.nextSibling.isSameNode(endNode)) {
            let st = startNode.nextSibling.cloneNode(true)
            st.splitText(range.endOffset)
            fragment.appendChild(st)
            finded = true
        } else if (startNode.nextSibling.contains(endNode)) {
            // 兄弟节点包含了结束节点，则需要等待兄弟节点向左获取完判断，合并到结果中
            fragment.appendChild(splitNodeLeftFragment(startNode.nextSibling, range, endNode, null))
            finded = true
        } else {
            // 否则直接包含兄弟节点
            fragment.appendChild(startNode.nextSibling.cloneNode(true))
        }
        newStart = startNode.nextSibling
    } else {
        // 前面无兄弟节点，但有父节点，则拷贝父节点来包裹原来fragment的内容
        if (startNode.parentNode) {
            let pp = startNode.parentNode.cloneNode(true)
            // 清空该父节点内容
            pp = removeAllChildNodes(pp)
            // 把fragment的全部内容加入到pp中
            pp.appendChild(fragment)
            // 把pp替换到fragment中
            let f2 = window.document.createDocumentFragment()
            f2.appendChild(pp)
            fragment = f2
            newStart = startNode.parentNode
            // 如果父节点已经是最外层目标节点，则返回结果
            if (startNode.parentNode.isSameNode(targetNode)) {
                return fragment
            }
        } else {
            return fragment
        }
    }
    // 用新的开始节点获取下一个node片段
    return splitNodeMiddleFragment(targetNode, range, newStart, fragment, endNode, finded)
}
/**
 * 根据range将node切分为3个片段
 * @param {Node}} targetNode
 * @param {Range} range
 */
export const splitNode = (targetNode, range) => {
    // 第一个判断
    let n1 = splitNodeLeftFragment(targetNode, range, null)
    let n2 = splitNodeMiddleFragment(targetNode, range, null, null, range.endContainer)
    let n3 = splitNodeRightFragment(targetNode, range, null)
    console.log('%%%%%:', n1, n2, n3)
    return [n1, n2, n3]
}
// 求类型
export const type = args => {
    let type
    if (args === null || args === 'undefined') {
        type = args
    } else {
        type = Object.prototype.toString.call(args).split(' ')[1]
        type = type.replace(']', '').toLowerCase()
        if (type.indexOf('node') > -1) {
            type = 'node'
        }
    }
    return type
}
// 节流
export const throttle =  (fn, delay = 100) => {
    let last = 0
    return function(...args) {
        let curr = +new Date()
        if (curr - last > delay) {
            fn.apply(this, args)
            last = curr
        }
    }
}
/**
 * 防抖
 * @param {} fn
 * @param {*} delay
 */
export const debounce  = (fn, delay = 600) => (...args) => {
    clearTimeout(fn.id)
    fn.id = setTimeout(() => {
        fn.apply(this, args)
    }, delay)
}
/**
 * 阻止向上冒泡
 */
// const stopPropagation  = e =>
//     // window.event ? window.event.cancelBubble = true : e.stopPropagation()
//     true
// dom变化监听
export const domObserver = (element, handle, config) => {
    let cfg = {
        childList    : true,
        attributes   : true,
        characterData: true,
        subtree      : true
    }
    extend(cfg, config)
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    const mb = new MutationObserver(handle)
    mb.observe(element, cfg)
    return mb
}
/**
 * 获取元素真实样式
 * @param {*} el
 * @param {*} styleProp css样式名，如font-size
 * @returns
 */
export const getStyle = (el, styleProp) => {
    if (el.nodeType === 3) { el = el.parentNode }
    let camelize = function (str) {
        return str.replace(/\-(\w)/g, (str, letter) => letter.toUpperCase())
    }
    if (el.currentStyle) {
        return el.currentStyle[camelize(styleProp)]
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp)
    } else {
        return el.style[camelize(styleProp)]
    }
}
// 默认颜色
const defaultColor = ['rgb(255, 255, 255)', 'rgba(0, 0, 0, 0)']
/**
 * 获取文字颜色，如果没有，一直向上取
 * @param {*} el
 * @returns
 */
export const getStyleColor = el => {
    let c = getStyle(el, 'color')
    // 如果该元素仅默认颜色，则查找其父元素的颜色（最高到.heditor-content__canvas）
    if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
        return getStyleColor(el.parentNode)
    }
    return c
}
/**
 * 获取背景颜色，如果没有，一直向上取
 * @param {*} el
 * @returns
 */
export const getStyleBackColor = el => {
    if (el.classList && el.classList.contains('heditor-content__canvas')) {
        return 'rgb(255, 255, 255)'
    }
    let c = getStyle(el, 'background-color')
    // 如果该元素仅默认颜色，则查找其父元素的颜色（最高到.heditor-content__canvas）
    if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
        return getStyleBackColor(el.parentNode)
    }
    return c
}
/**
 * 获取文字大小，如果没有，一直向上取
 * @param {*} el
 * @returns
 */
export const getStyleFontSize = el => {
    let c = getStyle(el, 'font-size')
    // // 如果该元素仅默认颜色，则查找其父元素的颜色（最高到.heditor-content__canvas）
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c || '14px'
}
/**
 * 获取文字加粗样式
 * @param {*} el
 * @returns
 */
export const getStyleFontWeight = el => {
    let c = getStyle(el, 'font-weight')
    // // 如果该元素仅默认颜色，则查找其父元素的颜色（最高到.heditor-content__canvas）
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取文字斜体样式
 * @param {*} el
 * @returns
 */
export const getStyleFontItalic = el => {
    let c = getStyle(el, 'font-style')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取文字线条样式text-decoration
 * @param {*} el
 * @returns
 */
export const getStyleTextDecoration = el => {
    let c = getStyle(el, 'text-decoration')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取文字线条样式text-decoration-line
 * @param {*} el
 * @returns
 */
export const getStyleTextDecorationLine = el => {
    let c = getStyle(el, 'text-decoration-line')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取文字线条样式text-decoration-style
 * @param {*} el
 * @returns
 */
export const getStyleTextDecorationStyle = el => {
    let c = getStyle(el, 'text-decoration-style')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取下边框样式
 * @param {*} el
 * @returns
 */
export const getStyleBorderBottomStyle = el => {
    let c = getStyle(el, 'border-bottom-style')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取文字字体样式
 * @param {*} el
 * @returns
 */
export const getStyleFontFamily = el => {
    let c = getStyle(el, 'font-family')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
/**
 * 获取列表样式
 * @param {*} el
 * @returns
 */
export const getStyleListStyleType = el => {
    let c = getStyle(el, 'list-style-type')
    // if (defaultColor.indexOf(c) > -1 && el.parentNode && !el.classList.contains('heditor-content__canvas')) {
    //     return getStyleBackColor(el.parentNode)
    // }
    return c
}
// 生成几行几列默认表格html
export const createTableByRowCol = (row, col) => {
    // console.log('+++:', col)
    let html = ''
    for (let i = 0; i <= row; i++) {
        html += `<tr class="heditor-def-table__tr heditor-def-table__tr-row-${i}">`
        for (let j = 0; j <= col; j++) {
            html += `<td class="heditor-def-table__td heditor-def-table__td-row-${i} heditor-def-table__td-col-${j} heditor-def-table__td-${i}-${j}" style="width:${100 / (parseInt(col) + 1)}%"></td>`
        }
        html += '</tr>'
    }
    return `<table class="heditor-def-table">${html}</table>`
}
// 屏幕的可视区域尺寸
export const windowSize = () => ({
    width : window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
})
