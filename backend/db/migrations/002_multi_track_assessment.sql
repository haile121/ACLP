-- Multi-track onboarding: C++ vs C++ placement tests.
-- Run once against your MySQL database (e.g. amharic_cpp_platform).

ALTER TABLE assessment_questions
  ADD COLUMN track VARCHAR(16) NOT NULL DEFAULT 'cpp';

ALTER TABLE users
  ADD COLUMN primary_track ENUM('cpp') NULL DEFAULT NULL,
  ADD COLUMN cpp_level VARCHAR(32) NULL DEFAULT NULL,
  ADD COLUMN web_level VARCHAR(32) NULL DEFAULT NULL,
  ADD COLUMN cpp_assessment_completed TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN web_assessment_completed TINYINT(1) NOT NULL DEFAULT 0;

-- Existing learners: treat prior single assessment as C++ primary.
UPDATE users
SET
  cpp_level = level,
  cpp_assessment_completed = 1,
  primary_track = 'cpp'
WHERE assessment_completed = 1;
