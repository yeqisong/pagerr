<template>
    <div class="heditor-borderset__compt heditor-layout-flex__wrap">
        <fieldset>
            <legend>预设样式</legend>
            <div class="heditor-borderset heditor-layout-flex__wrap">
                <div class="heditor-borderset__section heditor-layout-flex__item-grow-1">
                    <!-- <div class="heditor-borderset__desc">线型设置</div> -->
                    <div class="heditor-borderset__area">
                        <div class="heditor-borderset__area-title">类型</div>
                        <div class="heditor-borderset__area-body">
                            <div class="heditor-box-select heditor-box-select__type">
                                <div
                                    v-for="(t,idx) in btypes"
                                    :key="idx"
                                    :data-value="t.value"
                                    :style="{
                                        borderBottomStyle: t.value,
                                        borderBottomWidth:t.width
                                    }"
                                    class="heditor-box-select__option"
                                    :class="{
                                        selected: lineStyleType===t.value
                                    }"
                                    @click.stop="handleTypeSelected($event, t.value)"
                                >{{ t.name }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="heditor-borderset__area">
                        <div class="heditor-borderset__area-title">颜色</div>
                        <div class="heditor-borderset__area-body">
                            <popu-color-picker v-model:color="lineStyleColor" mode="fk" :picker-props="{format:'hex8'}" />
                        </div>
                    </div>
                    <div class="heditor-borderset__area">
                        <div class="heditor-borderset__area-title">线宽</div>
                        <div class="heditor-borderset__area-body">
                            <div class="heditor-box-select heditor-box-select__width">
                                <div
                                    v-for="(w, idx) in bwidths"
                                    :key="idx"
                                    :data-value="w.value"
                                    :style="{
                                        borderBottomWidth: w.value,
                                        borderBottomStyle: 'solid'
                                    }"
                                    class="heditor-box-select__option"
                                    :class="{
                                        selected: lineStyleWidth === w.value
                                    }"
                                    @click.stop="handleWidthSelected($event, w.value)"
                                >{{ w.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>预览设置</legend>
            <div class="heditor-borderset heditor-layout-flex__wrap">
                <div class="heditor-borderset__section heditor-layout-flex__item-grow-1">
                    <!-- <div class="heditor-borderset__desc">预览设置</div> -->
                    <div class="heditor-borderset__area">
                        <div class="heditor-borderset__area-title">点击对应位置设置边框预览</div>
                        <div class="heditor-borderset__area-body">
                            <table
                                class="heditor-borderset__tian-wrap"
                                @click.stop="handlePreset($event)"
                            >
                                <tr>
                                    <td style="width:20%; height:80%;">
                                        <div class="heditor-layout-flex__wrap heditor-layout-flex__wrap-direction-column heditor-layout-flex__wrap-justify-between" style="height:100%;">
                                            <span
                                                class="heditor-borderset__set heditor-borderset__set-h heditor-borderset__set-top"
                                                :class="{
                                                    selected: !(b.outBorderTop === 'none')
                                                }"
                                                data-border="outBorderTop"
                                            >&nbsp;</span>
                                            <span
                                                class="heditor-borderset__set heditor-borderset__set-h heditor-borderset__set-middle"
                                                :class="{
                                                    selected: !(b.inBorderHorization === 'none')
                                                }"
                                                data-border="inBorderHorization"
                                            >&nbsp;</span>
                                            <span
                                                class="heditor-borderset__set heditor-borderset__set-h heditor-borderset__set-bottom"
                                                :class="{
                                                    selected: !(b.outBorderBottom === 'none')
                                                }"
                                                data-border="outBorderBottom"
                                            >&nbsp;</span>
                                        </div>
                                    </td>
                                    <td style="width:80%; height:80%;">
                                        <table
                                            class="heditor-borderset__tian"
                                            style="width:100%; height:100%;"
                                            :style="{
                                                borderTop: b.outBorderTop==='none'?'none':b.outBorderTop,
                                                borderLeft: b.outBorderLeft==='none'?'none':b.outBorderLeft,
                                                borderBottom: b.outBorderBottom==='none'?'none':b.outBorderBottom,
                                                borderRight: b.outBorderRight==='none'?'none':b.outBorderRight,
                                            }"
                                            @mousemove.stop="handleTianOver($event)"
                                        >
                                            <tr>
                                                <td
                                                    style="width:50%; height:50%;"
                                                    class="tian-td"
                                                    :style="{
                                                        borderRight: b.inBorderVertical==='none'?'none':b.inBorderVertical,
                                                        borderBottom: b.inBorderHorization ==='none'?'none':b.inBorderHorization
                                                    }"
                                                >&nbsp;</td>
                                                <td
                                                    style="width:50%; height:50%;"
                                                    class="tian-td"
                                                    :style="{
                                                        borderBottom: b.inBorderHorization ==='none'?'none':b.inBorderHorization
                                                    }"
                                                >&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="width:50%; height:50%;"
                                                    class="tian-td"
                                                    :style="{
                                                        borderRight: b.inBorderVertical==='none'?'none':b.inBorderVertical
                                                    }"
                                                >&nbsp;</td>
                                                <td style="width:50%; height:50%;" class="tian-td">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width:20%; height:20%;">
                                    &nbsp;
                                    </td>
                                    <td style="width:80%; height:80%;" class="">
                                        <div class="heditor-layout-flex__wrap heditor-layout-flex__wrap-justify-between">
                                            <span
                                                class="heditor-borderset__set heditor-borderset__set-v heditor-borderset__set-left"
                                                :class="{
                                                    selected: !(b.outBorderLeft === 'none')
                                                }"
                                                data-border="outBorderLeft"
                                            >&nbsp;</span>
                                            <span
                                                class="heditor-borderset__set heditor-borderset__set-v heditor-borderset__set-center"
                                                :class="{
                                                    selected: !(b.inBorderVertical === 'none')
                                                }"
                                                data-border="inBorderVertical"
                                            >&nbsp;</span>
                                            <span
                                                class="heditor-borderset__set heditor-borderset__set-v heditor-borderset__set-right"
                                                :class="{
                                                    selected: !(b.outBorderRight === 'none')
                                                }"
                                                data-border="outBorderRight"
                                            >&nbsp;</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="heditor-borderset__area">
                        <div class="heditor-borderset__area-title">应用于</div>
                        <div class="heditor-borderset__area-body">
                            <select
                                class="heditor-borderset__ying"
                                :disabled="!applyToUpdate"
                            >
                                <option
                                    value="TABLE"
                                    :selected="applyTo==='TABLE'"
                                >表格</option>
                                <option
                                    value="TEXT"
                                    :selected="applyTo==='TEXT'"
                                >文本</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
