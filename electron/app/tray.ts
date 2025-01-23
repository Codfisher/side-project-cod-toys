import type {
  BrowserWindow,
} from 'electron'
import path from 'node:path'
import {
  app,
  globalShortcut,
  Menu,
  shell,
  Tray,
} from 'electron'
import { version } from '../../package.json'
import { createConfigWindow } from './config'
import { initGlobalShortcut } from './global-shortcut'

export async function createTray(
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
