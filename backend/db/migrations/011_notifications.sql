-- In-app notifications (badges, streak warnings, milestones). Safe to re-run.

CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  type VARCHAR(40) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_am VARCHAR(255) NOT NULL,
  body_en TEXT NOT NULL,
  body_am TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notifications_user_created (user_id, created_at DESC),
  KEY idx_notifications_user_unread (user_id, is_read),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
