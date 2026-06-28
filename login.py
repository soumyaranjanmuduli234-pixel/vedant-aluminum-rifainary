import os
from PySide6.QtCore import Qt
from PySide6.QtGui import QPixmap, QFont
from PySide6.QtWidgets import (
    QWidget,
    QLabel,
    QVBoxLayout,
    QLineEdit,
    QPushButton,
    QApplication,
    QMessageBox
)

from database import Database


class LoginWindow(QWidget):

    def __init__(self):
        super().__init__()

        self.db = Database()
        self.setWindowTitle("Vedanta Report System - Login")
        self.setFixedSize(520, 650)

        self.build_ui()

    def build_ui(self):

        self.setStyleSheet("""
        QWidget{
            background:#f5f7fa;
        }

        QLabel{
            color:#003366;
        }

        QLineEdit{
            padding:12px;
            border:2px solid #cccccc;
            border-radius:8px;
            font-size:14px;
        }

        QPushButton{
            background:#0055aa;
            color:white;
            padding:12px;
            border:none;
            border-radius:8px;
            font-size:15px;
            font-weight:bold;
        }

        QPushButton:hover{
            background:#003f80;
        }
        """)

        mainLayout = QVBoxLayout()
        mainLayout.setAlignment(Qt.AlignCenter)
        mainLayout.setSpacing(15)

        # Logo

        self.logo = QLabel()

        logo = os.path.join("assets","logo.png")

        if os.path.exists(logo):

            pix = QPixmap(logo)

            self.logo.setPixmap(
                pix.scaled(
                    130,
                    130,
                    Qt.KeepAspectRatio,
                    Qt.SmoothTransformation
                )
            )

        else:

            self.logo.setText("VEDANTA")

            self.logo.setFont(QFont("Segoe UI",26,QFont.Bold))

        self.logo.setAlignment(Qt.AlignCenter)

        # Company

        company = QLabel("VEDANTA ALUMINUM REFINERY")

        company.setAlignment(Qt.AlignCenter)

        company.setFont(QFont("Segoe UI",18,QFont.Bold))

        subtitle = QLabel("Employee Report Management System")

        subtitle.setAlignment(Qt.AlignCenter)

        subtitle.setStyleSheet("color:gray;font-size:13px;")

        # Username

        self.username = QLineEdit()

        self.username.setPlaceholderText("Username")

        # Password

        self.password = QLineEdit()

        self.password.setPlaceholderText("Password")

        self.password.setEchoMode(QLineEdit.Password)

        # Buttons

        self.loginBtn = QPushButton("LOGIN")

        self.exitBtn = QPushButton("EXIT")

        self.exitBtn.setStyleSheet("""
        QPushButton{
            background:#d32f2f;
            color:white;
            padding:12px;
            border-radius:8px;
            font-weight:bold;
        }

        QPushButton:hover{
            background:#b71c1c;
        }
        """)

        self.exitBtn.clicked.connect(QApplication.quit)
        self.loginBtn.clicked.connect(self.handle_login)
        self.username.returnPressed.connect(self.handle_login)
        self.password.returnPressed.connect(self.handle_login)

        mainLayout.addStretch()

        mainLayout.addWidget(self.logo)

        mainLayout.addWidget(company)

        mainLayout.addWidget(subtitle)

        mainLayout.addSpacing(25)

        mainLayout.addWidget(self.username)

        mainLayout.addWidget(self.password)

        mainLayout.addSpacing(15)

        mainLayout.addWidget(self.loginBtn)

        mainLayout.addWidget(self.exitBtn)

        mainLayout.addStretch()

        self.setLayout(mainLayout)

    def handle_login(self):
        username = self.username.text().strip()
        password = self.password.text().strip()

        if not username or not password:
            QMessageBox.warning(self, "Missing Credentials", "Enter both username and password.")
            return

        user = self.db.verify_login(username, password)
        if user:
            QMessageBox.information(self, "Login Successful", f"Welcome back, {user['fullname']}.")
            self.open_dashboard()
        else:
            QMessageBox.warning(self, "Login Failed", "Invalid username or password.")

    def open_dashboard(self):
        try:
            # import lazily to avoid import-time failure if QtWebEngine isn't available
            from dashboard import DashboardWindow
        except Exception as e:
            QMessageBox.critical(self, "Dashboard Load Error", f"Unable to open dashboard:\n{e}")
            return

        self.dashboard = DashboardWindow()
        self.dashboard.show()
        self.close()