</template>
<script>
import { defineComponent, reactive, ref, watch } from '@vue/runtime-core'
import { throttle } from '../../use/useUtil'
export default defineComponent({
    name : 'BordersPannel',
    props: {
        outBorderTop: {
            type   : String,
            default: 'none'
        }, // 外边框-上
        outBorderRight: {
            type   : String,
            default: 'none'
        }, // 外边框-右
        outBorderBottom: {
            type   : String,
            default: 'none'
        }, // 外边框-下
        outBorderLeft: {
            type   : String,
            default: 'none'
        }, // 外边框-左
        inBorderHorization: {
            type   : String,
            default: 'none'
        }, // 内边框-横线
        inBorderVertical: {
            type   : String,
            default: 'none'
        }, // 内边框-竖
        description: {
            type   : String,
            default: undefined
        },
        applyTo: {
            type   : String,
            default: 'TABLE'
        },
        applyToUpdate: {
            type   : Boolean,
            default: false
        }
    },
    emits: ['border',
            'update:outBorderTop',
            'update:outBorderRight',
            'update:outBorderBottom',
            'update:outBorderLeft',
            'update:inBorderHorization',
            'update:inBorderVertical'],
    setup(props, { emit }) {
        // 边框样式汇总
        const btypes = [
            {
                name : '无',
                value: 'none',
                width: '1px'
            },
            {
                name : '点线',
                value: 'dotted',
                width: '1px'
            },
            {
                name : '虚线',
                value: 'dashed',
                width: '1px'
            },
            {
                name : '实线',
                value: 'solid',
                width: '1px'
            },
            {
                name : '双实线（3px才有效果）',
                value: 'double',
                width: '3px'
            },
            {
                name : '3D 凹槽',
                value: 'groove',
                width: '3px'
            },
            {
                name : '3D 垄状',
                value: 'ridge',
                width: '3px'
            },
            {
                name : '3D inset',
                value: 'inset',
                width: '3px'
            },
            {
                name : '3D outset',
                value: 'outset',
                width: '3px'
            }
        ]
        // 边框宽度汇总
        const bwidths = [
            {
                name : '0.5px',
                value: '0.5px'
            },
            {
                name : '1px',
                value: '1px'
            },
            {
                name : '2px',
                value: '2px'
            },
            {
                name : '3px',
                value: '3px'
            },
            {
                name : '4px',
                value: '4px'
            }
        ]
        // 当前设置的线型
        const lineStyleType = ref('solid')
        const lineStyleColor = ref('#555555FF')
        const lineStyleWidth = ref('0.5px')
        // 预设线型
        const handleTypeSelected = (event, type) => {
            lineStyleType.value = type
        }
        // 预设线宽
        const handleWidthSelected = (event, type) => {
            lineStyleWidth.value = type
        }
        // 预览设置
        const b = reactive({
            // outBorderTop      : 'none', // 外边框-上
            // outBorderRight    : 'none', // 外边框-右
            // outBorderBottom   : 'none', // 外边框-下
            // outBorderLeft     : 'none', // 外边框-左
            // inBorderHorization: 'none', // 内边框-横线
            // inBorderVertical  : 'none'// 内边框-竖
            outBorderTop      : props.outBorderTop, // 外边框-上
            outBorderRight    : props.outBorderRight, // 外边框-右
            outBorderBottom   : props.outBorderBottom, // 外边框-下
            outBorderLeft     : props.outBorderLeft, // 外边框-左
            inBorderHorization: props.inBorderHorization, // 内边框-横线
            inBorderVertical  : props.inBorderVertical// 内边框-竖
        })
        const handlePreset = event => {
            let target = event.target
            // 处理快捷设置
            if (target.classList.contains('heditor-borderset__set')) {
                target.classList.toggle('selected')
                // 如果设置为选中状态，其对应的border要设置为当前的预设
                if (target.classList.contains('selected')) {
                    b[target.dataset.border] = `${lineStyleType.value} ${lineStyleColor.value} ${lineStyleWidth.value}`
                } else {
                    b[target.dataset.border] = 'none'
                }
            }
            // 根据tian-td点击的位置，设置边框
            if (target.classList.contains('tian-td') && target.classList.contains('can-border-set') && target.dataset.border) {
                b[target.dataset.border] = b[target.dataset.border] === 'none' ? `${lineStyleType.value} ${lineStyleColor.value} ${lineStyleWidth.value}` : 'none'
            }
            // console.log(event.target)
        }
        // 在预览田中移动时，靠近边框，改变鼠标，提示可以点击
        const tian = {
            't-0-0': {
                left  : 'outBorderLeft',
                top   : 'outBorderTop',
                right : 'inBorderVertical',
                bottom: 'inBorderHorization'
            },
            't-0-1': {
                left  : 'inBorderVertical',
                top   : 'outBorderTop',
                right : 'outBorderRight',
                bottom: 'inBorderHorization'
            },
            't-1-0': {
                left  : 'outBorderLeft',
                top   : 'inBorderHorization',
                right : 'inBorderVertical',
                bottom: 'outBorderBottom'
            },
            't-1-1': {
                left  : 'inBorderVertical',
                top   : 'inBorderHorization',
                right : 'outBorderRight',
                bottom: 'outBorderBottom'
            }
        }
        const handleTianOver = throttle(event => {
            let target = event.target
            // 通过td来设置鼠标状态
            if (target.classList.contains('tian-td')) {
                // 定位是td的哪一个方向
                let direct = event.offsetX > 0 && event.offsetX < 5 ? 'left'
                    : event.offsetX > target.offsetWidth - 5 && event.offsetX < target.offsetWidth ? 'right'
                        : event.offsetY > 0 && event.offsetY < 5 ? 'top'
                            : event.offsetY > target.offsetHeight - 5 && event.offsetY < target.offsetHeight ? 'bottom' : ''
                // 定位是哪一个td
                let whichtd = `t-${target.parentNode.rowIndex}-${target.cellIndex}`
                if (direct !== '') {
                    target.classList.add('can-border-set')
                    target.dataset.border = tian[whichtd][direct]
                } else {
                    target.classList.remove('can-border-set')
                    target.dataset.border = ''
                }
            }
        }, 200)
        // 监测b的变化，反馈父组件
        watch(b, lb => {
            // 双向绑定返回
            emit('update:outBorderTop', lb.outBorderTop)
            emit('update:outBorderRight', lb.outBorderRight)
            emit('update:outBorderBottom', lb.outBorderBottom)
            emit('update:outBorderLeft', lb.outBorderLeft)
            emit('update:inBorderHorization', lb.inBorderHorization)
            emit('update:inBorderVertical', lb.inBorderVertical)
            // 通过自定义事件一次性返回
            emit('border', lb)
        })
        return {
            btypes,
            bwidths,
            lineStyleType,
            handleTypeSelected,
            lineStyleColor,
            lineStyleWidth,
            handleWidthSelected,
            b,
            handlePreset,
            handleTianOver
        }
    }
})
</script>
<style scoped>
.heditor-borderset__compt{
    min-width: 650px;
}
.heditor-borderset__area{
    margin-bottom: 10px;
    margin-top: 10px;
}
.heditor-borderset__area-title{
    margin-bottom: 10px;
}
.heditor-borderset__desc{
    font-weight: 700;
}
.heditor-box-select__option{
    font-size: 12px;
}
.heditor-box-select__type, .heditor-box-select__width{
    width: 200px;
    height: 80px;
    border: 1px solid #eee;
    border-radius: 3px;
}
.heditor-borderset__tian-wrap{
    width: 200px;
    height: 200px;
    border: none;
    border-spacing: 0px;
}
table.heditor-borderset__tian{
    border-spacing: 0px;
    border:none;
}
table.heditor-borderset__tian td{
    border: none;
}
td.tian-td{
    background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjE4MzkxMDI3OTAzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM3MTYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTg5NiA4MDBhMzIgMzIgMCAwIDEgNS43NiA2My40ODhMODk2IDg2NEgxMjhhMzIgMzIgMCAwIDEtNS43Ni02My40ODhMMTI4IDgwMGg3Njh6IG0wLTIxMy4zMTJhMzIgMzIgMCAwIDEgNS43NiA2My40ODhsLTUuNzYgMC41MTJIMTI4YTMyIDMyIDAgMCAxLTUuNzYtNjMuNDg4TDEyOCA1ODYuNjg4aDc2OHogbTAtMjEzLjM3NmEzMiAzMiAwIDAgMSA1Ljc2IDYzLjQ4OGwtNS43NiAwLjUxMkg1MTJhMzIgMzIgMCAwIDEtNS43Ni02My40ODhMNTEyIDM3My4zMTJoMzg0eiBtLTYzOS41NTItMjA0LjhsMy43NzYgNC4xNiAzLjA3MiA0Ljk5MkwzNjkuOTIgMzkxLjA0YTMyIDMyIDAgMCAxLTU0LjIwOCAzMy41MzZsLTMuMDcyLTQuOTI4LTEyLjU0NC0yNS4wMjRIMTY5LjA4OGwtMTIuNDggMjQuOTZhMzIgMzIgMCAwIDEtNTkuMzI4LTIzLjE2OGwyLjExMi01LjM3NiAxMDYuNjI0LTIxMy4zNzZhMzIuMDY0IDMyLjA2NCAwIDAgMSA1MC40MzItOS4yMTZ6IG0tMjEuODI0IDk0Ljk3NmwtMzMuNTM2IDY3LjEzNkgyNjguMTZsLTMzLjUzNi02Ny4xMzZ6TTg5NiAxNjBhMzIgMzIgMCAwIDEgNS43NiA2My40ODhMODk2IDIyNEg1MTJhMzIgMzIgMCAwIDEtNS43Ni02My40ODhMNTEyIDE2MGgzODR6IiBwLWlkPSIzNzE3IiBmaWxsPSIjY2RjZGNkIj48L3BhdGg+PC9zdmc+');
    background-size: 80% 80%;
    background-position: center;
    background-repeat: no-repeat;
}
.heditor-borderset__ying{
    width: 150px;
}
.heditor-borderset__set{
    width: 30px;
    height: 30px;
    display: inline-block;
    border: 1px solid #eee;
    margin: 5px;
    cursor: pointer;
    transition: all .5s;
}
.heditor-borderset__set-h, .heditor-borderset__set-v{
    position: relative;
}
.heditor-borderset__set-h::before{
    content: '';
    display: block;
    width: 80%;
    height: 0px;
    line-height: 0px;
    font-size: 0px;
    left: 10%;
    position: absolute;
    border-top: 1px solid #555;
}
.heditor-borderset__set-h.heditor-borderset__set-top::before{
    top:2px;
}
.heditor-borderset__set-h.heditor-borderset__set-middle::before{
    top:50%;
}
.heditor-borderset__set-h.heditor-borderset__set-bottom::before{
    bottom:2px;
}
.heditor-borderset__set-v::before{
    content: '';
    display: block;
    width: 0px;
    height: 80%;
    line-height: 0px;
    font-size: 0px;
    top: 10%;
    position: absolute;
    border-left: 1px solid #555;
}
.heditor-borderset__set-v.heditor-borderset__set-left::before{
    left:2px;
}
.heditor-borderset__set-v.heditor-borderset__set-center::before{
    left:50%;
}
.heditor-borderset__set-v.heditor-borderset__set-right::before{
    right:2px;
}
.heditor-borderset__set:hover{
    border:1px solid #409EFF;
    border:1px solid var(--hdprimary);
}
.heditor-borderset__set.selected{
    background-color: #409EFF;
    background-color: var(--hdprimary);
    border:1px solid #409EFF;
    border:1px solid var(--hdprimary);
}
.heditor-borderset__set.selected::before{
    border-color: #fff;
}
.can-border-set{
    cursor: pointer;
}
</style>
