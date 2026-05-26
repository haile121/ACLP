-- Multiple optional completion videos per track (admin-managed).
ALTER TABLE track_completion_videos DROP INDEX uq_track_completion_track;

ALTER TABLE track_completion_videos
  ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER thumbnail_url;

CREATE INDEX idx_track_completion_track_sort ON track_completion_videos (track, sort_order, id);
