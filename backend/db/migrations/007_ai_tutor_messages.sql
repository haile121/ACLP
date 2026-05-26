-- Per-user AI tutor Q&A (persisted for history UI).
CREATE TABLE IF NOT EXISTS ai_tutor_messages (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  language ENUM('am', 'en') NOT NULL DEFAULT 'en',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ai_tutor_user_created (user_id, created_at),
  CONSTRAINT fk_ai_tutor_messages_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
