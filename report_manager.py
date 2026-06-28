from database import Database
import datetime


class ReportManager:
    def __init__(self):
        self.db = Database()

    def save_report(self, report_no, employee, department, report_date, status, remarks):
        self.db.cursor.execute(
            "INSERT INTO reports (report_no, employee, department, report_date, status, remarks) VALUES (?, ?, ?, ?, ?, ?)",
            (report_no, employee, department, report_date, status, remarks)
        )
        self.db.conn.commit()

    def list_reports(self):
        self.db.cursor.execute("SELECT * FROM reports ORDER BY id DESC")
        return self.db.cursor.fetchall()

    def create_report_no(self):
        return "RPT-" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
