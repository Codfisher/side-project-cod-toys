import process from 'node:process'
import {
  app,
  BrowserWindow,
  globalShortcut,
} from 'electron'

let mainWindow: BrowserWindow | undefined

function createWindow() {
  mainWindow?.destroy()

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: '#fff',
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
    console.log('CmdOrCtrl+Space is pressed')

    if (!mainWindow?.isVisible()) {
      mainWindow?.show()
    }
    else {
      mainWindow?.hide()
    }
  })

  if (!ret) {
    console.log('registration failed')
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
