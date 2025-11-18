-- Fix RLS policies: Explicitly target anon role for anonymous access
-- The issue was that TO public doesn't guarantee anon access in Supabase

-- Applications table
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;

CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon
WITH CHECK (true);

-- Callback requests table  
DROP POLICY IF EXISTS "Anyone can submit callback requests" ON public.callback_requests;

CREATE POLICY "Anyone can submit callback requests"
ON public.callback_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Application documents table
DROP POLICY IF EXISTS "Anyone can upload documents" ON public.application_documents;

CREATE POLICY "Anyone can upload documents"
ON public.application_documents
FOR INSERT
TO anon
WITH CHECK (true);

-- Storage bucket policies
DROP POLICY IF EXISTS "Anyone can upload to application-documents" ON storage.objects;

CREATE POLICY "Anyone can upload to application-documents"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'application-documents');