-- Make the application-documents bucket public so documents can be accessed via direct links
UPDATE storage.buckets 
SET public = true 
WHERE id = 'application-documents';

-- Update RLS policies for public read access
CREATE POLICY "Public read access for application documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'application-documents');