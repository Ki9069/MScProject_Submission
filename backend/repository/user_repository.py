from database.database import connect_db

#Store user profile registration
def create_user(user_group, name, age, interest):
    conn = connect_db()

    try:
        cursor = conn.cursor()
    
        cursor.execute ("INSERT INTO user (user_group, name, age, interest) VALUES (?, ?, ?, ?)",(user_group, name, age, interest),)

        conn.commit()
        return cursor.lastrowid

    finally:
        conn.close()