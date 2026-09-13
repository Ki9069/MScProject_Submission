import json
from repository.station_repository import get_station_wordpairs

# Prepare wordpairs data for frontend
def get_station_wordpairs_data(station_id):
    rows = get_station_wordpairs(station_id)
    wordpairs = []

    for row in rows:
        wordpairs.append({
            "id": row["pair_id"],
            "charAHighlight": json.loads(row["a_highlight_strokes"] or "[]"),
            "charBHighlight": json.loads(row["b_highlight_strokes"] or "[]"),
            "diffHint": row["diff_hint"],
            "famMission": row["fam_mission"],
            "charA": {
                "id": row["charA_id"],
                "english": row["charA_english"],
                "chinese": row["charA_chinese"],
                "img_path": row["charA_img"],
                "alt_text": row["charA_alt"],
                "jyutping": row["charA_jyutping"],
                "stroke_num": row["charA_strokes"],
                "radical": row["charA_radical"],
                "word_ex": row["charA_wordex"]
            },
            "charB": {
                "id": row["charB_id"],
                "english": row["charB_english"],
                "chinese": row["charB_chinese"],
                "img_path": row["charB_img"],
                "alt_text": row["charB_alt"],
                "jyutping": row["charB_jyutping"],
                "stroke_num": row["charB_strokes"],
                "radical": row["charB_radical"],
                "word_ex": row["charB_wordex"]       
            }       
        })
    return wordpairs