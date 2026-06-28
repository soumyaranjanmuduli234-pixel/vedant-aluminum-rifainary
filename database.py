import sqlite3
import hashlib
import os

# -----------------------------
# Database Configuration
# -----------------------------
DB_FOLDER = "database"
DB_NAME = "vedanta.db"
DB_PATH = os.path.join(DB_FOLDER, DB_NAME)


class Database:

    def __init__(self):
        os.makedirs(DB_FOLDER, exist_ok=True)
        self.conn = sqlite3.connect(DB_PATH)
        self.cursor = self.conn.cursor()

    # -----------------------------
    # Create All Tables
    # -----------------------------
    def create_tables(self):

        # Users Table
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            fullname TEXT,
            role TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # Employees Table
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emp_id TEXT UNIQUE,
            name TEXT,
            department TEXT,
            designation TEXT,
            mobile TEXT,
            email TEXT
        )
        """)

        # Reports Table
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_no TEXT,
            employee TEXT,
            department TEXT,
            report_date TEXT,
            status TEXT,
            remarks TEXT
        )
        """)

        # Settings Table
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT,
            theme TEXT,
            language TEXT
        )
        """)

        self.conn.commit()

    # -----------------------------
    # Password Hash
    # -----------------------------
    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    # -----------------------------
    # Create Default Admin
    # -----------------------------
    def create_default_admin(self):

        self.cursor.execute(
            "SELECT * FROM users WHERE username=?",
            ("admin",)
        )

        user = self.cursor.fetchone()

        if user is None:

            self.cursor.execute("""
            INSERT INTO users(
                username,
                password,
                fullname,
                role
            )
            VALUES(?,?,?,?)
            """, (
                "admin",
                self.hash_password("admin123"),
                "System Administrator",
                "Admin"
            ))

            self.conn.commit()

            print("Default Admin Created")
        else:
            print("Admin Already Exists")

    # -----------------------------
    # Login Verification
    # -----------------------------
    def verify_login(self, username, password):

        password = self.hash_password(password)

        self.cursor.execute("""
        SELECT * FROM users
        WHERE username=?
        AND password=?
        """, (username, password))

        return self.cursor.fetchone()

    # -----------------------------
    # Close Database
    # -----------------------------
    def close(self):
        self.conn.close()


# -----------------------------
# First Time Setup
# -----------------------------
if __name__ == "__main__":

    db = Database()

    db.create_tables()

    db.create_default_admin()

    db.close()

    print("Database Ready")