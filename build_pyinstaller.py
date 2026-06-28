#!/usr/bin/env python3
"""Build helper to create a folder PyInstaller build that includes Qt WebEngine assets.

Run from project root:
    python build_pyinstaller.py

This script attempts to locate PySide6 and QtWebEngineProcess and adds them to the build.
"""
import os
import sys
import subprocess
import shutil

def find_pyside6_base():
    try:
        import PySide6
        return os.path.dirname(PySide6.__file__)
    except Exception:
        return None

def find_qtwebengine_process(base):
    # common locations under PySide6 distribution
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.lower() == 'qtwebengineprocess.exe':
                return os.path.join(root, f)
    return None

def main():
    project_root = os.path.abspath(os.path.dirname(__file__))
    pyinstaller = shutil.which('pyinstaller')
    if pyinstaller is None:
        print('PyInstaller executable not found in PATH. Install it with: pip install pyinstaller')
        sys.exit(1)

    pyside_base = find_pyside6_base()
    if not pyside_base:
        print('PySide6 not found in the current Python environment. Install PySide6 before building.')
        sys.exit(1)

    qt_proc = find_qtwebengine_process(pyside_base)
    datas = []
    # include web assets and generic assets folder
    datas.append((os.path.join(project_root, 'web'), 'web'))
    datas.append((os.path.join(project_root, 'assets'), 'assets'))

    cmd = [pyinstaller, '--noconfirm', '--onedir', '--windowed', '--name', 'VedantaReport']

    # add datas
    for src, dest in datas:
        if os.path.exists(src):
            cmd += ['--add-data', f"{src}{os.pathsep}{dest}"]
        else:
            print('Warning: data folder not found:', src)

    # add Qt WebEngine process binary if present
    if qt_proc:
        cmd += ['--add-binary', f"{qt_proc}{os.pathsep}."]
        print('Found QtWebEngineProcess:', qt_proc)
    else:
        print('Warning: QtWebEngineProcess.exe not found automatically. PyInstaller may miss WebEngine runtime files.')

    # Hidden imports to help PyInstaller detect PySide6 submodules
    hidden = [
        'PySide6',
        'PySide6.QtCore',
        'PySide6.QtGui',
        'PySide6.QtWidgets',
        'PySide6.QtWebEngineWidgets'
    ]
    for h in hidden:
        cmd += ['--hidden-import', h]

    # entrypoint
    cmd.append(os.path.join(project_root, 'main.py'))

    print('Running PyInstaller...')
    print('Command:', ' '.join(cmd))

    proc = subprocess.run(cmd)
    if proc.returncode == 0:
        print('Build completed. Check the `dist` folder for VedantaReport.')
    else:
        print('PyInstaller failed with exit code', proc.returncode)

if __name__ == '__main__':
    main()
