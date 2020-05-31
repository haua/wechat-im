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
            if (this._msgQueue.length) {
                let temp;
                while (this._isLogin && !!(temp = this._msgQueue.shift())) {
                    this._sendMsgImp({
                        content: {...temp.content, userId: msg.userInfo.userId},
                        success: temp.resolve,
                        fail: temp.reject
                    });
                }
            }
        })
    },
    onHide() {
    },
    onShow(options) {
    }
});
