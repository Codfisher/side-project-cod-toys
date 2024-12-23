import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('main', {
  updateHeight(height: number) {
    return ipcRenderer.send('updateHeight', height)
  },
})
