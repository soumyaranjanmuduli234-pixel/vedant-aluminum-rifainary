@echo off
REM Build script for Windows (folder build) using build_pyinstaller.py
python -m pip install -r requirements.txt
python build_pyinstaller.py
pause
