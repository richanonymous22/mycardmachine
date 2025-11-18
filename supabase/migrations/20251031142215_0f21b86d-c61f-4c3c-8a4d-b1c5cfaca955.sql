-- Fix RLS policies for admin-only access
-- Users can only INSERT their submissions, not view them
-- Admins will access via service role or admin dashboard

-- Applications table: Keep INSERT open, remove public SELECT
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.applications;

CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Callback requests table: Keep INSERT open, remove public SELECT
DROP POLICY IF EXISTS "Users can view their own callback requests" ON public.callback_requests;
DROP POLICY IF EXISTS "Anyone can insert callback requests" ON public.callback_requests;

CREATE POLICY "Anyone can submit callback requests"
ON public.callback_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Application documents table: Keep INSERT open, remove public SELECT
DROP POLICY IF EXISTS "Users can view documents" ON public.application_documents;
DROP POLICY IF EXISTS "Anyone can insert documents" ON public.application_documents;

CREATE POLICY "Anyone can upload documents"
ON public.application_documents
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Storage bucket policies: Allow uploads but no public downloads
-- Admins access via service role
DROP POLICY IF EXISTS "Anyone can upload application documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view application documents" ON storage.objects;

CREATE POLICY "Anyone can upload to application-documents"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'application-documents');

-- Note: No SELECT policy = only service role (admins) can download files