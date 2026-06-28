# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['E:\\VEDANTARIFINARY\\main.py'],
    pathex=[],
    binaries=[('E:\\VEDANTARIFINARY\\.venv\\Lib\\site-packages\\PySide6\\QtWebEngineProcess.exe', '.')],
    datas=[('E:\\VEDANTARIFINARY\\web', 'web'), ('E:\\VEDANTARIFINARY\\assets', 'assets')],
    hiddenimports=['PySide6', 'PySide6.QtCore', 'PySide6.QtGui', 'PySide6.QtWidgets', 'PySide6.QtWebEngineWidgets'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='VedantaReport',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='VedantaReport',
)
