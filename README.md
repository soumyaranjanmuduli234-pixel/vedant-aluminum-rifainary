# Vedanta Report System — Windows Bundle Instructions

This repository contains a desktop wrapper around the existing web UI (in the `web/` folder) using PySide6.

To create a Windows folder build (recommended) with PyInstaller:

1. Create a virtual environment and activate it (optional but recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

3. Build (folder build) using the included helper:

```powershell
python build_pyinstaller.py
# or run the helper batch file
.\build_windows.bat
```

What the helper does:
- Adds the `web/` and `assets/` folders to the PyInstaller build so your HTML/CSS/JS are packaged.
- Attempts to locate `QtWebEngineProcess.exe` in the PySide6 installation and includes it as a binary. If it's not found automatically, build output may need manual adjustment.

Notes and troubleshooting:
- If the built application fails to launch with WebEngine errors, install `PySide6` in the same environment and re-run the build; then inspect the PyInstaller `dist/VedantaReport` folder and ensure `QtWebEngineProcess.exe` and Qt plugins (platforms, etc.) are present.
- For a single-file `.exe` use, consider `--onefile` but note WebEngine components often require the folder layout, so `--onedir` is recommended.
