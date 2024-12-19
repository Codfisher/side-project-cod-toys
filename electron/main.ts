import process from 'node:process'
import {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
} from 'electron'

let mainWindow: BrowserWindow | undefined

async function createInputWindow() {
  mainWindow?.destroy()

  const display = screen.getPrimaryDisplay()

  const inputWindow = new BrowserWindow({
    width: display.bounds.width / 3,
    height: 100,
    show: true,
    backgroundColor: '#fff',
    frame: false,
    resizable: false,
  })
  // 隱藏預設系統選單
  inputWindow.setMenu(null)

  // 失去焦點時自動隱藏視窗
  inputWindow.on('blur', () => {
    inputWindow.hide()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    await inputWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
  else {
    await inputWindow.loadFile('dist/index.html')
  }

  mainWindow = inputWindow
}

app.whenReady().then(async () => {
  await createInputWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createInputWindow()
  })

  const ret = globalShortcut.register('CmdOrCtrl+Space', () => {
    if (!mainWindow)
      return

    if (mainWindow?.isVisible()) {
      // focusable 設為 false，才可以讓焦點回到原本位置。例如正在輸入的編輯器
      mainWindow.setFocusable(false)
      mainWindow.hide()

      return
    }

    const cursorPoint = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(cursorPoint)

    // 設定滑鼠位置之視窗中間往上 1/3 的位置
    const [width, height] = mainWindow.getSize()
    mainWindow?.setPosition(
      Math.floor(display.bounds.x + display.bounds.width / 2 - width / 2),
      Math.floor(display.bounds.y + display.bounds.height / 3 - height / 2),
    )

    mainWindow.setFocusable(true)
    mainWindow.show()
  })

  if (!ret) {
    console.error('registration failed')
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }

  globalShortcut.unregisterAll()
})
