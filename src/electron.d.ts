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
