import sys
import os

from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import (
    QApplication,
    QWidget,
    QLabel,
    QVBoxLayout,
    QProgressBar
)


class SplashScreen(QWidget):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("VEDANTA REPORT SYSTEM")

        self.setFixedSize(700,420)

        self.setWindowFlag(Qt.FramelessWindowHint)

        self.setStyleSheet("""
        QWidget{
            background:white;
            border-radius:15px;
        }

        QLabel{
            color:#003366;
        }

        QProgressBar{

            border:1px solid gray;
            border-radius:8px;
            text-align:center;
            height:18px;

        }

        QProgressBar::chunk{

            background:#0066cc;
            border-radius:8px;

        }
        """)

        layout = QVBoxLayout()

        layout.setAlignment(Qt.AlignCenter)

        self.logo = QLabel()

        logo_path = os.path.join("assets","logo.jpg")

        if os.path.exists(logo_path):

            pix = QPixmap(logo_path)

            self.logo.setPixmap(
                pix.scaled(
                    180,
                    180,
                    Qt.KeepAspectRatio,
                    Qt.SmoothTransformation
                )
            )

        else:

            self.logo.setText("VEDANTA")

            self.logo.setStyleSheet("""
            font-size:38px;
            font-weight:bold;
            color:#0055aa;
            """)

        self.title = QLabel("VEDANTA ALUMINUM REFINERY")

        self.title.setStyleSheet("""
        font-size:22px;
        font-weight:bold;
        """)

        self.subtitle = QLabel("Employee Report Management System")

        self.subtitle.setStyleSheet("""
        font-size:15px;
        color:gray;
        """)

        self.progress = QProgressBar()

        self.progress.setMaximum(100)

        self.progress.setValue(0)

        layout.addWidget(self.logo)

        layout.addSpacing(15)

        layout.addWidget(self.title)

        layout.addWidget(self.subtitle)

        layout.addSpacing(20)

        layout.addWidget(self.progress)

        self.setLayout(layout)

        self.timer = QTimer()

        self.timer.timeout.connect(self.loading)

        self.timer.start(30)

    def loading(self):

        value = self.progress.value()

        if value < 100:

            self.progress.setValue(value+1)

        else:

            self.timer.stop()

            self.close()

            from login import LoginWindow

            self.login = LoginWindow()

            self.login.show()


if __name__ == "__main__":

    app = QApplication(sys.argv)

    window = SplashScreen()

    window.show()

    sys.exit(app.exec())