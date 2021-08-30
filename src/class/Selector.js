import { extend, type, htmlToFragment, wrapUnit, unwrapUnit } from '../use/useUtil'
// 查找前面的非空元素
function upele (node) {
    if (node && node.previousSibling && !/^\s+/.test(node.previousSibling.nodeValue)) {
        return node.previousSibling
    } else if (node.previousSibling) {
        return upele(node.previousSibling)
    } else {
        return false
    }
}
// 查找后面的非空元素
function downele (node) {
    if (node && node.nextSibling && !/^\s+/.test(node.nextSibling.nodeValue)) {
        return node.nextSibling
    } else if (node.nextSibling) {
        return downele(node.nextSibling)
    } else {
        return false
    }
}
class S {
    constructor(selector, context) {
        if (type(selector) === 'string' && selector.substr(0, 1) === '<') {
            // html文本
            selector = [htmlToFragment(selector).firstChild]
        } else if (type(selector) === 'string') {
            // 选择器字符
            selector = (context || window.document).querySelectorAll(selector)
        } else if (selector && selector.nodeType) {
            // 单个node节点
            selector = [selector]
        } else {
            // 实例
            return this
        }
        extend(this, {
            0     : selector.length > 1 ? selector : selector[0],
            length: selector.length,
            context
        })
    }
    children (element) {
        return new S(element, this[0])
    }
    first (type) {
        let ns = this[0].childNodes
        if (!type) {
            for (let i = 0; i < ns.length; i++) {
                if (ns[i].nodeName !== 'TEXT') {
                    return new S(ns[i])
                }
            }
        } else {
            for (let i = 0; i < ns.length; i++) {
                if (ns[i].nodeName === type) {
                    return new S(ns[i])
                }
            }
        }
        return this
    }
    prepend2type (type, ...args) {
        let i, fragment
        for (i = 0; i < args.length; i++) {
            if (typeof args[i] === 'string') {
                fragment = htmlToFragment(args[i])
            } else {
                fragment = args.constructor ? args[i] : args[i]
            }
            if (this[0].hasChildNodes()) {
                this[0].insertBefore(fragment, this.first(type)[0])
            } else {
                this[0].appendChild(fragment)
            }
        }
        return this
    }
    hasChildNode (node) {
        if (this[0].isSameNode(node)) {
            return true
        }
        if (!node.parentNode) {
            return false
        }
        return this.hasChildNode(node.parentNode)
    }
    on(type, handler) {
        if (this[0].addEventListener) {
            this[0].addEventListener(type, handler, false)
        } else if (this[0].attachEvent) {
            this[0].attachEvent('on' + type, handler)
        } else {
            this[0]['on' + type] = handler
        }
        return this
    }
    once (type, handler) {
    }
    off (type, handler) {
        if (this[0].removeEventListener) {
            this[0].removeEventListener(type, handler, false)
        } else if (this[0].detachEvent) {
            this[0].detachEvent('on' + type, handler)
        } else {
            this[0]['on' + type] = null
        }
        return this
    }
    // event (event) {
    //     let e = event || window.event
    //     this.event = e
    //     return e
    // }
    // target() {
    //     return this.event.target || target.srcElement
    // }
    // preventDefault() {
    //     if (this.event.preventDefault) { this.event.preventDefault() } else { this.event.returnValue = false }
    // }
    // stopPropagation() {
    //     if (this.event.stopPropagation) { this.event.stopPropagation() } else { this.event.cancelBubble = true }
    // }
    // 删除该节点
    delete () {
        let pn = this[0].parentNode
        // console.log(this[0], pn)
        pn.removeChild(this[0])
        return pn
    }
    // 在指定节点前面插入节点
    before(node) {
        if (node && this[0].parentNode) {
            this[0].parentNode.insertBefore(node.constructor ? node : node, this[0])
        }
        return this
    }
    // 在指定节点后面插入节点
    after (node) {
        if (node && this[0].parentNode) {
            if (this[0].parentNode.lastChild.isSameNode(this[0])) {
                this[0].parentNode.appendChild(node)
            } else {
                this[0].parentNode.insertBefore(node, this[0].nextSibling)
            }
        }
        return this
    }
    // 向上移动
    up () {
        // 如果有前面兄弟节点，2者换个位置
        let upB = upele(this[0])
        if (upB && this[0].parentNode) {
            this[0].parentNode.insertBefore(this[0], upB)
        }
        return this
    }
    // 是否前面有非空兄弟节点
    hasPreviousElement () {
        let upB = upele(this[0])
        if (upB && this[0].parentNode) {
            return true
        }
        return false
    }
    // 向下移动
    down () {
        let downB = downele(this[0])
        if (downB && this[0].parentNode) {
            this[0].parentNode.insertBefore(downB, this[0])
        }
        return this
    }
    // 是否后面有非兄弟节点
    hasNextElement () {
        let downB = downele(this[0])
        if (downB && this[0].parentNode) {
            return true
        }
        return false
    }
    // 从祖先元素找查找className
    findClosestClass (className, returnType = 'boolean') {
        function cc (node, cn) {
            if (node && node.classList && node.classList.contains(cn)) {
                if (returnType === 'node') {
                    return node
                }
                return true
            } else if (node && node.parentNode) {
                return cc(node.parentNode, cn)
            } else {
                return false
            }
        }
        return cc(this[0], className)
    }
    // 设置style
    style (name, value) {
        // 设置时，如果只有name且为string，则为无效的设置
        if (typeof value === 'undefined' && typeof name === 'string') {
            return this
        }
        // 归一为数组
        let obj = this.length === 1 ? [this[0]] : this[0]
        let type = typeof name === 'string' ? 'single' : 'objet'
        let sutl = {
            single (o, n, v) {
                o.style[n] = v
            },
            objet (o, c) {
                Object.keys(c).forEach(k => {
                    o.style[k] = c[k]
                })
            }
        }
        obj.forEach(o => {
            sutl[type](o, name, value)
        })
        return this
    }
    // 设置css或获取css
    css(name, value) {
        return (typeof value === 'undefined' && typeof name === 'string') ? this[0].style[name] : (function (obj) {
            return obj.style(name, value)
            // if (typeof name === 'string') {
            //     // obj[0].style[name] = value
            //     obj.style(name, value)
            // } else {
            //     // console.log('3:', name)
            //     // Object.keys(name).forEach(key => {
            //     //     // console.log('4:', key, name[key])
            //     //     obj[0].style[key] = name[key]
            //     // })
            // }
            // return obj
        }(this))
    }
    // 获取或设置属性
    attr (name, value) {
        // console.log('4:', typeof value !== 'string', name)
        return (typeof value === 'undefined' && typeof name === 'string') ? this[0].getAttribute(name) : (function(obj) {
            if (typeof name === 'string') {
                obj[0].setAttribute(name, value)
            } else {
                // console.log('3:', name)
                Object.keys(name).forEach(key => {
                    obj[0].setAttribute(key, name[key])
                })
            }
            return obj
        }(this))
    }
    // 返回width样式，如果没有则返回width的真实值
    widthStyle () {
        return this[0].style.width ? this[0].style.width : 'auto'
    }
    // 真实宽度
    widthReal () {
        return this[0].offsetWidth
    }
    // 宽度函数
    width (value) {
        if (!value) {
            return this.widthReal()
        }
        this[0].style.width = wrapUnit(value)
        return this
    }
    heightStyle () {
        return this[0].style.height ? this[0].style.height : 'auto'
    }
    // 真实绝对高度
    heightReal () {
        return this[0].offsetHeight
    }
    // 高度函数
    height (value) {
        if (!value) {
            return this.heightReal()
        }
        this[0].style.height = wrapUnit(value)
        return this
    }
    // 移除class
    removeClass (cls) {
        let ns = this.length > 1 ? this[0] : [this[0]]
        ns.forEach(n => {
            n.classList.remove(cls)
        })
        return this
    }
}
const Selector = (selector, context) => new S(selector, context)
export default Selector
