import { useEffect, useState, type ChangeEvent } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  featured_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  author_name: z.string().min(1, "Author name is required"),
  status: z.enum(["draft", "published", "archived"]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const BlogEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploadingFeaturedImage, setIsUploadingFeaturedImage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image_url: "",
      author_name: "Admin",
      status: "draft",
      meta_title: "",
      meta_description: "",
      tags: "",
    },
  });

  const { data: existingPost, isLoading } = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      form.reset({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt,
        content: existingPost.content,
        featured_image_url: existingPost.featured_image_url || "",
        author_name: existingPost.author_name,
        status: (existingPost.status as "draft" | "published" | "archived"),
        meta_title: existingPost.meta_title || "",
        meta_description: existingPost.meta_description || "",
        tags: existingPost.tags?.join(", ") || "",
      });
    }
  }, [existingPost, form]);

  const handleFeaturedImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingFeaturedImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `featured-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file);

      if (error || !data) {
        throw error || new Error("Failed to upload image");
      }

      const { data: publicData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(data.path);

      const publicUrl = publicData.publicUrl;

      form.setValue("featured_image_url", publicUrl || "", { shouldValidate: true });

      toast({
        title: "Featured image uploaded",
        description: "The image has been attached to this post.",
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({
        title: "Image upload failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingFeaturedImage(false);
      event.target.value = "";
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const tagsArray = data.tags
        ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image_url: data.featured_image_url || null,
        author_name: data.author_name,
        status: data.status,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        tags: tagsArray,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      };

      if (existingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", existingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(postData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({
        title: "Success",
        description: `Blog post ${existingPost ? "updated" : "created"} successfully`,
      });
      navigate("/admin/blog");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", slug);
  };

  const featuredImageUrl = form.watch("featured_image_url");

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <RouterLink to="/admin/blog">
                <ArrowLeft className="w-4 h-4" />
              </RouterLink>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {existingPost ? "Edit Blog Post" : "New Blog Post"}
              </h1>
              <p className="text-muted-foreground">
                Write and format your article with full control over headings, images, and SEO.
              </p>
            </div>
          </div>
          {existingPost && (
            <span className="text-sm text-muted-foreground">
              Last updated {new Date(existingPost.updated_at).toLocaleString()}
            </span>
          )}
        </div>

        {isEditing && isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold">Basics</h2>
                  <p className="text-sm text-muted-foreground">
                    Title, URL slug, and short summary that will appear in listings and SEO.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter post title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input {...field} placeholder="post-url-slug" />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={generateSlug}>
                            Generate
                          </Button>
                        </div>
                        <FormDescription>URL-friendly version of the title</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief summary of the post"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold">Content</h2>
                  <p className="text-sm text-muted-foreground">
                    Use the toolbar to add headings (H1H3), lists, quotes, links, and inline images.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article body</FormLabel>
                      <FormControl>
                        <RichTextEditor content={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>
                        This is the main content of your article. Inline images belong here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="tag1, tag2, tag3" />
                        </FormControl>
                        <FormDescription>Comma-separated tags</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold">Cover image & SEO</h2>
                  <p className="text-sm text-muted-foreground">
                    The cover image appears at the top of the article. Inline images should be added
                    within the editor above.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featured_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover image</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              {...field}
                              placeholder="https://example.com/cover-image.jpg"
                            />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFeaturedImageUpload}
                              disabled={isUploadingFeaturedImage}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Paste an image URL or upload a file for the blog hero image only.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Admin" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta title (SEO)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SEO title (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta description (SEO)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SEO description (optional)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {featuredImageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Cover image preview</p>
                    <div className="aspect-video max-w-xl overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src={featuredImageUrl}
                        alt="Blog cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </section>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/blog")}
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {existingPost ? "Save changes" : "Publish"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;
