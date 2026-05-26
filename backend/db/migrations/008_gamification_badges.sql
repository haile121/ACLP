-- Badges + user_badges (gamification). Safe to re-run: INSERT IGNORE for seed rows.

CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(64) PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_am VARCHAR(255) NOT NULL,
  description_en VARCHAR(512) NULL,
  description_am VARCHAR(512) NULL,
  icon_url VARCHAR(512) NOT NULL DEFAULT '',
  icon_emoji VARCHAR(16) NULL,
  criteria_type VARCHAR(40) NOT NULL,
  criteria_value INT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  KEY idx_badges_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_badges (
  user_id VARCHAR(36) NOT NULL,
  badge_id VARCHAR(64) NOT NULL,
  earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id),
  KEY idx_user_badges_user (user_id),
  KEY idx_user_badges_badge (badge_id),
  CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_badges_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO badges (id, name_en, name_am, description_en, description_am, icon_url, icon_emoji, criteria_type, criteria_value, sort_order) VALUES
('first_spark', 'First Spark', 'የመጀመሪያ ነዳጅ', 'You showed up for day one — the hardest step.', 'ለመጀመሪያው ቀን እንደተገኙ — ከባዱ እርምጃ።', '', '✨', 'streak', 1, 10),
('five_day_flame', 'Five-Day Flame', 'የአምስት ቀን እሳት', 'Five days in a row on the platform. Momentum is building.', 'ለአምስት ቀናት ተከታታይ። ኃይል እየጨመረ ነው።', '', '🔥', 'streak', 5, 20),
('week_wonder', 'Week Wonder', 'የሳምንት ድንቅ', 'Seven straight days — habits are forming.', 'ለሰባት ቀናት ተከታታይ — ወጎች እየተገነቡ ነው።', '', '🌟', 'streak', 7, 30),
('fortnight_focus', 'Fortnight Focus', 'የሁለት ሳምንት ትኩረት', 'Fourteen days of showing up. That is real discipline.', 'ለአሥራ አራት ቀናት ተገኝተዋል። ይህ እውነተኛ ስነ ምግባር ነው።', '', '🎯', 'streak', 14, 40),
('monthly_mountaineer', 'Monthly Mountaineer', 'የወር ተራራማ', 'Thirty days — you are not dabbling; you are climbing.', 'ለሰላሳ ቀናት — እየተሳለሙ አይደለም፣ እየወጡ ነው።', '', '⛰️', 'streak', 30, 50),
('century_streak', 'Century Streak', 'የመቶ ቀን ተከታታይነት', 'One hundred login days. Legendary consistency.', 'መቶ የመግቢያ ቀናት። ከፍተኛ ተስማሚነት።', '', '💯', 'streak', 100, 60),
('inferno_three_hundred', 'Inferno 300', 'የ300 ቀን ነዳጅ', 'Three hundred days — you live this craft.', 'ሦስት መቶ ቀናት — ሙያውን በህይወትዎ ታድርጉታሉ።', '', '🏔️', 'streak', 300, 70),

('xp_starter', 'XP Starter', 'XP መጀመሪያ', 'Your first hundred XP — curiosity in motion.', 'የመጀመሪያው መቶ XP — ምርምር በእንቅስቃሴ ላይ።', '', '⚡', 'xp_milestone', 100, 110),
('xp_challenger', 'XP Challenger', 'XP ተፋላጊ', 'Five hundred XP — you are pushing past comfort.', 'አምስት መቶ XP — ከመጣጣፊያ ውጭ እየገፉ ነው።', '', '🥊', 'xp_milestone', 500, 120),
('xp_champion', 'XP Champion', 'XP አልፋዊ', 'Two thousand XP — the platform knows your name.', 'ሁለት ሺህ XP — መድረኩ ስምዎን ያውቃል።', '', '🏆', 'xp_milestone', 2000, 130),

('coin_pouch', 'Coin Pouch', 'የሳንቲም ከረጢት', 'Fifty coins saved — small wins stack up.', 'አምስት አስራ ሳንቲም — ትናንሽ ድሎች ይከማቻሉ።', '', '🪙', 'coins_milestone', 50, 210),
('coin_hoard', 'Coin Hoard', 'የሳንቲም ድልድል', 'Two hundred coins — you are investing in the grind.', 'ሁለት መቶ ሳንቲም — በስራው ውስጥ እየኖሩ ነው።', '', '💰', 'coins_milestone', 200, 220),
('coin_vault', 'Coin Vault', 'የሳንቲም ባንክ', 'One thousand coins — serious saver energy.', 'አንድ ሺህ ሳንቲም — ከባድ ቆጣቢ ኃይል።', '', '🏦', 'coins_milestone', 1000, 230),

('quiz_breakthrough', 'Quiz Breakthrough', 'የኩዝ አሻራ', 'Passed your first quiz — proof you are learning, not just watching.', 'የመጀመሪያውን ኩዝ አልፈዋል — እየተማሩ እንጂ እየተመለከቱ ብቻ አይደለም።', '', '🧩', 'quiz_pass_any', 1, 310),
('module_final_ace', 'Module Final Ace', 'የሞዱል ፍተሻ አልፋዊ', 'Scored 90%+ on a level final exam — elite recall.', 'በደረጃ ፍተሻ ላይ 90%+ — ከፍተኛ ማሰቢያ።', '', '🎓', 'exam_score_max', 90, 320),
('track_final_glory', 'Track Final Glory', 'የትራክ ፍተሻ ክብር', '90%+ on the C++ module final — you own the material.', 'በC++ ሞዱል ፍተሻ ላይ 90%+ — ቁሳቁሱን ትቆጣጠራሉ።', '', '👑', 'course_track_final_score', 90, 330),

('reader_five', 'Five Sessions Deep', 'አምስት ክፍለ ጊዜያት', 'Completed five reading lessons — steady progress.', 'አምስት የንባብ ትምህርቶችን አጠናቀዋል — ያለ ማቋረጥ እድገት።', '', '📘', 'lessons_completed', 5, 410),
('reader_twentyfive', 'Deep Reader', 'ጥልቅ አንባቢ', 'Twenty-five lessons complete — the curriculum is opening up.', 'ሃያ አምስት ትምህርቶች — ካሪኩሉም እየተከፈተ ነው።', '', '📚', 'lessons_completed', 25, 420);
