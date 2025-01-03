import type { RouteNamedMap } from 'vue-router/auto-routes'
import type { UserConfig } from './electron-env'
import path from 'node:path'
import process from 'node:process'
import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
  shell,
  Tray,
} from 'electron'
import Store from 'electron-store'
import { version } from '../package.json'

type ConfigStore = Store<{ config: UserConfig }>

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

async function createConfigWindow(route: keyof RouteNamedMap) {
  const newWindow = new BrowserWindow({
    backgroundColor: '#fff',
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  })
  // 隱藏預設系統選單
  newWindow.setMenu(null)

  if (process.env.VITE_DEV_SERVER_URL) {
    await newWindow.loadURL(
      `${process.env.VITE_DEV_SERVER_URL}#${route}`,
    )
    // newWindow.webContents.openDevTools()
  }
  else {
    await newWindow.loadFile('dist/index.html', {
      hash: route,
    })
  }

  return newWindow
}

function initGlobalShortcut(
  {
    mainWindow,
  }: {
    mainWindow: BrowserWindow;
  },
) {
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

function initIpcMain(
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

  // config
  ipcMain.handle('config:get', async () => {
    return configStore.get('config')
  })
  ipcMain.handle('config:update', async (event, config) => {
    const data = configStore.get('config')
    configStore.set('config', {
      ...data,
      ...config,
    })

    // 向所有視窗觸發 config:onUpdate 事件
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('config:onUpdate', config)
    })
  })
}

function createConfigStore(): ConfigStore {
  const config: UserConfig = {
    kaomoji: {
      databaseId: '',
      token: '',
    },
  }

  return new Store({
    name: 'config',
    defaults: { config },
  })
}

function createTray(
  {
    mainWindow,
  }: {
    mainWindow: BrowserWindow;
  },
) {
  const tray = new Tray(
    path.join(__dirname, '../public/fish.ico'),
  )
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '暫時停用',
      type: 'checkbox',
      click(item) {
        if (item.checked) {
          globalShortcut.unregisterAll()
        }
        else {
          initGlobalShortcut({ mainWindow })
        }
      },
    },
    {
      label: '詳細設定',
      submenu: [
        {
          label: '開啟設定視窗',
          click: () => createConfigWindow('/kaomoji-config/'),
        },
      ],
    },
    {
      label: '關於',
      click: () => shell.openExternal('https://codlin.me/column-cod-toys/01-origin.html'),
    },
    { type: 'separator' },
    {
      label: '退出應用程式',
      click: () => app.quit(),
    },
  ])
  tray.setToolTip(`CodToys v${version}`)
  tray.setContextMenu(contextMenu)

  return tray
}

app.whenReady().then(async () => {
  const mainWindow = await createInputWindow()

  const configStore = createConfigStore()

  initGlobalShortcut({ mainWindow })

  initIpcMain({ configStore })

  const tray = createTray({ mainWindow })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }

    globalShortcut.unregisterAll()
    tray.destroy()
  })
})
