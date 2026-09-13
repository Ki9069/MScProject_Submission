from database.database import connect_db

# Initialise the db tables and preset content
def init_db():
  conn = connect_db()
  cursor = conn.cursor()

  # create tables
  cursor.executescript("""
  
  CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY,
    user_group TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    name TEXT,
    age INT,
    interest TEXT 
  );

  CREATE TABLE IF NOT EXISTS station (
    station_id INTEGER PRIMARY KEY,
    station_name TEXT
  );

  CREATE TABLE IF NOT EXISTS character (
    char_id INTEGER PRIMARY KEY,
    chinese TEXT NOT NULL,
    english TEXT NOT NULL,
    img_path TEXT,
    alt_text TEXT,
    jyutping TEXT,
    stroke_num INT,
    radical TEXT,
    word_ex TEXT
  );

  CREATE TABLE IF NOT EXISTS wordpair (
    wordpair_id INTEGER PRIMARY KEY ,
    station_id INTEGER NOT NULL,
    charA_id INTEGER NOT NULL,
    charB_id INTEGER NOT NULL,
    a_highlight_strokes TEXT,
    b_highlight_strokes TEXT,
    diff_hint TEXT,
    fam_mission TEXT,
    CONSTRAINT wp_fk_stat FOREIGN KEY (station_id) REFERENCES station (station_id),
    CONSTRAINT wp_fk_charA FOREIGN KEY (charA_id) REFERENCES character (char_id),
    CONSTRAINT wp_fk_charB FOREIGN KEY (charB_id) REFERENCES character (char_id)
  );

  CREATE TABLE IF NOT EXISTS wordpair_progress (
    wordpair_progress_id INTEGER PRIMARY KEY,
    wordpair_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_wordpair_completed INT DEFAULT 0,
    learning_start_time TEXT,
    learning_end_time TEXT,
    learning_total_time_spent INT,
    challenge_item_correct INT,
    CONSTRAINT wpprogress_fk_stat FOREIGN KEY (wordpair_id) REFERENCES wordpair (wordpair_id),
    CONSTRAINT wpprogress_fk_user FOREIGN KEY (user_id) REFERENCES user (user_id)
  );

  CREATE TABLE IF NOT EXISTS station_progress (
    station_progress_id INTEGER PRIMARY KEY,
    station_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_station_completed INT DEFAULT 0,
    challenge_start_time TEXT,
    challenge_end_time TEXT,
    challenge_total_response_time INT,
    back_phase TEXT,
    first_try_accuracy INT,
    total_wrong_attempts INT DEFAULT 0,
    CONSTRAINT progress_fk_stat FOREIGN KEY (station_id) REFERENCES station (station_id),
    CONSTRAINT progress_fk_user FOREIGN KEY (user_id) REFERENCES user (user_id)
  );

  CREATE TABLE IF NOT EXISTS story_log(
    story_id INTEGER PRIMARY KEY ,
    user_id INTEGER NOT NULL,
    wordpair_id INTEGER NOT NULL,
    generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT story_fk_user FOREIGN KEY (user_id) REFERENCES user (user_id),
    CONSTRAINT story_fk_wp FOREIGN KEY (wordpair_id) REFERENCES wordpair(wordpair_id)
  );
  """)

  # Insert default stations data
  cursor.execute("SELECT COUNT(*) FROM station")
  if cursor.fetchone()[0] == 0:
    stations = [
      ('Mirror Match',),
      ('Spot the Extra',),
      ('Long or Short',),
      ('Swap the Part',)
    ]
    cursor.executemany("INSERT INTO station (station_name)  VALUES (?)",stations)

