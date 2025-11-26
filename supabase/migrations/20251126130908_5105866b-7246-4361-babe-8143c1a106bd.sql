-- Enable RLS on tables that were missing it
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;