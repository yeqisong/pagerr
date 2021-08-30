// 通过border或class来模拟下划线
export default [
    {
        name  : '直线',
        type  : 'solid',
        action: 'css',
        width : '1px'
    },
    {
        name  : '点线',
        type  : 'dotted',
        action: 'css',
        width : '1px'
    },
    {
        name  : '虚线',
        type  : 'dashed',
        action: 'css',
        width : '1px'
    },
    {
        name  : '双直线',
        type  : 'double',
        action: 'css',
        width : '3px'
    },
    {
        name  : '波浪线,IE10以上支持',
        type  : 'wave',
        action: 'class',
        class : 'pagerr-underline__wave'
    }
]
