from database.database import connect_db

#Store a user's learnging progress for a word pair
def track_wordpairs_progress(data):
    conn = connect_db()

    try:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO wordpair_progress (
                wordpair_id, user_id, is_wordpair_completed, learning_start_time, 
                learning_end_time, learning_total_time_spent, challenge_item_correct 
            ) VALUES (?, ?, ?, ?, ?, ?,?)
            """, (
            data.get("wordpairID"), 
            data.get("userID"), 
            data.get("isWordpairCompleted"), 
            data.get("learningStartTime"), 
            data.get("learningEndTime"),
            data.get("learningTotalTime"),
            data.get("challengeItemCorrect")
            )
        )
        conn.commit()
    finally:
        conn.close()

#Store a user's learnging progress / performance for a station
def track_station_progress(data):
    conn = connect_db()

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO station_progress (
                user_id, station_id, is_station_completed,challenge_start_time, challenge_end_time ,challenge_total_response_time,
                back_phase, first_try_accuracy, total_wrong_attempts
            ) VALUES (?, ?, ?, ?, ?, ?, ?,? ,?)
        """, (
            data.get("userID"),
            data.get("stationID"),
            data.get("isStationCompleted"),
            data.get("challengeStartTime"),
            data.get("challengeEndTime"),
            data.get("challengeTotalResponseTime"),
            data.get("backPhase"),
            data.get("firstTryCorrectCount"),
            data.get("totalWrongAttempts")
        ))
        conn.commit()
    finally:
            conn.close()