# Insert default character data
  cursor.execute("SELECT COUNT(*) FROM character")
  if cursor.fetchone()[0] == 0:
    characters = [
      ('羊', 'goat; sheep', '/images/sheep.png', 'a sheep', 'joeng4', '6', '羊', '羊肉 (mutton)',),
      ('牛', 'ox; cow', '/images/cow.png', 'a cow', 'ngau4', '4', '牛', '牛肉 (beef)',),
      ('人', 'man; person', '/images/human.png', 'a standing stick figure', 'jan4', '2', '人', '家人 (family members)',),
      ('入', 'go into', '/images/dooropen.png', 'an open door', 'jap6', '2', '入', '入口 (entrance)',),
      ('大', 'big', '/images/Big.png', 'two mince pies, one is bigger', 'daai6', '3', '大', '大人 (adult)',),
      ('六', 'six', '/images/six.png', 'number six', 'luk6', '4', '八', '六點 (six o\'clock)',),
      ('手', 'hand', '/images/hand2.png', 'a hand', 'sau2', '4', '手', '洗手 (wash hands)',),
      ('毛', 'hair; fur', '/images/furry.png', 'a man with a full beard and chest hair', 'mou4', '4', '毛', '毛巾 (towel)',),
      ('白', 'white', '/images/white.png', 'the character \"white\" in Chinese in white color', 'baak6', '5', '白', '白色 (white color)',),
      ('日', 'sun; day', '/images/calenday.png', 'a calendar', 'jat6', '4', '日', '日期 (date)',),
      ('太', 'too; very', '/images/sun.png', 'a sun with a smiley face', 'taai3', '4', '太', '太陽 (sun)',),
      ('犬', 'dog', '/images/largedog.png', 'a big fluffy white dog', 'hyun2', '4', '犬', '大型犬 (large dog)',),
      ('土', 'earth; soil', '/images/soil.png', 'a green plastic planter tray filled with soil', 'tou2', '3', '土', '泥土 (soil)',),
      ('士', 'bachelor, honorific', '/images/soldier.png', 'a king\'s guard', 'si6', '3', '士', '士兵 (soldier)',),
      ('買', 'buy', '/images/buy.png', 'a woman paying cash at a counter.', 'maai5', '12', '貝', '買東西  (buy things)',),
      ('賣', 'sell', '/images/sell2.png', 'a woman selling items at a flea market stall', 'maai6', '15', '貝', '賣書 (sell books)',),
      ('晴', 'sunny; clear', '/images/sunny.png', 'a sunny day', 'cing4', '12', '日', '晴天 (sunny day)',),
      ('睛', 'eyeball', '/images/eye.png', 'an eye', 'zing1', '13', '目', '眼睛 (eye)',),
      ('我', 'I; me', '/images/me.png', 'a figure standing inside a glowing yellow barrier.', 'ngo5', '7', '戈', '我們 (we)',),
      ('找', 'look for', '/images/lookfor.png', 'a man searching closely with a magnifying glass', 'zaau2', '7', '手', '找到 (find)',),
      ('未', 'not yet', '/images/wait.png', 'an unchecked box with a pointer arrow', 'mei6', '5', '木', '未到 (not yet arrived)',),
      ('末', 'end; final', '/images/end.png', 'a stage screen showing \"THE END\"', 'mut6', '5', '木', '週末 (weekend)',),
      ('平', 'flat; level', '/images/balance.png', 'a stick figure balancing on a seesaw board', 'ping4', '5', '干', '平安 (safe; peaceful), 平衡(balance)',),
      ('半', 'half', '/images/Half2.png', 'a pizza with two different flavours (half each)', 'bun3', '5', '十', '一半 (half)',)
    ]
    cursor.executemany("INSERT INTO character (chinese , english , img_path , alt_text, jyutping , stroke_num , radical , word_ex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",characters)

  # Insert default wordpair data
  cursor.execute("SELECT COUNT(*) FROM wordpair")
  if cursor.fetchone()[0] == 0:
    wordpairs = [
      ('1', '1', '2', '[0,1,3]', '[0,3]', 'Both are animals. 羊 has two "horns" at the top, while 牛 has one vertical line through the top.', 'Do you know if your family likes 羊肉  or 牛肉 more? Find out if you aren\'t sure!',),
      ('1', '3', '4', '[0]', '[1]', '人 looks like a person standing with left stroke overlapping. 入 looks like someone walking into a place with right stroke on top.', 'Let\'s make a 入口 (entrance) sign for your bedroom or another place at home!',),
      ('1', '5', '6', '[1,2]', '[0,2,3]', 'Connect all the strokes together in the center for 大. Leave some space for 六!', 'Do you know anyone in your family whose birthday is in 六月(June)?',),
      ('2', '7', '8', '[3]', '[3]', '手 ends with a straight vertical line hooked to the left. 毛 ends with a curved line sweeping out to the right.', 'Gently stroke a pet\'s or teddy bear\'s 毛 and give them a high-five with your 手!',),
      ('2', '9', '10', '[0]', '[]', '白 has an extra top slash stroke floating above 日!', 'How would you describe that extra stroke on 白? Share it with your parents!',),
      ('2', '11', '12', '[3]', '[3]', '太 places its extra dot right between the bottom legs. 犬 has its dot high up on the top right!', 'There is a more common way to say 犬 in Cantonese, do you know how to write it? Ask your parents if you aren\'t sure!',),
      ('3', '13', '14', '[0,2]', '[0,2]', '土 has a shorter top line and longer bottom line. 士 has a longer top line and shorter bottom line.', 'Can you name a type of  transport which has the character 士 in Cantonese?',),
      ('3', '15', '16', '[]', '[0,1,2]', '買 means "buy"; 賣 means "sell." They look similar but have different tops.', 'When visiting a British supermarket or Chinese grocery store, spot 3 things your family wants to 買!',),
      ('3', '17', '18', '[]', '[3]', 'Both have 青. 晴 has the 日 (sun) radical; 睛 has the 目 (eye) radical.', 'Is it 晴天 today?  If so, close your 眼睛 and feel the warm sun!',),
      ('4', '19', '20', '[0]', '[]', '我 has a small slash stroke at top left. 找 replaces it with a hand radical (扌).', '找 a pen and practise writing 我!',),
      ('4', '21', '22', '[0,1]', '[0,1]', '未 has a shorter top horizontal line. 末 has a longer top horizontal line.', 'Ask your family what they will do this 週末, or if dinner is 未 (not yet) ready!',),
      ('4', '23', '24', '[0]', '[2]', '平 has kept its top dots inside under the top line, while 半 reaches its dots up above the line!', 'Ask your parents to cut a fruit in 半 and share it together!',)
    ]
    cursor.executemany("INSERT INTO wordpair  (station_id , charA_id , charB_id , a_highlight_strokes, b_highlight_strokes, diff_hint , fam_mission ) VALUES (?, ?, ?, ?, ?,?,?)",wordpairs)

  conn.commit()
  conn.close()
  print("Database initialised successfully!")


if __name__ == "__main__":
  init_db()
