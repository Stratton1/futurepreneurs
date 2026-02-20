-- Epic 1: Zero-PII Avatars — avatar_config JSONB for built avatar (hairStyle, hairColor, skinTone, accessories)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_config JSONB;

COMMENT ON COLUMN user_profiles.avatar_config IS 'Built avatar options: hairStyle, hairColor, skinTone, accessories[] — no real photos for students';
