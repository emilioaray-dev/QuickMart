# QuickMart Checkout - Build Scripts

This project includes automated build scripts to create distributable applications for different operating systems.

## Prerequisites

Before building the application, make sure you have:

- Node.js and bun installed
- All dependencies installed (`bun install`)
- On macOS: Xcode command line tools (for building macOS and cross-compiling Windows/Linux)
- On Windows: Windows Build Tools
- On Linux: Appropriate build tools and dependencies

## Build Scripts

### `build-all-platforms.sh` (macOS/Linux)

A shell script to build the application for all platforms:

```bash
# Make the script executable
chmod +x build-all-platforms.sh

# Build for all platforms (macOS only)
./build-all-platforms.sh

# Build for specific platform
./build-all-platforms.sh mac        # macOS only
./build-all-platforms.sh win        # Windows only
./build-all-platforms.sh linux      # Linux only
./build-all-platforms.sh help       # Show help
```

### `build-all-platforms.bat` (Windows)

A batch script to build the application on Windows:

```cmd
# Build for Windows (default)
build-all-platforms.bat

# Build for specific platform
build-all-platforms.bat win         # Windows only
build-all-platforms.bat linux       # Linux only (if on Linux)
build-all-platforms.bat help        # Show help
```

## Manual Build Commands

The project also includes the following manual build commands:

- `bun run build:mac` - Build for macOS (default architecture)
- `bun run build:mac:universal` - Build universal macOS app (Intel + Apple Silicon)
- `bun run build:mac:intel` - Build for macOS Intel (x64)
- `bun run build:mac:arm` - Build for macOS Apple Silicon (arm64)
- `bun run build:win` - Build for Windows  
- `bun run build:linux` - Build for Linux
- `bun run build:dir` - Build unpacked directories for all platforms
- `bun run build` - Build and package for the current platform

## Output Locations

Built applications are located in the `dist/` folder:

- **macOS Universal**: `.dmg` (Universal - Intel + Apple Silicon) and `.zip` files (separate Intel and Apple Silicon builds)
- **macOS Intel**: `.dmg` (Intel x64) and `.zip` files
- **macOS Apple Silicon**: `.dmg` (ARM64) and `.zip` files
- **Windows**: `.exe` installer and `.msi` package
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

## Notes

- Building for all platforms is only possible on macOS due to code signing requirements
- Cross-platform builds may require additional setup and dependencies
- The app uses electron-builder for packaging and distribution
- App signing may be required for distribution (especially on macOS)

## Troubleshooting

If builds fail:

1. Ensure all dependencies are installed: `bun install`
2. Check that build tools are properly installed for your platform
3. On macOS, ensure Xcode command line tools are installed: `xcode-select --install`
4. Check electron-builder documentation for platform-specific requirements

## Project Structure

```
dist/                    # Built applications
├── *.dmg               # macOS installer
├── *.exe               # Windows installer
├── *.AppImage          # Linux portable app
├── *.deb               # Debian package
└── *.rpm               # Red Hat package
```