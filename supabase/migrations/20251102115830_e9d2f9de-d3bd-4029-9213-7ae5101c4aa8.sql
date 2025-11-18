-- Add source field to track form type
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS source text DEFAULT 'application_form';
ALTER TABLE public.callback_requests ADD COLUMN IF NOT EXISTS source text DEFAULT 'callback_form';

-- Add business_name field to callback_requests to match applications
ALTER TABLE public.callback_requests ADD COLUMN IF NOT EXISTS business_name text;

-- Update status enums to include 'contacted' and 'converted'
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'contacted';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'converted';

ALTER TYPE callback_status ADD VALUE IF NOT EXISTS 'converted';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_callback_requests_created_at ON public.callback_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_callback_requests_status ON public.callback_requests(status);