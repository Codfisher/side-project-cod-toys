import type { RouteNamedMap } from 'vue-router/auto-routes'
import type { ConfigStore, UserConfig } from '../electron-env'
import path from 'node:path'
import process from 'node:process'
import {
  BrowserWindow,
  ipcMain,
} from 'electron'
import Store from 'electron-store'

export function createConfigStore(): ConfigStore {
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

export async function createConfigWindow(route: keyof RouteNamedMap) {
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

export async function initConfigIpc(
  {
    configStore,
  }: {
    configStore: ConfigStore;
  },
) {
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
