// pages/chat-list/chat-list.js

/**
 * 会话列表页面
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        conversations: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    // 跳转到指定好友聊天页
    toChat(e) {
        let item = e.currentTarget.dataset.item;
        delete item.latestMsg;
        delete item.unread;
        delete item.content;
        wx.navigateTo({
            url: `../chat/chat?friend=${JSON.stringify(item)}`
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        getApp().getIMHandler().on('get-conversations', (msg) => {
            console.log('更新会话列表', msg);
            msg.type === 'get-conversations' && this.setData({conversations: msg.conversations.map(item => this.getConversationsItem(item))})
        });
        // 前端可以不用主动获取，登录成功后，后端会通知前端
        // try {
        //     await getApp().getIMHandler().emit('get-conversations', {
        //         type: 'get-conversations',
        //         userId: getApp().globalData.userInfo.userId
        //     });
        //     console.log('获取会话列表消息发送成功');
        // } catch (e) {
        //     console.log('获取会话列表失败', e);
        // }
    },

    getConversationsItem(item) {
        let {latestMsg, ...msg} = item;
        return Object.assign(msg, JSON.parse(latestMsg));
    }
});
