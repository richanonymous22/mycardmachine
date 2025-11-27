import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

const BlogPost = () => {
  const { slug } = useParams();

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
        return [];
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.published_at
                    ? format(new Date(post.published_at), "MMMM d, yyyy")
                    : "Draft"}
                </span>
              </div>

              <span className="text-muted-foreground">•</span>

              <span className="text-muted-foreground">
                By {post.author_name}
              </span>

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
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:my-4 prose-ol:my-4 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-12 border-top border-border pt-8">
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
