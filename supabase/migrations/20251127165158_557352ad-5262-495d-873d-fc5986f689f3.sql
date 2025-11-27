-- Create public bucket for blog images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow public read access to blog images
create policy "Public read access to blog images"
  on storage.objects
  for select
  using (bucket_id = 'blog-images');

-- Allow authenticated users to upload blog images
create policy "Authenticated users can upload blog images"
  on storage.objects
  for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- Allow authenticated users to update blog images
create policy "Authenticated users can update blog images"
  on storage.objects
  for update
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete blog images
create policy "Authenticated users can delete blog images"
  on storage.objects
  for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');