import { htmlToFragment, throttle, uuid } from '../use/useUtil'
import Selector from './Selector'
const Xtmap = new Map()
class Xt {
    table = null
    // 表格最大行数和列表
    tableNum = {
        row: 0,
        col: 0
    }
    // 单元格操作类型
    cellFuncTypeEnum = {
        SELECTED: 'select', // 多选单元格
        RESIZEH : 'resizeh', // 调整列宽
        RESIZEV : 'resizev' // 调整行高
    }
    // 当前单元格的操作类型（正在进行什么操作）
    cellFuncTypeNow = undefined
    // 选中的单元格
    selectedCells = null
    // 选中操作标识
    selecting = false
    selectingCell=''
    selectingNCell=''
    // 选中的起止单元格
    selectedCellsFlag = {
        start: {
            row: undefined,
            col: undefined
        },
        end: {
            row: undefined,
            col: undefined
        }
    }
    // 列表调整标识
    resizingh = false
    // 行高调整标识
    resizingv = false
    resizingFlag = {
        cell    : null,
        cellInfo: {
            row: undefined,
            col: undefined
        },
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        }
    }
    // 构造函数，每个tabel node只会被实例化一次
    constructor(selector, context) {
        let table = Selector(selector)
        // 如果不是table，则不实例化
        if (table[0].nodeName !== 'TABLE') {
            return table
        }
        // console.log('class selector:', selector, table, Xtmap.get(table[0]))
        // console.log('---:', Xtmap.get(table[0]))
        // 每个node只实例化一次，返回实例
        if (Xtmap.get(table[0])) {
            return Xtmap.get(table[0])
        } else {
            this.table = table
            this._setTableId()
            this._updateCellData()
            Xtmap.set(table[0], this)
            this._initEvent()
            return this
        }
    }
    // 设置表格唯一标识
    _setTableId () {
        let f = uuid()
        this.table[0].classList.add('heditor-xtable-' + f)
        this.table[0].dataset.htable = 'heditor-xtable-' + f
    }
    // 全部单元格
    _allCells () {
        return this.table.children('td')
    }
    // 更新各个单元格的data-row和data-col属性，方便查询
    _updateCellData () {
        // 设置表格的行列信息
        this.tableNum = {
            row: this.table[0].rows.length,
            col: this.table[0].rows[0].cells.length
        }
        // 设置各单元格标识
        let cells = this._allCells()[0]
        cells.forEach(c => {
            c.dataset.row = c.parentNode.rowIndex
            c.dataset.col = c.cellIndex
            // 标记第一行/列
            c.dataset.firstRow = c.parentNode.rowIndex === 0 ? '1' : '0'
            c.dataset.firstCol = c.cellIndex === 0 ? '1' : '0'
            // 标记最后行/列
            c.dataset.endRow = c.parentNode.rowIndex === this.tableNum.row - 1 ? '1' : '0'
            c.dataset.endCol = c.cellIndex === this.tableNum.col - 1 ? '1' : '0'
        })
    }
    // 获取指定行的单元格
    getCellsByRow (idx) {
        return this.table.children('td[data-row="' + idx + '"]')
    }
    // 获取指定列的单元格
    getCellsByCol (idx) {
        return this.table.children('td[data-col="' + idx + '"]')
    }
    // 获取选中的单元格
    getSelectedCells () {
        return this.table.children('td[class*="hselected"]')
    }
    // 获取首尾单元格
    // 清除单元格选中标识
    _clearSelectedCellsFlag () {
        this.selectedCellsFlag = {
            start: {
                row: undefined,
                col: undefined
            },
            end: {
                row: undefined,
                col: undefined
            }
        }
    }
    // 选中状态
    _clearSelectedStatus () {
        this._allCells().removeClass('hselected', 'hselected-left', 'hselected-right', 'hselected-top', 'hselected-bottom')
    }
    _setSelectedStatus (cfg) {
        Object.assign(this.selectedCellsFlag, cfg)
    }
    // 设置resize数据
    _setResizingFlag (cfg) {
        Object.assign(this.resizingFlag, cfg)
    }
    _clearResizingFlag () {
        this.resizingFlag = {
            cell    : null,
            cellInfo: {
                row: undefined,
                col: undefined
            },
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            }
        }
    }
    // 设置一个区间的td为选中状态
    _setCellsSelectedRange ({ start, end }) {
        let cells = this._allCells()
        // 如果是倒拖，则先把start和end交换
        if (start.row > end.row || start.col > end.col) {
            [end, start] = [start, end]
        }
        // 添加选中样式
        cells[0].forEach(td => {
            td.classList.remove('hselected', 'hselected-left', 'hselected-right', 'hselected-top', 'hselected-bottom')
            if (td.cellIndex >= start.col && td.cellIndex <= end.col && td.parentNode.rowIndex >= start.row && td.parentNode.rowIndex <= end.row) {
                td.classList.add('hselected')
                if (td.cellIndex === start.col) {
                    // 左边
                    td.classList.add('hselected-left')
                }
                if (td.cellIndex === end.col) {
                    // 右边
                    td.classList.add('hselected-right')
                }
                if (td.parentNode.rowIndex === start.row) {
                    // 上边
                    td.classList.add('hselected-top')
                }
                if (td.parentNode.rowIndex === end.row) {
                    // 下边
                    td.classList.add('hselected-bottom')
                }
            }
        })
        return cells
    }
    // 获取事件
    _event (event) {
        return event || window.event
    }
    // 获取事件对象
    _target (event) {
        let e = event || window.event
        return e.target
    }
    // 清除操作事件
    _removeEvent (event) {
        let _this = this
        this.selecting = false
        // this._clearSelectedStatus()
    }
    // 设置单元格操作类型
    _setCellFuncType (event, bool = true) {
        if (bool === false) {
            this.cellFuncTypeNow = null
            return this.cellFuncTypeNow
        }
        let _event = this._event(event)
        let target = this._target(event)
        // console.log(_event.offsetY, target.offsetHeight)
        if (_event.offsetX < target.offsetWidth && _event.offsetX > target.offsetWidth - 5) {
            // 调整列宽
            this.cellFuncTypeNow = this.cellFuncTypeEnum['RESIZEH']
        } else if (_event.offsetY < target.offsetHeight && _event.offsetY > target.offsetHeight - 5) {
            // 调整行高
            this.cellFuncTypeNow = this.cellFuncTypeEnum['RESIZEV']
        } else {
            // 选择表格
            this.cellFuncTypeNow = this.cellFuncTypeEnum['SELECTED']
        }
        return this.cellFuncTypeNow
    }
    // 绑定事件
    _initEvent () {
        let _this = this
        // 单元格事件
        this.table.on('mousedown', event => {
            _this.multipleSelectCellsStart()
            _this.cellResizeStart()
        })
        this.table.on('mousemove', throttle(event => {
            _this.multipleSelectCellsMove(event)
            _this.cellResizeMove(event)
        }, 100))
        this.table.on('mouseup', event => {
            _this.multipleSelectCellsEnd()
            _this.cellResizeEnd()
        })
        // 移除时清除
        this.table.on('mouseleave', event => { _this._removeEvent() })
    }
    // 判断有无选中的单元格
    hasSelectedCells () {
        return this.selectedCellsFlag.start.row >= 0
    }
    // 拖动选中单元格-开始
    multipleSelectCellsStart (event) {
        let cft = this._setCellFuncType(event)
        // 如果是选择操作
        if (cft === this.cellFuncTypeEnum['SELECTED']) {
            // 清空
            this._clearSelectedCellsFlag()
            this._clearSelectedStatus()
            // 设置选中
            this.selecting = true
            let target = this._target(event)
            target.classList.add('hselected')
            // 设置开始位置
            this._setSelectedStatus({
                start: {
                    row: target.parentNode.rowIndex,
                    col: target.cellIndex
                },
                end: {
                    row: target.parentNode.rowIndex,
                    col: target.cellIndex
                }
            })
            this._setCellsSelectedRange(this.selectedCellsFlag)
        }
    }
    // 拖动选中单元格-过程中
    multipleSelectCellsMove (event) {
        if (this.selecting) {
            // 当前为结束单元格，起点到终点之间的单元格设置为选中
            let target = this._target(event)
            let c = {
                row: target.parentNode.rowIndex,
                col: target.cellIndex
            }
            this.selectingNCell = `1-${c.row}-${c.col}`
            // 在单元格内部移动时不触发dom操作
            if (this.selectingNCell !== this.selectingCell) {
                // console.log('---:', this.selectingNCell, this.selectingNCell)
                // 设置终点
                this._setSelectedStatus({
                    end: c
                })
                // 设置区域的选中状态
                this._setCellsSelectedRange(this.selectedCellsFlag)
                this.selectingCell = this.selectingNCell
            }
        }
    }
    // 拖动选中单元格-结束
    multipleSelectCellsEnd (event) {
        this.selecting = false
        this._setCellFuncType(event, false)
    }
    // 触发表格大小调整
    cellResizeStart (event) {
        let _event = this._event(event)
        let target = this._target(event)
        let cft = this._setCellFuncType(event)
        if (cft === this.cellFuncTypeEnum['RESIZEH']) {
            this.resizingh = true
            this._setResizingFlag({
                cell    : target,
                cellInfo: {
                    row: target.parentNode.rowIndex,
                    col: target.cellIndex
                },
                start: {
                    x: _event.offsetX
                }
            })
        } else if (cft === this.cellFuncTypeEnum['RESIZEV']) {
            this.resizingv = true
            this._setResizingFlag({
                cell    : target,
                cellInfo: {
                    row: target.parentNode.rowIndex,
                    col: target.cellIndex
                },
                start: {
                    y: _event.offsetY
                }
            })
        }
    }
    // 正在表格大小调整
    cellResizeMove (event) {
        let _event = this._event(event)
        let target = this._target(event)
        // console.log(_event.offsetY, target.offsetHeight)
        if (_event.offsetX < target.offsetWidth && _event.offsetX > target.offsetWidth - 5) {
            target.classList.remove('hresize-v')
            target.classList.add('hresize-h')
        } else if (_event.offsetY < target.offsetHeight && _event.offsetY > target.offsetHeight - 5) {
            target.classList.remove('hresize-h')
            target.classList.add('hresize-v')
        } else {
            target.classList.remove('hresize-h', 'hresize-v')
        }
        // 调整列宽
        if (this.resizingh) {
            // 当前值-初始值，即为新的宽度
            this._setResizingFlag({
                end: {
                    x: _event.offsetX
                }
            })
            console.log('999:', this.table[0].rows[1])
            // console.log('****:', this.resizingFlag, this.getCellsByCol(target.cellIndex))
        }
        // 调整行高
    }
    // 表格调整结束
    cellResizeEnd (event) {
        this.resizingh = false
        this.resizingv = false
        this._setCellFuncType(event, false)
        this._clearResizingFlag()
    }
    // 合并单元格
    _merge_cell (table, startPoint, rectangle) {
    }
    // 设置表头
    setRowHead () {
        console.log('===:', this.table[0])
    }
    // 设置尺寸
    setSize (cfg, cb = null) {
        // console.log('class setsize:', cfg, this.table)
        // console.log('----:', this.selectedCellsFlag)
        if (!cfg.width && (!cfg.height)) {
            return false
        }
        if (this.hasSelectedCells()) {
            // 如果当前选中了单元格，则为单元格设置
            this._setSelectedCellsSize(cfg)
        } else {
            // 如果当前全选或者未选单元格，则为表格设置
            this._setTableSize(cfg)
        }
        if (cb) {
            cb()
        }
        return true
    }
    _setTableSize ({ width, height }) {
        this.table.css({
            width : width || this.table.css('width'),
            height: height || this.table.css('height')
        })
        return this
    }
    _setSelectedCellsSize ({ width, height }) {
        this.getSelectedCells().css({
            width : width || this.table.css('width'),
            height: height || this.table.css('height')
        })
    }
    // 设置边框
    setBorder (cfg, cb = null) {
        console.log(cfg)
        if (this.hasSelectedCells()) {
            // 如果选择了单元格，则为单元格设置
            this._setSelectedCellsBorder(cfg)
        } else {
            // 否则为整个表格设置
            this._setTableBorder(cfg)
        }
    }
    _setTableBorder (cfg) {
        // table设置外框
        this.table.css({
            borderTop   : cfg.outBorderTop,
            borderRight : cfg.outBorderRight,
            borderBottom: cfg.outBorderBottom,
            borderLeft  : cfg.outBorderLeft
        })
        // td设置内框
        this._allCells().css({
            borderBottom: cfg.inBorderHorization,
            borderTop   : cfg.inBorderHorization,
            borderRight : cfg.inBorderVertical,
            borderLeft  : cfg.inBorderVertical
        })
    }
    _setSelectedCellsBorder (cfg) {
        console.log('---:', this.table[0].rows)
    }
}
const Xtable = (selector, context) => new Xt(selector, context)
export default Xtable
