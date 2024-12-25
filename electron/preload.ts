import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('main', {
  updateHeight(height: number) {
    return ipcRenderer.send('updateHeight', height)
  },
  hideWindow() {
    return ipcRenderer.send('hideWindow')
  },
  openExternal(url: string) {
    return ipcRenderer.send('openExternal', url)
  },
})
