import { nextTick } from 'vue'
import { getSelection, getRange, insertAtRange, insertInRange } from './useSelection'
import { closestNodeByStyleSheet, commonClosestNode, closestNode, splitNode, unwrapTagNameInNodes, htmlToFragment, nodesToFragment, optimizeNodes, getStyleTextDecorationLine, getStyleBorderBottomStyle, closestNodeByClass } from './useUtil'
/**
 * 把命令结果替换到内容中
 * @param {Node} pt
 * @param {Node} newnode
 */
const replaceEditorRst = (pt, newnode) => {
    if (pt.className.indexOf('heditor-content__canvas') > -1) {
        pt.innerHTML = newnode.firstChild.innerHTML
    } else {
        pt.parentNode.replaceChild(newnode, pt)
    }
}
// 命令集
const CommandUitl = {}
// 加粗命令
CommandUitl.Bold = cfg =>
    // 获取当前选区
    // let range = getRange()
    // console.log('range:', range.cloneRange())
    // if (!range) { return false }
    // // 开始节点的第一个目标tag节点
    // let commandType = 0 // 1表示执行 0表示取消
    // let findTagNode = closestNode(tags['Bold'].target, range.startContainer)
    // if (!findTagNode) {
    //     // 加粗
    //     commandType = 1
    // } else {
    //     // 取消加粗
    //     // 起止选区、目标tag节点的共同第一个祖先节点
    //     let pt = commonClosestNode(range.startContainer, range.endContainer, findTagNode)
    //     // 用选区将共同祖先节点切割为3个片段，且各自tag闭合
    //     let newnodes = splitNode(pt, range)
    //     // // 移除中间节点里的标签
    //     unwrapTagNameInNodes(newnodes[1], tags['Bold'].target)
    //     // 优化新片段
    //     let nf = optimizeNodes(nodesToFragment(...newnodes))
    //     // 替换pt，如果pt是canvas则替换子内容
    //     replaceEditorRst(pt, nf)
    //     // 恢复选区
    //     console.log('****', range)
    // }
    // return true
    window.document.execCommand('Bold', false, null)
