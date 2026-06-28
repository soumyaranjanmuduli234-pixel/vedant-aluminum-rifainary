import sys
import os

from PySide6.QtWidgets import QApplication
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtCore import QUrl
from PySide6.QtGui import QIcon


app = QApplication(sys.argv)

window = QWebEngineView()

window.setWindowTitle("VEDANTA ALUMINUM REFINERY REPORT SYSTEM")

if os.path.exists("icon.ico"):
    window.setWindowIcon(QIcon("icon.ico"))

html = os.path.abspath("index.html")

window.load(QUrl.fromLocalFile(html))

window.resize(1400,900)

window.show()

sys.exit(app.exec())