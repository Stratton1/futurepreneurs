-- Migration 014: Atomic funding increments + webhook idempotency
--
-- WHY: The webhook handler previously used a read-then-write pattern for
-- total_raised and backer_count. Concurrent webhooks could lose updates.
-- This migration adds an RPC for atomic increments and a unique constraint
-- on stripe_session_id to prevent duplicate webhook processing.

-- 1. Add stripe_session_id column to backings (for idempotency tracking)
ALTER TABLE backings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- 2. Unique constraint to prevent duplicate webhook processing
CREATE UNIQUE INDEX IF NOT EXISTS backings_stripe_session_id_unique
  ON backings (stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- 3. Atomic increment RPC for project funding
CREATE OR REPLACE FUNCTION increment_project_funding(
  p_project_id UUID,
  p_amount NUMERIC,
  p_backer_increment INT DEFAULT 1
)
RETURNS TABLE(new_total NUMERIC, new_count INT, goal_amount NUMERIC, current_status TEXT, student_id UUID) AS $$
  UPDATE projects
  SET
    total_raised = total_raised + p_amount,
    backer_count = backer_count + p_backer_increment
  WHERE id = p_project_id
  RETURNING
    total_raised AS new_total,
    backer_count AS new_count,
    goal_amount,
    status AS current_status,
    student_id;
$$ LANGUAGE sql;

-- 4. Atomic decrement RPC for refunds
CREATE OR REPLACE FUNCTION decrement_project_funding(
  p_project_id UUID,
  p_amount NUMERIC,
  p_backer_decrement INT DEFAULT 1
)
RETURNS void AS $$
  UPDATE projects
  SET
    total_raised = GREATEST(0, total_raised - p_amount),
    backer_count = GREATEST(0, backer_count - p_backer_decrement)
  WHERE id = p_project_id;
$$ LANGUAGE sql;
