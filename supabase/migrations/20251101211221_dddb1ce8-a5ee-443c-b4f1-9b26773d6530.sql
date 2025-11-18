-- Fix RLS policies: Use TO public instead of TO anon, authenticated
-- This allows both anonymous and authenticated users to insert

-- Applications table
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;

CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO public
WITH CHECK (true);

-- Callback requests table
DROP POLICY IF EXISTS "Anyone can submit callback requests" ON public.callback_requests;

CREATE POLICY "Anyone can submit callback requests"
ON public.callback_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Application documents table
DROP POLICY IF EXISTS "Anyone can upload documents" ON public.application_documents;

CREATE POLICY "Anyone can upload documents"
ON public.application_documents
FOR INSERT
TO public
WITH CHECK (true);

-- Storage bucket policies
DROP POLICY IF EXISTS "Anyone can upload to application-documents" ON storage.objects;

CREATE POLICY "Anyone can upload to application-documents"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'application-documents');