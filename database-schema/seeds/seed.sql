-- Seed data for Petly database
-- This file contains sample INSERT statements for development/testing

-- Sample User
-- Note: These password hashes are examples and should be replaced with actual bcrypt hashes
-- Example password: 'password123' hashed with bcrypt
INSERT INTO "user" (id, username, password_hash, created_at, updated_at) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'john_doe', '$2b$10$rBV2KgY5V0pB.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', NOW(), NOW()),
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'jane_smith', '$2b$10$aBV2KgY5V0pB.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', NOW(), NOW()),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'pet_lover', '$2b$10$cBV2KgY5V0pB.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', NOW(), NOW()),
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'animal_fan', '$2b$10$dBV2KgY5V0pB.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', NOW(), NOW());

-- Sample Refresh Token
-- Note: These token hashes are examples and should be replaced with actual hashed tokens
-- Tokens expire 30 days from creation
INSERT INTO refresh_token (id, user_id, token_hash, expires_at, created_at, revoked_at) VALUES
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'token_hash_1234567890abcdef1234567890abcdef', NOW() + INTERVAL '30 days', NOW(), NULL),
  ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'token_hash_2234567890abcdef1234567890abcdef', NOW() + INTERVAL '30 days', NOW(), NULL),
  ('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'token_hash_3234567890abcdef1234567890abcdef', NOW() + INTERVAL '30 days', NOW(), NULL),
  -- Example of a revoked token
  ('16eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'token_hash_4234567890abcdef1234567890abcdef', NOW() + INTERVAL '30 days', NOW(), NOW());
