from pathlib import Path
import os
import sqlite3

LOCAL_PATH = Path(__file__).resolve().parent.parent / "app.db"
DB_PATH = Path(os.getenv("DATABASE_PATH", LOCAL_PATH)) 

#DB_PATH = Path(os.getenv("DATABASE_PATH", "/var/data/app.db"))

# Create a database connection
def connect_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row 
    return conn