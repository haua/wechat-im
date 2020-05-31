//app.js
import ImServer from './utils/weapp.socket.io/ImServer'

App({
    globalData: {
        userInfo: {},
    },
    getIMHandler() {
        return this.imServer;
    },
    onLaunch(options) {
        this.imServer = new ImServer();
        this.imServer.imStart('123456789') // 传入正确的token

        this.imServer.on('login', (msg) => {
            this.globalData._isLogin = true;
            this.globalData.userInfo = msg.userInfo;
            this.globalData.friendsId = msg.friendsId;

            // todo 在登录前发的消息，这里可以写代码再次发送
        })
    },
    onHide() {
    },
    onShow(options) {
    }
});
