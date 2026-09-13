from database.database import connect_db

#Retrieve all stations
def get_stations():
    conn = connect_db()
    
    try:
        cursor = conn.cursor()

        cursor.execute ("SELECT * FROM station")
        rows = cursor.fetchall()

        return [dict(row) for row in rows] #convert to dictionary
    
    finally:
         conn.close()

#Retrieve all character pairs for a station
def get_station_wordpairs(station_id):
    conn = connect_db()
    
    try:
        cursor = conn.cursor()

        query = """
            SELECT wp.wordpair_id AS pair_id,
                    wp.a_highlight_strokes,
                    wp.b_highlight_strokes,
                    wp.diff_hint,
                    wp.fam_mission,
                    ca.char_id AS charA_id, ca.english AS charA_english, ca.chinese AS charA_chinese,
                    cb.char_id AS charB_id, cb.english AS charB_english, cb.chinese AS charB_chinese,
                    ca.img_path AS charA_img, ca.alt_text AS charA_alt, ca.jyutping AS charA_jyutping, 
                    cb.img_path AS charB_img, cb.alt_text AS charB_alt, cb.jyutping AS charB_jyutping, 
                    ca.stroke_num AS charA_strokes, ca.radical AS charA_radical, ca.word_ex AS charA_wordex,
                    cb.stroke_num AS charB_strokes, cb.radical AS charB_radical, cb.word_ex AS charB_wordex
            FROM wordpair wp
            JOIN character ca ON wp.charA_id = ca.char_id
            JOIN character cb ON wp.charB_id = cb.char_id
            WHERE wp.station_id = ?
        """

        cursor.execute (query, (station_id,))
        return cursor.fetchall()

    finally:
        conn.close()