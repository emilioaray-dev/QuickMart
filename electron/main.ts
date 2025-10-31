import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disable GPU acceleration on macOS for better compatibility
if (process.platform === "darwin") {
  app.disableHardwareAcceleration();
}

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false, // Don't show until ready-to-show
  });

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // On macOS apps stay active until user quits explicitly
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Security: Prevent navigation to external URLs
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;

    if (devServerUrl) {
      const parsedDevUrl = new URL(devServerUrl);
      if (parsedUrl.origin !== parsedDevUrl.origin) {
        event.preventDefault();
      }
    } else if (parsedUrl.protocol !== "file:") {
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });
});

// IPC handlers
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-platform", () => {
  return process.platform;
});

// Allow printing in Electron - handle receipt printing
ipcMain.handle("print-receipt", (event, receiptHTML: string) => {
  return new Promise<boolean>((resolve, reject) => {
    const win = new BrowserWindow({
      width: 400,
      height: 600,
      show: false, // Don't show the window initially
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
      // On macOS, sometimes we need to ensure proper focus handling
      parent: BrowserWindow.getFocusedWindow() || null, // Associate with main window if available
      modal: false, // Don't make it modal to avoid blocking main window
    });

    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`);
    
    win.webContents.once('did-finish-load', async () => {
      // On macOS, sometimes we need to activate the window to ensure print dialog appears
      if (process.platform === 'darwin') {
        win.showInactive(); // Show without taking focus
      }
      
      // Check if there are any printers available before attempting to print
      const printers = await win.webContents.getPrintersAsync();
      if (!printers || printers.length === 0) {
        console.warn('No printers available');
        win.close();
        reject(new Error('No printers available on the network'));
        return;
      }
      
      // Show print dialog and print with callback to handle success/failure
      win.webContents.print({ 
        silent: false, 
        printBackground: true 
      }, (success, failureReason) => {
        // Close the window after printing attempt
        win.close();
        
        if (success) {
          resolve(true);
        } else {
          console.error('Printing failed:', failureReason);
          reject(new Error(failureReason || 'Printing failed'));
        }
      });
    });
    
    // Handle load failures for the temporary print window
    win.webContents.once('did-fail-load', (_event, errorCode, errorDescription) => {
      win.close();
      reject(new Error(errorDescription || `Load failed with code ${errorCode}`));
    });
    
    // Handle window errors
    win.on('error', (error) => {
      win.close();
      reject(error);
    });
  });
});
