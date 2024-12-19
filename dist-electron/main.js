"use strict";
const process = require("node:process");
const electron = require("electron");
process.env.npm_lifecycle_event === "app:dev";
async function handleFileOpen() {
  const { canceled, filePaths } = await electron.dialog.showOpenDialog({ title: "Open File" });
  if (!canceled) {
    return filePaths[0];
  }
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile("dist/index.html");
  }
}
electron.app.whenReady().then(() => {
  electron.ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
