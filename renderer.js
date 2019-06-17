//在渲染器进程 (网页) 中。从渲染器进程到主进程的异步通信
const { ipcRenderer } = require('electron')

window.onload = function() {
  let btn1 = document.getElementById('btn1')
  btn1.onclick = function() {
    alert('123')
  }
}

// 通过 channel(这里是synchronous-message) 发送同步消息到主进程，可以携带任意参数。 在内部，参数会被序列化为 JSON，因此参数对象上的函数和原型链不会被发送。
// 主进程可以使用 ipcMain 监听 channel来接收这些消息，并通过 event.returnValue 设置回复消息。

// 注意: 发送同步消息（sendSync）将会阻塞整个渲染进程，你应该避免使用这种方式
// 发送异步：send

// 监听 channel（这里是create1）, 当新消息到达，将通过 listener(event, args...) 调用 listener。
ipcRenderer.send('create1', '456')


let receive = document.getElementById("receive")
ipcRenderer.on('create1', (event, arg) => {
  console.log(event)
  console.log(arg)
  receive.innerText = arg
})
