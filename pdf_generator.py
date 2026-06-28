from PySide6.QtCore import QObject

def export_webview_to_pdf(webview, out_path):
    """Export a QWebEngineView's page to a PDF file.

    Args:
        webview: QWebEngineView instance
        out_path: destination file path (str)
    """
    try:
        page = webview.page()
        # PySide6 provides printToPdf; newer APIs accept a filename or callback
        try:
            # Try direct filename (PySide6 >= 6.5+)
            page.printToPdf(out_path)
            return True
        except TypeError:
            # Fallback: use callback-based API
            result = {"done": False}

            def on_pdf_ready(bytes_or_ok):
                # some bindings pass bytes, some pass a bool
                result["done"] = True

            page.printToPdf(on_pdf_ready)
            return result["done"]
    except Exception:
        return False
