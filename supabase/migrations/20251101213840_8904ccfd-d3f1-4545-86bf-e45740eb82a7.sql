-- DISABLE RLS entirely for public form submissions
-- This is a public website with no authentication - RLS is overkill

ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents DISABLE ROW LEVEL SECURITY;

-- Drop all the RLS policies since we don't need them
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can submit callback requests" ON public.callback_requests;
DROP POLICY IF EXISTS "Anyone can upload documents" ON public.application_documents;