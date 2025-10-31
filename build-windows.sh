#!/bin/bash

# Windows Build Script for QuickMart Checkout
# Creates both .exe installer and .zip portable versions for Windows

echo "🚀 Building QuickMart Checkout for Windows..."
echo "================================================"

# Build the application (creates both NSIS installer and ZIP)
echo ""
echo "📦 Building application (installer + portable)..."
if bun run build:win; then
    echo "✅ Windows build completed successfully!"
    echo ""
    echo "📁 Built files are located in the 'release' folder:"
    echo "   - Installer: release/[version]/QuickMart Checkout Setup *.exe"
    echo "   - Portable:  release/[version]/QuickMart Checkout-*.zip"
    echo ""
    echo "📋 Post-Build Instructions:"
    echo "   1. Share the WINDOWS_INSTALLATION.md file with users to help them install"
    echo "   2. Inform users about Windows SmartScreen warnings (it's normal)"
    echo ""
    echo "💡 Tips for Users:"
    echo "   - .exe: Standard installer (may show SmartScreen warning)"
    echo "   - .zip: Portable version (no installation needed, extract and run)"
    echo "   - Right-click file → Properties → General → Unblock (if option available)"
    echo "   - If SmartScreen appears: click 'More info' → 'Run anyway'"
    echo "   - Run installer as Administrator if needed"
    echo ""
    echo "🎯 Windows-specific Build Notes:"
    echo "   - Built for x64 architecture (64-bit Windows)"
    echo "   - NSIS installer with custom options"
    echo "   - ZIP portable version (no installation required)"
    echo "   - Includes security compatibility settings"
    echo "   - Creates desktop and start menu shortcuts (installer only)"
else
    echo "❌ Windows build failed!"
    exit 1
fi