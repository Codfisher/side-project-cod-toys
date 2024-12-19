"use strict";
const process = require("node:process");
const electron = require("electron");
let mainWindow;
function createWindow() {
  mainWindow == null ? void 0 : mainWindow.destroy();
  mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: "#fff"
  });
  mainWindow.setMenu(null);
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile("dist/index.html");
  }
}
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
  const ret = electron.globalShortcut.register("CmdOrCtrl+Space", () => {
    console.log("CmdOrCtrl+Space is pressed");
    if (!(mainWindow == null ? void 0 : mainWindow.isVisible())) {
      mainWindow == null ? void 0 : mainWindow.show();
    } else {
      mainWindow == null ? void 0 : mainWindow.hide();
    }
  });
  if (!ret) {
    console.log("registration failed");
  }
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
  electron.globalShortcut.unregisterAll();
});
