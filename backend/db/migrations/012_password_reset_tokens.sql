-- Password reset tokens (single-use, expires). Safe to re-run.
-- No FK to users(id): column types vary across deployments (VARCHAR vs CHAR).

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reset_token_hash (token_hash),
  KEY idx_reset_user (user_id),
  KEY idx_reset_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
