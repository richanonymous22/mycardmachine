-- Create enums for status fields
CREATE TYPE application_status AS ENUM (
  'pending',
  'documents_uploaded',
  'under_review',
  'approved',
  'rejected',
  'completed'
);

CREATE TYPE callback_status AS ENUM (
  'pending',
  'contacted',
  'scheduled',
  'completed',
  'cancelled'
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  monthly_turnover NUMERIC NOT NULL,
  estimated_monthly_cost NUMERIC,
  estimated_annual_savings NUMERIC,
  status application_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create callback_requests table
CREATE TABLE public.callback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  partner_id TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  monthly_turnover NUMERIC,
  preferred_time TEXT,
  notes TEXT,
  status callback_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create application_documents table
CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Applications table RLS policies
CREATE POLICY "Anyone can insert applications"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
  ON public.applications
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Callback requests table RLS policies
CREATE POLICY "Anyone can insert callback requests"
  ON public.callback_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own callback requests"
  ON public.callback_requests
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Application documents table RLS policies
CREATE POLICY "Anyone can insert documents"
  ON public.application_documents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view documents"
  ON public.application_documents
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create storage bucket for application documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-documents',
  'application-documents',
  false,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Anyone can upload documents"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'application-documents');

CREATE POLICY "Users can view documents in bucket"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'application-documents');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER callback_requests_updated_at
  BEFORE UPDATE ON public.callback_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();