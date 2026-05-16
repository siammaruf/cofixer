import { Link, useParams, useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useBlogPost } from '~/services/httpServices/queries'
import type { BlogPost, SeoSettings } from '~/types/cms'

export async function loader({ params }: { params: { slug: string } }) {
  try {
    const [postRes, seoRes] = await Promise.all([
      cmsService.getBlogPost(params.slug),
      cmsService.getSeoSettings(`blog/${params.slug}`),
    ])
    return { post: postRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load blog post', error)
    return { post: null, seo: null }
  }
}

export function meta({ data }: { data: { post?: BlogPost; seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || `${data?.post?.title || 'Blog Post'} | Cofixer` },
    { name: 'description', content: seo?.metaDescription || data?.post?.excerpt || '' },
  ]
}

export default function BlogPostDetailPage() {
  const { slug } = useParams()
  const { post: initialPost } = useLoaderData<typeof loader>()
  const { data: post, isLoading, error } = useBlogPost(slug || '', {
    initialData: initialPost ?? undefined,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading blog post..." />
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Post Not Found"
          description="The blog post you are looking for does not exist."
          action={
            <Link to="/blog" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link
        to="/blog"
        className="text-primary hover:underline mb-4 inline-block"
      >
        ← Back to Blog
      </Link>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        {post.authorName && <span>By {post.authorName}</span>}
        {post.publishedAt && (
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        )}
        {post.category && (
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>
      {post.excerpt && (
        <p className="text-lg text-gray-600 mb-6 italic">{post.excerpt}</p>
      )}
      {post.content && (
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
