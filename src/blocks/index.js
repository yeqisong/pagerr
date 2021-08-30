const imgs = {
    wbig   : 'https://dyimg.bosslib.com/w_bg_big.png',
    wmedium: 'https://dyimg.bosslib.com/w_bg_medium.png',
    wsmall : 'https://dyimg.bosslib.com/w_bg_small.png',
    hbig   : 'https://dyimg.bosslib.com/h_bg_big.png',
    hmedium: 'https://dyimg.bosslib.com/h_bg_medium.png',
    hsmall : 'https://dyimg.bosslib.com/h_bg_small.png'
}
export default [
    {
        name    : 'pagerr_block_bbntg',
        title   : '背景全宽前景文本',
        type    : '未分类',
        icon    : '',
        thumb   : 'https://dyimg.bosslib.com/block1.png',
        editable: {
            ed1: ['width', 'height', 'background', 'goup', 'godown', 'nullbr', 'delete'],
            ed2: ['width', 'height', 'background']
        },
        content: `
            <div class="pagerr-block pagerr-edit" data-nest="false" data-name="pagerr_block_bbntg" data-editable="ed1">
                <div class="container pagerr-edit" data-name="pagerr_block_bbntg" data-editable="ed2">
                    <div class="row">
                        <div class="col">
                            这里输入文本...
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        name    : 'pagerr_block_bbnim',
        title   : '背景全宽前景图片',
        type    : '未分类',
        icon    : '',
        thumb   : 'https://dyimg.bosslib.com/block2.png',
        editable: {
            ed1: ['width', 'height', 'background', 'goup', 'godown', 'nullbr', 'delete'],
            ed2: ['width', 'image', 'nullbr']
        },
        content: `
            <div class="pagerr-block pagerr-edit" data-nest="false" data-name="pagerr_block_bbnim" data-editable="ed1">
                <div class="container" >
                    <div class="row">
                        <div class="col">
                            <img class="pagerr-edit" data-name="pagerr_block_bbnim" data-editable="ed2" style="width:100%;"
                                src="https://dyimg.bosslib.com/def_img.png" />
                        </div>
                    </div>
                </div>
            </div>
        `
    }
]
