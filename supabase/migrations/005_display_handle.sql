-- Epic 1: Safe usernames — public display handle (e.g. BrightSpark42) for students
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_handle TEXT UNIQUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_display_handle ON user_profiles(display_handle) WHERE display_handle IS NOT NULL;

COMMENT ON COLUMN user_profiles.display_handle IS 'Public display name for students; auto-generated safe handle, no PII';
