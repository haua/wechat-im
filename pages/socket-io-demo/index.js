// socket 连接插件
const io = require('../../utils/weapp.socket.io/weapp.socket.io.js')
// socket 连接地址
const socketUrl = 'ws://localhost:5289'
// socket 状态更新
let socketMessage = ''

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.socketStart();
  },

  /**
   * 启动socket
   */
  socketStart: function () {

    // 设置socket连接地址 socketUrl
    const socket = this.socket = io(
      socketUrl,
    )

    // 每次连接成功后执行（断开重连成功也会执行）
    socket.on('connect', () => {
      this.setData({ socketMessage: socketMessage += 'SOCKET连接成功 → \n\n' })

      // 此处修改为与server约定的数据、格式
      var sendMessage = '{"token":"v3jsoc8476shNFhxgqPAkkjt678","client":"发送内容"}'
      this.socketSendMessage(sendMessage);
    })

    // 连接失败时执行。如果连接断开后，会马上重连，如果重连失败，才会触发这个
    socket.on('connect_error', d => {
      this.setData({ socketMessage: socketMessage += 'SOCKET连接失败 → \n\n' })
    })

    // 连接超时
    socket.on('connect_timeout', d => {
      this.setData({ socketMessage: socketMessage += 'SOCKET连接超时 → \n\n' })
    })

    // 连接断开，可能是服务端重启或者网络断开等原因
    socket.on('disconnect', reason => {
      this.setData({ socketMessage: socketMessage += 'SOCKET连接断开 → \n\n' })
    })

    // 断开后自动重连时
    socket.on('reconnect', attemptNumber => {
      this.setData({ socketMessage: socketMessage += 'SOCKET正在重连 → \n\n' })
    })

    // 重连失败，好像不会触发这个，只会触发 connect_error
    socket.on('reconnect_failed', () => {
      this.setData({ socketMessage: socketMessage += 'SOCKET重连失败 → \n\n' })
    })

    socket.on('reconnect_attempt', () => {
      this.setData({ socketMessage: socketMessage += 'SOCKET正在重连reconnect_attempt → \n\n' })
    })

    // 连接错误，暂时不知道什么情况会出现
    socket.on('error', err => {
      this.setData({ socketMessage: socketMessage += 'SOCKET连接错误 → \n\n' })
    })

    // 收到其他类型的消息，这个类型是服务端自行定义的，需要找后端开发了解
    socket.on('chat message', (d) => {
      this.socketReceiveMessage(d)
    })

  },

  /**
   * 断开socket
   */
  socketStop: function () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  },

  /**
   * 发送消息
   */
  socketSendMessage: function (sendStr) {
    if (this.socket) {
      this.setData({ socketMessage: socketMessage += '向服务器发送数据 → ' + sendStr + '\n\n'})
      this.socket.emit('chat message', sendStr);
    }
  },

  /**
   * 接收消息
   */
  socketReceiveMessage: function (receivedStr) {
    this.setData({ socketMessage: socketMessage += '服务器返回数据 → ' + receivedStr + '\n\n'})
    // 发送成功一次后断开，测试完成
    this.socketStop();
  },
})
