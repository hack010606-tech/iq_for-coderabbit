-- ============================================================================
--  Migration 009 — Test Results Approval / Published Status
--  Run in Supabase SQL Editor if desired (backend also supports fallback)
-- ============================================================================

alter table public.tests
  add column if not exists results_published boolean not null default false;

create index if not exists idx_tests_results_published on public.tests (results_published);
