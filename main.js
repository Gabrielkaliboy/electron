// electron.app负责管理Electron 应用程序的生命周期， electron.BrowserWindow类负责创建窗口,
// ipcRenderer:使用它提供的一些方法，从渲染进程发送同步或异步的消息到主进程。 也可以接收主进程回复的消息
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let mainWindow

function createWindow() {
  // 创建一个浏览器窗口.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // 网页功能的设置
    webPreferences: {
      // 在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成Node, 此脚本都可以访问所有Node API 脚本路径为文件的绝对路径
      preload: path.join(__dirname, 'preload.js'),
      // 是否启用node
      nodeIntegration: true
      //是否打开调试工具,与webContents.openDevTools()相关
      // devTools:true
    }
  })

  // 窗口内加载index.html
  mainWindow.loadFile('index.html')

  // 再窗口加载某个远程地址
  // mainWindow.loadURL('https://github.com')

  // 打开调试工具
  mainWindow.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  mainWindow.on('closed', function() {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('create1', '123')
  })
}

//主进程与渲染进程通信
// 主进程可以使用 ipcMain 监听 channel来接收这些消息，并通过 event.returnValue 设置回复消息。

// ipcMain.on('create1', (event, arg) => {
//   console.log('1111111111111')
//   console.log(event)
//   console.log(arg)
//   event.returnValue = 'big banana'
// })

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', function() {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (mainWindow === null) createWindow()
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
