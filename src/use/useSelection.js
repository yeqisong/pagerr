import { htmlToFragment } from './useUtil'
// 获取当前selection
export const getSelection = () => {
    let selection
    if (window.getSelection) {
    // 现代浏览器
        selection = window.getSelection()
    } else if (document.selection) {
    // IE
        selection = document.selection.createRange()
    }
    return selection
}
// 获取当前range
export const getRange = () => {
    let selection = getSelection()
    if (selection.rangeCount < 1) {
        return false
    }
    return selection.getRangeAt(0)
}
// 在range处插入
export const insertAtRange = (source, selection) => {
    let range
    if (typeof source === 'string') {
        source = htmlToFragment(source)
    }
    if (window.getSelection) {
        selection = selection || getSelection()
        range = selection.getRangeAt(0).cloneRange()
        range.deleteContents()
        range.insertNode(source)
        range.collapse(false)
        // console.log(range)
        // range.endContainer.focus()
        selection.removeAllRanges()
        selection.addRange(range)
    } else if (document.selection && document.selection.type !== 'Control') {
        // IE < 9
        (selection || document.selection).createRange().pasteHTML(html)
    }
}
// 在range中插入
export const insertInRange = (source, selection) => {
    let range = getRange()
    if (typeof source === 'string') {
        source = htmlToFragment(source)
    }
    range.deleteContents()
    range.insertNode(source)
}
/**
 * 是否是有效选区，即选区node的父节点中是否包含指定class
 * @param {*} node
 * @returns
 */
export const isEffectRange = (node, pclass = 'heditor-content__canvas') => {
    if (!node) {
        return false
    }
    if (node.classList && node.classList.contains(pclass)) {
        return true
    }
    if (node.parentNode) {
        return isEffectRange(node.parentNode)
    }
    return false
}
/**
 * 恢复选区到页面上
 * @param {*} range
 */
export const rescoveryRange = range => {
    let s = getSelection()
    s.removeAllRanges()
    s.addRange(range)
    return s
}
/**
 * 安全恢复选区，并执行回调函数
 * @param {*} range
 * @param {*} cb
 */
export const reselectRange = (range, cb) => {
    if (range && isEffectRange(range.endContainer)) {
        let s = rescoveryRange(range)
        if (cb) { cb(s) }
    } else {
        if (cb) { cb() }
    }
}
/**
 * 扩大选区到整个节点，主要是选择部分A标签，扩大到整个A标签
 * @param {*} source
 * @returns
 */
export const expandRange = source => {
    let range = getRange()
    range.setStart(range.startContainer, 0)
    range.setEnd(range.startContainer, range.startContainer.length)
    return range
}
/**
 * 将节点设置为选区
 * @param {*} node
 * @returns
 */
export const setRangeByNode = node => {
    let range = getRange()
    // if (node && node.nodeName === '#document-fragment') {
    // }
    range.setStart(node, 0)
    range.setEnd(node, node.childNodes.length)
    return range
}
