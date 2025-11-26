-- Drop and recreate documents_required column as JSONB
ALTER TABLE public.providers DROP COLUMN documents_required;
ALTER TABLE public.providers ADD COLUMN documents_required JSONB;