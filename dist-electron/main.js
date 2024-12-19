"use strict";
const process = require("node:process");
const electron = require("electron");
let mainWindow;
function createWindow() {
  mainWindow == null ? void 0 : mainWindow.destroy();
  const display = electron.screen.getPrimaryDisplay();
  mainWindow = new electron.BrowserWindow({
    width: display.bounds.width / 3,
    height: 100,
    show: true,
    backgroundColor: "#fff",
    frame: false,
    resizable: false
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
    if (!mainWindow)
      return;
    if (mainWindow == null ? void 0 : mainWindow.isVisible()) {
      mainWindow.setFocusable(false);
      mainWindow.hide();
      return;
    }
    const cursorPoint = electron.screen.getCursorScreenPoint();
    const display = electron.screen.getDisplayNearestPoint(cursorPoint);
    const [width, height] = mainWindow.getSize();
    mainWindow == null ? void 0 : mainWindow.setPosition(
      Math.floor(display.bounds.x + display.bounds.width / 2 - width / 2),
      Math.floor(display.bounds.y + display.bounds.height / 3 - height / 2)
    );
    mainWindow.setFocusable(true);
    mainWindow.show();
  });
  if (!ret) {
    console.error("registration failed");
  }
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
  electron.globalShortcut.unregisterAll();
});
