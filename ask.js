module.exports = {
    question: [
        {
            type: 'YN',
            field: 'useWechat',
            question: '是否使用微信'
        },
        {
            type: 'radio',
            field: 'radio',
            question: '测试单选询问功能',
            params: ['单选询问111', '单选询问222'],
        },
        {
            type: 'check',
            field: 'check',
            question: '测试多选询问功能',
            params: ['多选询问111', '多选询问222', '多选询问333'],
        },
    ],
    methods: {}
};