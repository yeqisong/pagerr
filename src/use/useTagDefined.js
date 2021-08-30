/**
 * 节点命令格式化定义
 * key：命令名称
 * target：格式化的节点
 * format：需统一的节点标签，比如b和strong都表示加粗，在本编辑器将统一为b
 */
export default {
    Bold: {
        target: 'B',
        format: ['B', 'STRONG']
    }
}
