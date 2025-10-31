# QuickMart Checkout - Windows Installation Guide

Thank you for installing QuickMart Checkout! This guide will help you install and run the application on Windows.

## Initial Setup (First Time Installation)

### If Windows Security Warning Appears:
1. **Right-click** on the .exe file
2. Select **"Properties"**
3. Click on the **"General"** tab
4. Check the box that says **"Unblock"** (if available)
5. Click **"OK"**
6. Try running the installer again

### Standard Installation Process:
1. Double-click the `QuickMart Checkout Setup.exe` file
2. Follow the installation wizard prompts
3. Choose your installation directory
4. Complete the installation

## Running the Application

### If the application doesn't start after installation:

**Method 1 - Windows Defender SmartScreen:**
- When you see the SmartScreen warning, click **"More info"**
- Then click **"Run anyway"**

**Method 2 - Manual Unblock:**
- Right-click the installed application shortcut
- Go to Properties
- Click "Unblock" in the Security section
- Click OK and try running again

## Troubleshooting

### Common Issues:

**Issue:** "The publisher could not be verified"
- **Solution:** This is normal for non-commercial applications. Follow the unblocking instructions above.

**Issue:** "Application cannot start"
- **Solution:** Make sure you have Windows 10 or later installed
- Try running as administrator (right-click → "Run as administrator")

**Issue:** "Missing DLL files"
- **Solution:** Install the latest Microsoft Visual C++ Redistributable packages

## System Requirements

- **Operating System:** Windows 10 or later (64-bit)
- **RAM:** 2 GB or more
- **Disk Space:** 200 MB available space
- **Internet:** Not required for basic functionality

## Security Note

This application is safe to install and run. It may trigger Windows security warnings because it's not digitally signed with a commercial certificate. This is common for small business applications like ours. The source code is open and has been verified to be secure.

## Support

If you continue to experience issues:

1. Ensure your Windows is updated to the latest version
2. Temporarily disable Windows Defender Real-time protection during installation (re-enable afterward)
3. Contact support with your Windows version and error message details

## Manual Security Verification

If you're concerned about security, you can verify this application:
- It's built with Electron (a trusted framework)
- All source code is contained within the application files
- No external network calls are made without user action
- No sensitive data is collected without permission