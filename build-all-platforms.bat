@echo off
setlocal enabledelayedexpansion

REM Script to build the QuickMart Checkout application for all platforms
REM Usage: build-all-platforms.bat [OPTION]

echo 🚀 Building QuickMart Checkout for all platforms...
echo ==================================================

REM Function to build for Windows
:build_windows
echo.
echo 💻 Building for Windows...
echo --------------------------
bun run build:win
if %ERRORLEVEL% EQU 0 (
    echo ✅ Windows build completed successfully!
    echo    Find the installer in: dist\QuickMart Checkout-win.exe
) else (
    echo ❌ Windows build failed!
    exit /b 1
)
goto :eof

REM Function to build for Linux
:build_linux
echo.
echo 🐧 Building for Linux...
echo ------------------------
bun run build:linux
if %ERRORLEVEL% EQU 0 (
    echo ✅ Linux build completed successfully!
    echo    Find the packages in: dist\QuickMart Checkout-linux.*
) else (
    echo ❌ Linux build failed!
    exit /b 1
)
goto :eof

REM Show usage
:show_usage
echo Usage: %0 [OPTION]
echo.
echo Options:
echo   win^|windows    Build for Windows only
echo   linux          Build for Linux only
echo   help           Show this help message
echo.
echo Examples:
echo   %0              REM Build for current platform (Windows)
echo   %0 win          REM Build for Windows only
echo   %0 linux        REM Build for Linux only
goto :eof

REM Main script logic
if "%1"=="" goto build_windows
if /I "%1"=="win" goto build_windows
if /I "%1"=="windows" goto build_windows
if /I "%1"=="linux" goto build_linux
if /I "%1"=="help" goto show_usage
if /I "%1"=="-h" goto show_usage
if /I "%1"=="--help" goto show_usage

echo Unknown option: %1
echo.
call :show_usage
exit /b 1

REM Build for Windows (default)
:build_windows_default
call :build_windows

echo.
echo 🎉 Build completed successfully!
echo 📁 Built application is located in the 'dist' folder.
echo.
echo 📋 Build Summary:
echo    - Windows: dist\QuickMart Checkout Setup *.exe, QuickMart Checkout-*.msi
echo    - Linux:   dist\QuickMart Checkout-*.AppImage, dist\QuickMart Checkout-*.deb, dist\QuickMart Checkout-*.rpm (when built on Linux)