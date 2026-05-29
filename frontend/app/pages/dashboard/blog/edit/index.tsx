import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  updateBlogPost,
  fetchBlogPosts,
  fetchBlogCategories,
  createBlogCategory,
  clearError,
} from "~/redux/features/cmsSlice";
import { fetchUsers } from "~/redux/features/userSlice";
import { cmsAdminService } from "~/services";
import BlogForm, { type BlogFormValues } from "~/components/blog/BlogForm";
import type { BlogPost } from "~/types/cms";

export default function EditBlogPost() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { blogPosts, categories, loading, error } = useAppSelector((state) => state.cms);
  const { users } = useAppSelector((state) => state.user);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    if (categories.length === 0) {
      dispatch(fetchBlogCategories());
    }
    dispatch(fetchUsers());
  }, [dispatch, categories.length]);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      setFetchLoading(true);
      try {
        const existing = blogPosts.find((p) => p.id === id);
        if (existing) {
          setPost(existing);
        } else {
          const res = await cmsAdminService.getBlogPostById(id);
          if (res.data) {
            setPost(res.data);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        setNotFound(true);
      } finally {
        setFetchLoading(false);
      }
    }
    loadPost();
  }, [id, blogPosts]);

  const handleSubmit = async (values: BlogFormValues) => {
    if (!id) return;
    const result = await dispatch(
      updateBlogPost({
        id,
        data: {
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt || undefined,
          coverImage: values.coverImage || undefined,
          categoryIds: values.categoryIds,
          tags: values.tags,
          authorName: values.authorName || undefined,
          isPublished: values.isPublished,
          publishedAt: values.publishedAt || undefined,
          metaTitle: values.metaTitle || undefined,
          metaDescription: values.metaDescription || undefined,
          canonicalUrl: values.canonicalUrl || undefined,
          ogImage: values.ogImage || undefined,
        },
      })
    );

    if (updateBlogPost.fulfilled.match(result)) {
      navigate("/admin/blog");
    }
  };

  const handleSaveDraft = async (values: BlogFormValues) => {
    if (!id) return;
    const result = await dispatch(
      updateBlogPost({
        id,
        data: {
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt || undefined,
          coverImage: values.coverImage || undefined,
          categoryIds: values.categoryIds,
          tags: values.tags,
          authorName: values.authorName || undefined,
          isPublished: false,
          publishedAt: values.publishedAt || undefined,
          metaTitle: values.metaTitle || undefined,
          metaDescription: values.metaDescription || undefined,
          canonicalUrl: values.canonicalUrl || undefined,
          ogImage: values.ogImage || undefined,
        },
      })
    );

    if (updateBlogPost.fulfilled.match(result)) {
      navigate("/admin/blog");
    }
  };

  const handleCreateCategory = async (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    await dispatch(
      createBlogCategory({
        name,
        slug,
      })
    );
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="space-y-5">
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-black mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">The blog post you are looking for does not exist.</p>
          <button
            onClick={() => navigate("/admin/blog")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition-all rounded-full bg-primary text-white hover:bg-primary/90"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <BlogForm
      mode="edit"
      initialData={post}
      categories={categories}
      users={users}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      onCreateCategory={handleCreateCategory}
      isSubmitting={loading}
      error={error}
    />
  );
}
