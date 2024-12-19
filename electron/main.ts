import process from 'node:process'
import {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
} from 'electron'

let mainWindow: BrowserWindow | undefined

function createWindow() {
  mainWindow?.destroy()

  const display = screen.getPrimaryDisplay()

  mainWindow = new BrowserWindow({
    width: display.bounds.width / 3,
    height: 100,
    show: true,
    backgroundColor: '#fff',
    frame: false,
    resizable: false,
  })
  mainWindow.setMenu(null)

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  }
  else {
    // Load your file
    mainWindow.loadFile('dist/index.html')
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }

  globalShortcut.unregisterAll()
})
