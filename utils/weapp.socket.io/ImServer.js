// 这个类包含调用socket.io的方法和缓存数据用
const io = require('./weapp.socket.io.js')

export default class ImServer {
  socketUrl = 'wss://api-test.xiaojia7879.com'
  socketMessage = ''
  socket = null
  token = ''

  updateToken (token) {
    this.token = token
  }

  /**
   * 启动 im
   */
  imStart (token) {
    this.updateToken(token)

    // 设置socket连接地址 socketUrl
    const socket = this.socket = io(
      this.socketUrl
    )

    // 每次连接成功后执行（断开重连成功也会执行）
    socket.on('connect', () => {
      console.log('SOCKET连接成功')
      this.emitToken()
    })

    // 连接失败时执行。如果连接断开后，会马上重连，如果重连失败，才会触发这个
    socket.on('connect_error', d => {
      console.log('SOCKET连接失败')
    })

    // 连接超时
    socket.on('connect_timeout', d => {
      console.log('SOCKET连接超时', d)
    })

    // 连接断开，可能是服务端重启或者网络断开等原因
    socket.on('disconnect', reason => {
      console.warn('SOCKET连接断开:' + reason)
    })

    // 断开后自动重连时
    socket.on('reconnect', attemptNumber => {
      console.warn('SOCKET正在重连:' + attemptNumber)
    })

    // 重连失败，好像不会触发这个，只会触发 connect_error
    socket.on('reconnect_failed', (err) => {
      console.error('SOCKET连接失败', err)
    })

    socket.on('reconnect_attempt', () => {
      console.warn('SOCKET正在重连reconnect_attempt')
    })

    // 连接错误，暂时不知道什么情况会出现
    socket.on('error', err => {
      console.error('SOCKET连接错误', err)
    })

    // 收到其他类型的消息，这个类型是服务端自行定义的，需要找后端开发了解
    socket.on('chat message', (d) => {
      this.socketReceiveMessage(d)
    })

    // 服务端要求上传token
    socket.on('needToken', () => {
      this.emitToken()
    })
  }

  on (event, fn) {
    this.socket.on(event, (msg) => {
      let obj = null
      try{
        obj = JSON.parse(msg)
      } catch (e) {

      }
      fn(obj || msg || '')
    })
  }

  off (event, fn) {
    this.socket.off(event, fn)
  }

  /**
   * 断开socket
   */
  socketStop () {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  /**
   * 发送消息
   */
  socketSendMessage (sendStr) {
    this.emit('chat message', sendStr);
  }

  /**
   * 接收消息
   */
  socketReceiveMessage (receivedStr) {
    // 发送成功一次后断开，测试完成
    this.socketStop();
  }

  /**
   * @param event {string}
   * @param data {any}
   * */
  emit (event, data) {
    if (this.socket) {
      this.socket.emit(event, typeof data === 'string' ? data : JSON.stringify(data))
    } else {
      console.error('socket尚未连接！')
    }
  }

  emitToken () {
    this.emit('login', {
      token: this.token
    });
  }
}
