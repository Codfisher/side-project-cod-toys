import path from 'node:path'
import process from 'node:process'
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  screen,
  shell,
} from 'electron'

async function createInputWindow() {
  const display = screen.getPrimaryDisplay()

  const newWindow = new BrowserWindow({
    width: display.bounds.width / 3,
    height: 100,
    show: false,
    backgroundColor: '#fff',
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  })
  // 隱藏預設系統選單
  newWindow.setMenu(null)

  if (process.env.VITE_DEV_SERVER_URL) {
    await newWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // newWindow.webContents.openDevTools()
  }
  else {
    await newWindow.loadFile('dist/index.html')
  }

  return newWindow
}

function initGlobalShortcut(mainWindow: BrowserWindow) {
  const ret = globalShortcut.register('Ctrl+Space', () => {
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
    if (!width || !height)
      return

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
}

function initIpcMain(mainWindow: BrowserWindow) {
  ipcMain.on('updateHeight', (event, height: number) => {
    mainWindow.setBounds({ height })
  })

  ipcMain.on('hideWindow', (event) => {
    mainWindow.setFocusable(false)
    mainWindow.hide()
  })

  ipcMain.on('openExternal', (event, url: string) => {
    shell.openExternal(url)
  })
}

app.whenReady().then(async () => {
  const mainWindow = await createInputWindow()

  initGlobalShortcut(mainWindow)
  initIpcMain(mainWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }

  globalShortcut.unregisterAll()
})
