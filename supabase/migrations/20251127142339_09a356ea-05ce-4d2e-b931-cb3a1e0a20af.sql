-- Fix RLS policy for public inserts on applications table
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public insert for applications" ON public.applications;

-- Create new policy that explicitly allows anonymous users to insert
CREATE POLICY "Allow public insert for applications" 
ON public.applications
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Do the same for callback_requests to ensure consistency
DROP POLICY IF EXISTS "Allow public insert for callback requests" ON public.callback_requests;

CREATE POLICY "Allow public insert for callback requests" 
ON public.callback_requests
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Do the same for application_documents
DROP POLICY IF EXISTS "Allow public insert for documents" ON public.application_documents;

CREATE POLICY "Allow public insert for documents" 
ON public.application_documents
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);