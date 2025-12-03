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
  Heart,
  MessageCircle,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";

const calculateReadingTime = (html: string) => {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// Generate a simple fingerprint for anonymous likes
const getFingerprint = () => {
  let fp = localStorage.getItem("blog_fingerprint");
  if (!fp) {
    fp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("blog_fingerprint", fp);
  }
  return fp;
};

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const fingerprint = getFingerprint();

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

  const { data: postLikes } = useQuery({
    queryKey: ["blog-likes", post?.id],
    queryFn: async () => {
      if (!post?.id) return { count: 0, hasLiked: false };

      const { data, error } = await supabase
        .from("blog_likes")
        .select("*")
        .eq("post_id", post.id);

      if (error) throw error;
      return {
        count: data?.length || 0,
        hasLiked: data?.some((l: any) => l.user_fingerprint === fingerprint) || false,
      };
    },
    enabled: !!post?.id,
  });

  const { data: commentLikesData } = useQuery({
    queryKey: ["comment-likes", post?.id],
    queryFn: async () => {
      if (!post?.id || !comments) return {};

      const commentIds = comments.map((c: any) => c.id);
      if (commentIds.length === 0) return {};

      const { data, error } = await supabase
        .from("comment_likes")
        .select("*")
        .in("comment_id", commentIds);

      if (error) throw error;

      const likesMap: Record<string, { count: number; hasLiked: boolean }> = {};
      commentIds.forEach((id: string) => {
        const likes = data?.filter((l: any) => l.comment_id === id) || [];
        likesMap[id] = {
          count: likes.length,
          hasLiked: likes.some((l: any) => l.user_fingerprint === fingerprint),
        };
      });
      return likesMap;
    },
    enabled: !!post?.id && !!comments && comments.length > 0,
  });

  const likePostMutation = useMutation({
    mutationFn: async () => {
      if (!post?.id) throw new Error("Post not loaded");

      if (postLikes?.hasLiked) {
        const { error } = await supabase
          .from("blog_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_fingerprint", fingerprint);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_likes").insert({
          post_id: post.id,
          user_fingerprint: fingerprint,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-likes", post?.id] });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const hasLiked = commentLikesData?.[commentId]?.hasLiked;

      if (hasLiked) {
        const { error } = await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_fingerprint", fingerprint);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("comment_likes").insert({
          comment_id: commentId,
          user_fingerprint: fingerprint,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment-likes", post?.id] });
    },
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
        parent_id: null,
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

  const replyMutation = useMutation({
    mutationFn: async (parentId: string) => {
      if (!post?.id) throw new Error("Post not loaded");

      const trimmedContent = replyContent.trim();
      if (!trimmedContent) throw new Error("Reply cannot be empty");

      const { error } = await supabase.from("blog_comments").insert({
        post_id: post.id,
        author_name: replyAuthor || "Anonymous",
        content: trimmedContent,
        parent_id: parentId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setReplyContent("");
      setReplyAuthor("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["blog-comments", post?.id] });
      toast({
        title: "Reply added",
        description: "Your reply has been posted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reply failed",
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

  const handleSubmitReply = (event: FormEvent, parentId: string) => {
    event.preventDefault();
    if (!replyContent.trim() || replyMutation.isPending) return;
    replyMutation.mutate(parentId);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
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

  // Separate top-level comments and replies
  const topLevelComments = comments?.filter((c: any) => !c.parent_id) || [];
  const getReplies = (parentId: string) =>
    comments?.filter((c: any) => c.parent_id === parentId) || [];

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

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-6">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.published_at
                    ? format(new Date(post.published_at), "MMMM d, yyyy")
                    : "Draft"}
                </span>
              </div>

              <span className="hidden sm:inline text-muted-foreground">•</span>

              <span>By {post.author_name}</span>

              {readingTime && (
                <>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <span>{readingTime} min read</span>
                </>
              )}
            </div>

            {/* Like and Share Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant={postLikes?.hasLiked ? "default" : "outline"}
                  size="sm"
                  onClick={() => likePostMutation.mutate()}
                  disabled={likePostMutation.isPending}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${postLikes?.hasLiked ? "fill-current" : ""}`} />
                  <span>{postLikes?.count || 0}</span>
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments?.length || 0} comments</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Share</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:hidden"
                  onClick={handleNativeShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Share on Twitter"
                  onClick={() => shareTo("twitter")}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Share on LinkedIn"
                  onClick={() => shareTo("linkedin")}
                >
                  <LinkedinIcon className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Share on Facebook"
                  onClick={() => shareTo("facebook")}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
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
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags at the end of article */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <span className="text-sm text-muted-foreground mr-3">Tags:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Comments ({comments?.length || 0})
              </h2>
              
              <form onSubmit={handleSubmitComment} className="space-y-4 mb-8 bg-card/50 p-4 sm:p-6 rounded-xl border border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name (optional)</label>
                    <Input
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder="Your name"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your comment</label>
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Share your thoughts about this article..."
                    rows={4}
                    className="bg-background"
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

              {topLevelComments.length > 0 ? (
                <div className="space-y-6">
                  {topLevelComments.map((comment: any) => {
                    const replies = getReplies(comment.id);
                    const likeData = commentLikesData?.[comment.id];
                    const isExpanded = expandedReplies.has(comment.id);

                    return (
                      <div key={comment.id} className="bg-card/30 rounded-xl p-4 sm:p-5 border border-border/50">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-sm sm:text-base border border-primary/20">
                              {(comment.author_name || "A").charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">
                                {comment.author_name || "Anonymous"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.created_at), "MMM d, yyyy")}
                              </span>
                            </div>
                            <p className="text-foreground/90 leading-relaxed mb-3 text-sm sm:text-base">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs gap-1.5"
                                onClick={() => likeCommentMutation.mutate(comment.id)}
                              >
                                <Heart className={`w-3.5 h-3.5 ${likeData?.hasLiked ? "fill-primary text-primary" : ""}`} />
                                {likeData?.count || 0}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs gap-1.5"
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              >
                                <Reply className="w-3.5 h-3.5" />
                                Reply
                              </Button>
                              {replies.length > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs gap-1.5"
                                  onClick={() => toggleReplies(comment.id)}
                                >
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                                </Button>
                              )}
                            </div>

                            {/* Reply form */}
                            {replyingTo === comment.id && (
                              <form
                                onSubmit={(e) => handleSubmitReply(e, comment.id)}
                                className="mt-4 p-3 sm:p-4 bg-background/50 rounded-lg border border-border/50 space-y-3"
                              >
                                <Input
                                  value={replyAuthor}
                                  onChange={(e) => setReplyAuthor(e.target.value)}
                                  placeholder="Your name (optional)"
                                  className="bg-background text-sm"
                                />
                                <Textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Write your reply..."
                                  rows={2}
                                  className="bg-background text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button type="submit" size="sm" disabled={replyMutation.isPending || !replyContent.trim()}>
                                    {replyMutation.isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                    Reply
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            )}

                            {/* Replies */}
                            {isExpanded && replies.length > 0 && (
                              <div className="mt-4 space-y-3 pl-2 sm:pl-4 border-l-2 border-primary/20">
                                {replies.map((reply: any) => {
                                  const replyLikeData = commentLikesData?.[reply.id];
                                  return (
                                    <div key={reply.id} className="bg-background/30 rounded-lg p-3 sm:p-4">
                                      <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                                          {(reply.author_name || "A").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">
                                              {reply.author_name || "Anonymous"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              {format(new Date(reply.created_at), "MMM d")}
                                            </span>
                                          </div>
                                          <p className="text-sm text-foreground/85">{reply.content}</p>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-1.5 text-xs gap-1 mt-2"
                                            onClick={() => likeCommentMutation.mutate(reply.id)}
                                          >
                                            <Heart className={`w-3 h-3 ${replyLikeData?.hasLiked ? "fill-primary text-primary" : ""}`} />
                                            {replyLikeData?.count || 0}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-card/30 rounded-xl border border-border/50">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </section>

            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-12 border-t border-border pt-8">
                <h2 className="text-2xl font-semibold mb-6">Related articles</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {relatedPosts.map((related: any) => (
                    <Link key={related.id} to={`/blog/${related.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all hover:border-primary/30 group">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            {related.published_at
                              ? format(new Date(related.published_at), "MMM d, yyyy")
                              : ""}
                          </p>
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                          <div className="flex items-center text-sm text-primary font-medium">
                            Read article
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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