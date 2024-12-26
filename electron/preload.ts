import type { UserConfig } from './electron-env'
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('main', {
  updateHeight(height: number) {
    return ipcRenderer.send('main:updateHeight', height)
  },
  hideWindow() {
    return ipcRenderer.send('main:hideWindow')
  },
  openExternal(url: string) {
    return ipcRenderer.send('main:openExternal', url)
  },
})

contextBridge.exposeInMainWorld('config', {
  get() {
    return ipcRenderer.invoke('config:get')
  },
  update(data: Partial<UserConfig>) {
    return ipcRenderer.invoke('config:update', data)
  },
  onUpdate(callback: (config: UserConfig) => void) {
    ipcRenderer.on('config:onUpdate', (event, config) => {
      callback(config)
    })
  },
})
