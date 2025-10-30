#!/bin/bash

# Script to build the QuickMart Checkout application for all platforms
# Usage: ./build-all-platforms.sh

echo "🚀 Building QuickMart Checkout for all platforms..."
echo "=================================================="

# Function to build for macOS Universal (Intel + Apple Silicon)
build_mac_universal() {
    echo ""
    echo "🍎 Building for macOS (Universal - Intel + Apple Silicon)..."
    echo "-----------------------------------------------------------"
    if bun run build:mac:universal; then
        echo "✅ macOS universal build completed successfully!"
        echo "   Find the universal app in: dist/QuickMart Checkout-*.dmg (Universal)"
        echo "   Find individual builds in: dist/QuickMart Checkout-*.zip (x64 and arm64)"
    else
        echo "❌ macOS universal build failed!"
        exit 1
    fi
}

# Function to build for macOS Intel (x64)
build_mac_intel() {
    echo ""
    echo "🍎 Building for macOS Intel (x64)..."
    echo "------------------------------------"
    if bun run build:mac:intel; then
        echo "✅ macOS Intel build completed successfully!"
        echo "   Find the app in: dist/QuickMart Checkout-*.dmg (Intel)"
        echo "   Find zip archive in: dist/QuickMart Checkout-*.zip (Intel)"
    else
        echo "❌ macOS Intel build failed!"
        exit 1
    fi
}

# Function to build for macOS Apple Silicon (arm64)
build_mac_arm() {
    echo ""
    echo "🍎 Building for macOS Apple Silicon (arm64)..."
    echo "---------------------------------------------"
    if bun run build:mac:arm; then
        echo "✅ macOS Apple Silicon build completed successfully!"
        echo "   Find the app in: dist/QuickMart Checkout-*.dmg (Apple Silicon)"
        echo "   Find zip archive in: dist/QuickMart Checkout-*.zip (Apple Silicon)"
    else
        echo "❌ macOS Apple Silicon build failed!"
        exit 1
    fi
}

# Function to build for Windows
build_windows() {
    echo ""
    echo "💻 Building for Windows..."
    echo "--------------------------"
    if bun run build:win; then
        echo "✅ Windows build completed successfully!"
        echo "   Find the installer in: dist/QuickMart Checkout-win.exe"
    else
        echo "❌ Windows build failed!"
        exit 1
    fi
}

# Function to build for Linux
build_linux() {
    echo ""
    echo "🐧 Building for Linux..."
    echo "------------------------"
    if bun run build:linux; then
        echo "✅ Linux build completed successfully!"
        echo "   Find the packages in: dist/QuickMart Checkout-linux.*"
    else
        echo "❌ Linux build failed!"
        exit 1
    fi
}

# Function to build all platforms
build_all() {
    echo ""
    echo "📦 Building for all platforms..."
    
    # Check if we're on macOS (can build for all platforms)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Detected macOS - building for all platforms (macOS Universal, Windows, Linux)"
        build_mac_universal
        build_windows
        build_linux
    else
        # On other systems, we can only build natively or use cross-compilation
        echo "Detected non-macOS system - building for current platform only"
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            build_linux
        elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            build_windows
        fi
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  all                 Build for all platforms (default if no option provided)"
    echo "  mac                 Build for macOS (Universal - Intel + Apple Silicon)"
    echo "  mac:universal       Build for macOS (Universal - Intel + Apple Silicon)"
    echo "  mac:intel           Build for macOS Intel (x64)"
    echo "  mac:arm             Build for macOS Apple Silicon (arm64)"
    echo "  win                 Build for Windows only"
    echo "  linux               Build for Linux only"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Build for all platforms"
    echo "  $0 mac                   # Build for macOS (Universal)"
    echo "  $0 mac:universal         # Build for macOS (Universal)"
    echo "  $0 mac:intel             # Build for macOS Intel (x64)"
    echo "  $0 mac:arm               # Build for macOS Apple Silicon (arm64)"
    echo "  $0 win                   # Build for Windows only"
    echo "  $0 linux                 # Build for Linux only"
}

# Main script logic
case "${1:-all}" in
    "all")
        build_all
        ;;
    "mac")
        build_mac_universal
        ;;
    "mac:universal"|"mac-universal")
        build_mac_universal
        ;;
    "mac:intel"|"mac-intel"|"intel")
        build_mac_intel
        ;;
    "mac:arm"|"mac-arm"|"arm"|"apple-silicon")
        build_mac_arm
        ;;
    "win"|"windows")
        build_windows
        ;;
    "linux")
        build_linux
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        echo "Unknown option: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac

echo ""
echo "🎉 All builds completed successfully!"
echo "📁 Built applications are located in the 'dist' folder."
echo ""
echo "📋 Build Summary:"
echo "   - macOS Universal: dist/QuickMart Checkout-*.dmg (Universal), dist/QuickMart Checkout-*.zip (x64/arm64)"
echo "   - macOS Intel:     dist/QuickMart Checkout-*.dmg (Intel), dist/QuickMart Checkout-*.zip (Intel)"
echo "   - macOS ARM:       dist/QuickMart Checkout-*.dmg (Apple Silicon), dist/QuickMart Checkout-*.zip (ARM)"
echo "   - Windows:         dist/QuickMart Checkout Setup *.exe, QuickMart Checkout-*.msi"
echo "   - Linux:           dist/QuickMart Checkout-*.AppImage, dist/QuickMart Checkout-*.deb, dist/QuickMart Checkout-*.rpm"