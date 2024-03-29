process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
const { app, BrowserWindow } = require("electron");

const server = require("./app");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    icon: "avatar.jpg",
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.maximize();
  mainWindow.removeMenu(false);
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
