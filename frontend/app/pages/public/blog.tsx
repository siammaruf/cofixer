import { Link, useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useBlogPosts } from '~/services/httpServices/queries'
import type { BlogPost, SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [postsRes, seoRes] = await Promise.all([
      cmsService.getBlogPosts(),
      cmsService.getSeoSettings('blog'),
    ])
    return { posts: postsRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load blog posts', error)
    return { posts: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Blog | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Read our latest insights on AI and technology' },
  ]
}

export default function BlogPage() {
  const { posts: initialPosts } = useLoaderData<typeof loader>()
  const { data: posts, isLoading, error } = useBlogPosts({
    initialData: initialPosts,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading blog posts..." />
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load blog posts. Please try again later."
        />
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="No Blog Posts"
          description="No blog posts available at the moment."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: BlogPost) => (
          <article
            key={post.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.excerpt}
              </p>
              {post.authorName && (
                <p className="text-sm text-gray-500 mt-2">
                  By {post.authorName}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
