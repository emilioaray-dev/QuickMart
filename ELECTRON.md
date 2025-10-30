# QuickMart Checkout - Electron App

This project has been converted to an Electron desktop application using modern best practices.

## Architecture

- **Main Process**: `electron/main.ts` - Handles window creation and native OS interactions
- **Preload Script**: `electron/preload.ts` - Secure IPC bridge with context isolation
- **Renderer Process**: React app in `src/` - Your existing UI code
- **Build System**: Vite + vite-plugin-electron for optimized builds
- **Packaging**: electron-builder for cross-platform distribution

## Security Features

✅ Context isolation enabled
✅ Node integration disabled
✅ Sandbox mode enabled
✅ Secure IPC communication via preload script
✅ Navigation protection against external URLs
✅ Window open handler blocks popups

## Development

Start the Electron app in development mode:

```bash
npm run dev:electron
```

This will:
- Start Vite dev server with hot reload
- Build Electron main/preload scripts
- Launch the Electron app with DevTools open

## Building for Production

### Build for current platform
```bash
npm run build
```

### Build without packaging (for testing)
```bash
npm run build:dir
```

### Platform-specific builds
```bash
npm run build:mac    # macOS (DMG + ZIP)
npm run build:win    # Windows (NSIS installer)
npm run build:linux  # Linux (AppImage + deb)
```

## Distribution Files

Built applications are output to `release/1.0.0/`:

- **macOS**: `.dmg` and `.zip` files
- **Windows**: `.exe` NSIS installer
- **Linux**: `.AppImage` and `.deb` packages

## Project Structure

```
shop-till-you-drop-ui/
├── electron/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Secure IPC preload script
│   └── tsconfig.json    # TypeScript config for Electron
├── src/
│   ├── electron.d.ts    # TypeScript definitions for Electron API
│   └── ...              # Your React app code
├── dist/                # Built renderer (React app)
├── dist-electron/       # Built main & preload scripts
└── release/             # Packaged applications
```

## Adding Native Features

To add native Electron features:

1. **Add IPC handler in `electron/main.ts`**:
```typescript
ipcMain.handle('my-feature', async () => {
  // Native code here
  return result;
});
```

2. **Expose in `electron/preload.ts`**:
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  myFeature: () => ipcRenderer.invoke('my-feature'),
});
```

3. **Update types in `src/electron.d.ts`**:
```typescript
export interface ElectronAPI {
  myFeature: () => Promise<any>;
}
```

4. **Use in React components**:
```typescript
const result = await window.electronAPI?.myFeature();
```

## Configuration

electron-builder configuration is in `package.json` under the `build` key.

Key settings:
- **appId**: `com.quickmart.checkout`
- **productName**: QuickMart Checkout
- **Output directory**: `release/${version}`

## System Requirements

- **Development**: Node.js 18+, npm 9+
- **macOS**: macOS 10.13+ (High Sierra)
- **Windows**: Windows 10+
- **Linux**: Ubuntu 18.04+, Fedora 32+, Debian 10+

## Troubleshooting

### App won't start in dev mode
- Check that port 8080 is available
- Ensure all dependencies are installed: `npm install`

### Build fails
- Clear caches: `rm -rf node_modules dist dist-electron release`
- Reinstall: `npm install`
- Try dir build first: `npm run build:dir`

### TypeScript errors
- Ensure `electron/tsconfig.json` extends main config
- Check `src/electron.d.ts` matches preload exports

## Notes

- The main process uses ESM (ES Modules)
- DevTools are automatically opened in development
- Production builds are code-signed ready (add certificates)
- Auto-update can be added using electron-updater
