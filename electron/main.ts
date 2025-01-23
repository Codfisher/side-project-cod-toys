import type { ConfigStore } from './electron-env'
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
import {
  createConfigStore,
  initConfigIpc,
} from './app/config'
import { initGlobalShortcut } from './app/global-shortcut'
import { initLlmIpc } from './app/llm'
import { createTray } from './app/tray'

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
      webSecurity: false,
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

async function initIpcMain(
  {
    configStore,
  }: {
    configStore: ConfigStore;
  },
) {
  // main
  ipcMain.on('main:updateHeight', (event, height: number) => {
    const window = BrowserWindow.fromWebContents(event.sender)

    window?.setBounds({ height })
  })
  ipcMain.on('main:hideWindow', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)

    window?.setFocusable(false)
    window?.hide()
  })
  ipcMain.on('main:openExternal', (event, url: string) => {
    shell.openExternal(url)
  })

  await Promise.all([
    initConfigIpc({ configStore }),
    initLlmIpc({ configStore }),
  ])
}

app.whenReady().then(async () => {
  const configStore = createConfigStore()
  await initIpcMain({ configStore })

  const mainWindow = await createInputWindow()

  await initGlobalShortcut({ mainWindow })
  const tray = await createTray({ mainWindow })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }

    globalShortcut.unregisterAll()
    tray.destroy()
  })
})
