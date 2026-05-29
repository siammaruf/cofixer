import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import {
  createBlogPost,
  fetchBlogCategories,
  createBlogCategory,
  clearError,
} from "~/redux/features/cmsSlice";
import BlogForm, { type BlogFormValues } from "~/components/blog/BlogForm";

export default function CreateBlogPost() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, categories } = useAppSelector((state) => state.cms);

  useEffect(() => {
    dispatch(clearError());
    if (categories.length === 0) {
      dispatch(fetchBlogCategories());
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, categories.length]);

  const handleSubmit = async (values: BlogFormValues) => {
    const result = await dispatch(
      createBlogPost({
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
        ogImage: values.ogImage || undefined,
      })
    );

    if (createBlogPost.fulfilled.match(result)) {
      navigate("/admin/blog");
    }
  };

  const handleSaveDraft = async (values: BlogFormValues) => {
    const result = await dispatch(
      createBlogPost({
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
        ogImage: values.ogImage || undefined,
      })
    );

    if (createBlogPost.fulfilled.match(result)) {
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

  return (
    <BlogForm
      mode="create"
      categories={categories}
      onSubmit={handleSubmit}
      onSaveDraft={handleSaveDraft}
      onCreateCategory={handleCreateCategory}
      isSubmitting={loading}
      error={error}
    />
  );
}
