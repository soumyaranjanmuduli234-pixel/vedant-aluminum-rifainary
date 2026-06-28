import os
from PySide6.QtCore import Qt, QUrl
from PySide6.QtWidgets import QMainWindow, QAction, QToolBar
from PySide6.QtGui import QIcon
from PySide6.QtWebEngineWidgets import QWebEngineView


class DashboardWindow(QMainWindow):

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Vedanta Report System")
        self.setMinimumSize(1200, 800)

        if os.path.exists("icon.ico"):
            self.setWindowIcon(QIcon("icon.ico"))

        self.view = QWebEngineView()
        self.setCentralWidget(self.view)
        self.load_web_ui()
        self.build_toolbar()

    def load_web_ui(self):
        html_path = os.path.abspath(os.path.join("web", "index.html"))
        if os.path.exists(html_path):
            self.view.load(QUrl.fromLocalFile(html_path))
        else:
            self.view.setHtml("<h1>Unable to find web/index.html</h1>")

    def build_toolbar(self):
        toolbar = QToolBar("Application Toolbar")
        toolbar.setMovable(False)
        self.addToolBar(Qt.TopToolBarArea, toolbar)

        reload_action = QAction("Reload", self)
        reload_action.triggered.connect(self.view.reload)
        toolbar.addAction(reload_action)

        go_home_action = QAction("Home", self)
        go_home_action.triggered.connect(self.load_web_ui)
        toolbar.addAction(go_home_action)

        close_action = QAction("Exit", self)
        close_action.triggered.connect(self.close)
        toolbar.addAction(close_action)
