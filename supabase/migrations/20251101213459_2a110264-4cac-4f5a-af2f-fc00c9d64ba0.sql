-- Grant INSERT privileges to anon role on all public tables
-- RLS policies don't work without these base table permissions!

GRANT INSERT ON public.applications TO anon;
GRANT INSERT ON public.callback_requests TO anon;
GRANT INSERT ON public.application_documents TO anon;
GRANT INSERT ON storage.objects TO anon;