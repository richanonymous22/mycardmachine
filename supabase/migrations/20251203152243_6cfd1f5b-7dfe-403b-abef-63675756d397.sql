-- Add parent_id to blog_comments for replies
ALTER TABLE public.blog_comments 
ADD COLUMN parent_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE;

-- Create blog_likes table
CREATE TABLE public.blog_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_fingerprint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_fingerprint)
);

-- Create comment_likes table  
CREATE TABLE public.comment_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  user_fingerprint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_fingerprint)
);

-- Enable RLS on new tables
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Blog likes policies
CREATE POLICY "Anyone can view blog likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blog likes" ON public.blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their own blog likes" ON public.blog_likes FOR DELETE USING (true);

-- Comment likes policies
CREATE POLICY "Anyone can view comment likes" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comment likes" ON public.comment_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their own comment likes" ON public.comment_likes FOR DELETE USING (true);