from database.database import connect_db

#Store story generation log event
def log_story(user_id, wordpair_id, current_time):
    conn = connect_db()

    try:
        cursor = conn.cursor()

        cursor.execute("INSERT INTO story_log (user_id, wordpair_id, generated_at) VALUES (?, ?, ?)",(user_id, wordpair_id, current_time))
        conn.commit()
    
    finally:
        conn.close()
