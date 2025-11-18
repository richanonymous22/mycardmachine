-- Enable RLS on all tables to secure personal data
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Policy for applications: Allow public to insert (for form submissions), no read access
CREATE POLICY "Allow public insert for applications"
ON public.applications
FOR INSERT
TO public
WITH CHECK (true);

-- Policy for callback_requests: Allow public to insert (for form submissions), no read access
CREATE POLICY "Allow public insert for callback requests"
ON public.callback_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Policy for application_documents: Allow public to insert (for document uploads), no read access
CREATE POLICY "Allow public insert for documents"
ON public.application_documents
FOR INSERT
TO public
WITH CHECK (true);

-- Note: No SELECT, UPDATE, or DELETE policies are created for public users
-- Only the service role (used by edge functions) can read this data