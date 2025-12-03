import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  Linkedin as LinkedinIcon,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
 
const calculateReadingTime = (html: string) => {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
 
const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
 
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
 
      if (error) throw error;
      return data;
    },
  });
 
  const { data: relatedPosts } = useQuery({
    queryKey: ["related-blog-posts", slug, post?.tags],
    queryFn: async () => {
      if (!post?.tags || post.tags.length === 0) {
        return [] as any[];
      }
 
      const primaryTag = post.tags[0];
 
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .contains("tags", [primaryTag])
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
 
      if (error) throw error;
      return data;
    },
    enabled: !!post && !!post.tags && post.tags.length > 0,
  });
 
  const { data: comments } = useQuery({
    queryKey: ["blog-comments", post?.id],
    queryFn: async () => {
      if (!post?.id) return [] as any[];
 
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
 
      if (error) throw error;
      return data;
    },
    enabled: !!post?.id,
  });
 
  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!post?.id) {
        throw new Error("Post not loaded");
      }
 
      const trimmedContent = commentContent.trim();
      if (!trimmedContent) {
        throw new Error("Comment cannot be empty");
      }
 
      const { error } = await supabase.from("blog_comments").insert({
        post_id: post.id,
        author_name: commentAuthor || "Anonymous",
        content: trimmedContent,
      });
 
      if (error) throw error;
    },
    onSuccess: () => {
      setCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", post?.id] });
      toast({
        title: "Comment added",
        description: "Your comment is now visible below the article.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Comment failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
 
  const handleSubmitComment = (event: FormEvent) => {
    event.preventDefault();
    if (!commentContent.trim() || commentMutation.isPending) return;
    commentMutation.mutate();
  };
 
  const readingTime = post ? calculateReadingTime(post.content) : null;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
 
  const shareTo = (platform: "twitter" | "linkedin" | "facebook") => {
    if (!post) return;
 
    const url = encodeURIComponent(currentUrl || window.location.href);
    const text = encodeURIComponent(post.title);
 
    let shareUrl = "";
    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }
 
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };
 
  const handleNativeShare = async () => {
    if (!post) return;
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: post.title,
          text: post.excerpt,
          url: currentUrl,
        });
      } catch {
        // user cancelled share
      }
    }
  };
 
  const handleCopyLink = async () => {
    if (!currentUrl) return;
 
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        toast({
          title: "Link copied",
          description: "The article URL has been copied to your clipboard.",
        });
      }
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };
 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-8" />
              <div className="h-12 bg-muted rounded mb-4" />
              <div className="h-4 bg-muted rounded w-1/3 mb-8" />
              <div className="aspect-video bg-muted rounded mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
 
  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.meta_title || post.title} | My Card Machine</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </Helmet>
 
      <Navigation />
 
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
 
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
 
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
 
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.published_at
                    ? format(new Date(post.published_at), "MMMM d, yyyy")
                    : "Draft"}
                </span>
              </div>
 
              <span className="text-muted-foreground">•</span>
 
              <span>By {post.author_name}</span>
 
              {readingTime && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span>{readingTime} min read</span>
                </>
              )}
 
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
 
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <span className="text-sm text-muted-foreground">
                Share this article
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="hidden sm:inline-flex"
                  onClick={handleNativeShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Share on Twitter"
                  onClick={() => shareTo("twitter")}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Share on LinkedIn"
                  onClick={() => shareTo("linkedin")}
                >
                  <LinkedinIcon className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Share on Facebook"
                  onClick={() => shareTo("facebook")}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Copy article link"
                  onClick={handleCopyLink}
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
 
            {post.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8 shadow-lg">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
 
            <div
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:leading-tight
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:leading-snug
                prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:leading-snug
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-p:md:text-lg
                prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-6 prose-ul:pl-6 prose-ul:list-disc prose-ul:space-y-2
                prose-ol:my-6 prose-ol:pl-6 prose-ol:list-decimal prose-ol:space-y-2
                prose-li:text-foreground/80 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30
                prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:italic 
                prose-blockquote:text-foreground/70 prose-blockquote:rounded-r-lg prose-blockquote:my-8
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
 
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-4">Comments</h2>
              <form onSubmit={handleSubmitComment} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name (optional)</label>
                    <Input
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder="How should we display your name?"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Share your thoughts about this article..."
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={commentMutation.isPending || !commentContent.trim()}
                >
                  {commentMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Post comment
                </Button>
              </form>
 
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border border-border bg-card p-4 space-y-1"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {comment.author_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "MMM d, yyyy 'at' HH:mm")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first to share your thoughts.
                </p>
              )}
            </section>
 
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-12 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold mb-4">Related articles</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedPosts.map((related: any) => (
                    <Link key={related.id} to={`/blog/${related.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            {related.published_at
                              ? format(new Date(related.published_at), "MMM d, yyyy")
                              : ""}
                          </p>
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {related.title}
                          </h3>
                          <div className="flex items-center text-sm text-primary font-medium">
                            Read article
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        </article>
      </main>
 
      <Footer />
    </div>
  );
};
 
export default BlogPost;
