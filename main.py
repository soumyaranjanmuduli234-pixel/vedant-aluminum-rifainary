import sys
from PySide6.QtWidgets import QApplication
from splash import SplashScreen


def main():
    app = QApplication(sys.argv)
    window = SplashScreen()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()