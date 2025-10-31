import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getPlatform: () => ipcRenderer.invoke("get-platform"),
  printReceipt: (receiptHTML: string) => ipcRenderer.invoke("print-receipt", receiptHTML),
});

// Type definitions for the exposed API
export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  printReceipt: (receiptHTML: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
