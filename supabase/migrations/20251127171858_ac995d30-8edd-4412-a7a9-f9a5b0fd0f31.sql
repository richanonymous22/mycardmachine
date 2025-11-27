-- Create table for blog comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view comments
CREATE POLICY "Blog comments viewable by everyone"
ON public.blog_comments
FOR SELECT
USING (true);

-- Allow anyone to insert comments
CREATE POLICY "Anyone can insert blog comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (true);