// 斜体命令
CommandUitl.Italic = cfg => window.document.execCommand('Italic', false, null)
// 删除线命令
CommandUitl.Strikethrough = cfg => window.document.execCommand('Strikethrough', false, null)
// 文字颜色命令
CommandUitl.FontColor = cfg => window.document.execCommand('ForeColor', false, cfg.value)
// 文字背景命令
CommandUitl.BackColor = cfg => window.document.execCommand('BackColor', false, cfg.value)
// 添加链接
CommandUitl.CreateLink = cfg => window.document.execCommand('createLink', false, cfg.value)
// 删除链接
CommandUitl.UnLink = cfg => window.document.execCommand('unLink', false, null)
// 水平对齐
CommandUitl.TextAlign = cfg => window.document.execCommand(cfg.value, false)
// 标题级别
CommandUitl.Heading = cfg => window.document.execCommand('formatBlock', false, '<' + cfg.value + '>')
// 字号设置
CommandUitl.FontSize = cfg => {
    window.document.execCommand('styleWithCSS', 0, true)
    window.document.execCommand('fontSize', false, 7)
    let r = getRange()
    // 没有拖蓝选区则返回不执行
    if (r.collapsed) {
        return true
    }
    // 扩大选区包含全部font
    if (r.startContainer.nodeType === 3) {
        r.setStartBefore(r.startContainer.parentNode)
        r.setEndAfter(r.endContainer.parentNode)
    }
    // 修改节点中数据
    let df = r.cloneContents()
    df.querySelectorAll('[style*="font-size: xxx-large;"]').forEach((v, i) => {
        v.style.fontSize = cfg.value
    })
    // 替换选区
    r.deleteContents()
    r.insertNode(df)
    // 将选区恢复到font标签内text节点上
    r.setStart(r.startContainer.childNodes[r.startOffset].firstChild, 0)
    r.setEnd(r.endContainer.childNodes[r.endOffset - 1].lastChild, r.endContainer.childNodes[r.endOffset - 1].lastChild.length)
    // console.log('==================:', r)
    return true
}
// 字体
CommandUitl.FontFamily = cfg => {
    let rst = window.document.execCommand('fontName', false, cfg.value)
    return rst
}
import underlines from '../blocks/underlines'
const getDeepTextNode =  node => {
    if (node.nodeType !== 3 && node.firstChild.nodeType !== 3) {
        return getDeepTextNode(node.firstChild)
    } else if (node.firstChild && node.firstChild.nodeType === 3) {
        return node.firstChild
    }
    return node
}
const cancelNodeBorderToExec = (node, ltype) => {
    if (!node) { return false }
    let set = underlines.filter(v => v.type === ltype)[0]
    node.style.borderBottomStyle = ''
    node.style.borderBottomWidth = ''
    node.style.borderBottomStyle = null
    node.style.borderBottomWidth = null
    if (set.action === 'class' && node.classList) {
        node.classList.remove(set.class)
        node.removeAttribute('data-underline')
    }
    node.style.textDecorationLine = 'underline'
    node.style.textDecorationColor = 'transparent'
}
const addNodeBorderToExec = (node, ltype) => {
    if (!node) { return false }
    let set = underlines.filter(v => v.type === ltype)
    if (set[0].action === 'css') {
        node.style.borderBottomStyle = ltype
        node.style.borderBottomWidth = set[0].width || '1px'
    } else {
        node.classList.add(set[0].class)
        node.dataset.underline = set[0].type
    }
    node.style.textDecorationLine = 'underline'
    node.style.textDecorationColor = 'transparent'
    node.normalize()
}
const replaceRangeWithFragment = (r, f) => {
    f.normalize()
    r.deleteContents()
    r.insertNode(f)
    if (r.commonAncestorContainer.nodeType === 3) {
        r.commonAncestorContainer.parentNode.normalize()
    } else {
        r.commonAncestorContainer.normalize()
    }
    // 如果起点是node，移动起点到子文本节点上
    if (r.startContainer.nodeType !== 3) {
        let s = getDeepTextNode(r.startContainer.childNodes[r.startOffset])
        r.setStart(s, 0)
    }
    // 如果节点是node，移动终点到子文本节点上，并设置到最后
    if (r.endContainer.nodeType !== 3) {
        let l = getDeepTextNode(r.endContainer.childNodes[r.endOffset - 1])
        r.setEnd(l, l.length)
    }
}
const cancelUnderlineWidthRangeAndType = (rg, ltype) => {
    let set = underlines.filter(v => v.type === ltype)[0]
    // 分析选区
    let rgInfo = {}
    // 查找选区起点
    rgInfo.q = set.action === 'class'
        ? closestNodeByClass(rg.startContainer.nodeType === 3 ? rg.startContainer.parentNode : rg.startContainer, set.class)
        : closestNodeByStyleSheet(rg.startContainer.nodeType === 3 ? rg.startContainer.parentNode : rg.startContainer, 'borderBottomStyle', ltype)
    // 查找选区终点
    rgInfo.s = set.action === 'class'
        ? closestNodeByClass(rg.endContainer.nodeType === 3 ? rg.endContainer.parentNode : rg.endContainer, set.class)
        : closestNodeByStyleSheet(rg.endContainer.nodeType === 3 ? rg.endContainer.parentNode : rg.endContainer, 'borderBottomStyle', ltype)
    // 查找选区内部
    rgInfo.n = []
    rg.cloneContents().querySelectorAll(set.action === 'class' ? '[class*="' + set.class + '"]' : '[style*="border-bottom-style: ' + ltype + '"]').forEach(v => {
        rgInfo.n.push(v)
    })
    if (rgInfo.q || rgInfo.s || rgInfo.n.length) {
        // console.log('v2', rgInfo)
        // 取消起点、终点的下划线
        cancelNodeBorderToExec(rgInfo.q, ltype)
        cancelNodeBorderToExec(rgInfo.s, ltype)
        // 取消内部的下划线
        if (rgInfo.n.length) {
            let rc1 = rg.cloneContents()
            rc1.querySelectorAll(set.action === 'class' ? '[class*="' + set.class + '"]' : '[style*="border-bottom-style: ' + ltype + '"]').forEach(n => {
                cancelNodeBorderToExec(n, ltype)
            })
            replaceRangeWithFragment(rg, rc1)
        }
        // 强制执行一遍exec，其自动取消下划线节点并分隔(如果起点包含目标元素才执行)
        if (rgInfo.q) {
            window.document.execCommand('styleWithCSS', 0, true)
            window.document.execCommand('Underline', false, null)
        }
        return true
    }
    return false
}
// 下划线
CommandUitl.TextUnderline = cfg => {
    let r1 = getRange()
    // 取消下划线: 尝试当前节点的取消，成功则直接返回
    if (cancelUnderlineWidthRangeAndType(r1, cfg.value)) {
        return true
    }
    // 添加下划线前，强制去掉全部下划线
    underlines.forEach(v => {
        cancelUnderlineWidthRangeAndType(r1, v.type)
    })
    // 开始添加目标下划线
    window.document.execCommand('styleWithCSS', 0, true)
    window.document.execCommand('Underline', false, null)
    // 添加后如果起点无目标则重复执行一次
    let r2 = getRange()
    if (!closestNodeByStyleSheet(r2.startContainer.nodeType === 3 ? r2.startContainer.parentNode : r2.startContainer, 'textDecorationLine', 'underline')) {
        window.document.execCommand('styleWithCSS', 0, true)
        window.document.execCommand('Underline', false, null)
    }
    // 如果起点节点有下划线，更新为cssborder样式
    let r3 = getRange()
    let aq = closestNodeByStyleSheet(r3.startContainer.nodeType === 3 ? r3.startContainer.parentNode : r3.startContainer, 'textDecorationLine', 'underline')
    if (aq) {
        addNodeBorderToExec(aq, cfg.value)
    }
    return true
}
const nodesCss = (ns, cfg) => {
    if (!ns.length) {
        return false
    }
    for (let i = 0; i < ns.length; i++) {
        ns[i].style[cfg.name] = cfg.value
    }
    return true
}
const addUnorderList = type => {
    window.document.execCommand('insertUnorderedList', false, null)
    let r = getRange().cloneRange()
    let n = closestNode('UL', r.startContainer.nodeType === 3 ? r.startContainer.parentNode : r.startContainer)
    if (n) {
        // 添加style
        n.style.listStyleType = type
        n.style.paddingLeft = '2.3rem'
        nodesCss(n.childNodes, { name: 'listStyle', value: 'unset' })
        // 添加class
        n.classList.add('heditor-ul-' + type)
    }
    return true
}
// 无序列表
CommandUitl.UnorderList = cfg => {
    let range = getRange().cloneRange()
    // 当前选区祖先元素有无ul
    let ul = closestNode('UL', range.startContainer.parentNode)
    if (ul) {
        let sty = ul.style.listStyleType
        // console.log('0000:', sty, cfg.value)
        if (sty === cfg.value) {
            // 如果有，当前选区ul设置是否与value一致（一致）则执行命令，取消它
            window.document.execCommand('insertUnorderedList', false, null)
        } else {
            // 如果有，当前选区ul设置是否与value一致（不一致）,则执行2次，添加它 或 修改class和style
            window.document.execCommand('insertUnorderedList', false, null)
            addUnorderList(cfg.value)
        }
    } else {
        // 如果无，直接执行命令
        addUnorderList(cfg.value)
    }
    return true
}
const addOrderList = type => {
    window.document.execCommand('insertOrderedList', false, null)
    let r = getRange().cloneRange()
    let n = closestNode('OL', r.startContainer.nodeType === 3 ? r.startContainer.parentNode : r.startContainer)
    if (n) {
        // 添加style
        n.style.listStyleType = type
        n.style.paddingLeft = '2.3rem'
        nodesCss(n.childNodes, { name: 'listStyle', value: 'unset' })
        // 添加class
        n.classList.add('heditor-ol-' + type)
    }
    return true
}
// 有序列表
CommandUitl.OrderList = cfg => {
    let range = getRange().cloneRange()
    // 当前选区祖先元素有无ul
    let ul = closestNode('OL', range.startContainer.parentNode)
    if (ul) {
        let sty = ul.style.listStyleType
        // console.log('0000:', sty, cfg.value)
        if (sty === cfg.value) {
            // 如果有，当前选区ul设置是否与value一致（一致）则执行命令，取消它
            window.document.execCommand('insertOrderedList', false, null)
        } else {
            // 如果有，当前选区ul设置是否与value一致（不一致）,则执行2次，添加它 或 修改class和style
            window.document.execCommand('insertOrderedList', false, null)
            addOrderList(cfg.value)
        }
    } else {
        // 如果无，直接执行命令
        addOrderList(cfg.value)
    }
    return true
}
CommandUitl.InsertTable = cfg => {
    insertInRange(cfg.value)
    return true
}
// 执行execCommand相关命令，dom变化完成后回调函数
export const execCommand = (cfg = { command: '', bool: false, value: null }, cb) => {
    // let rstb = window.document.execCommand(cfg.command, cfg.bool || false, cfg.value || null)
    let rstb = CommandUitl[cfg.command](cfg)
    if (rstb) {
        nextTick(() => {
            cb(rstb)
        })
    }
    return rstb
}
