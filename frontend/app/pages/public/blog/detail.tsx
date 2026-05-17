import { Link, useParams, useLoaderData } from 'react-router'
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
  const { data: post, error } = useBlogPost(slug || '', {
    initialData: initialPost ?? undefined,
  })

  if (error || !post) {
    return (
      <div className="page-single-post">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <EmptyState
                title="Post Not Found"
                description="The blog post you are looking for does not exist."
                action={
                  <Link to="/blog" className="btn-default">
                    ← Back to Blog
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">{post.title}</h1>
                <div className="post-single-meta wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    {post.authorName && (
                      <li><i className="fa-regular fa-user"></i> {post.authorName}</li>
                    )}
                    {post.publishedAt && (
                      <li><i className="fa-regular fa-clock"></i> {formatDate(post.publishedAt)}</li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Single Post Start */}
      <div className="page-single-post">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Post Featured Image Start */}
              {post.coverImage && (
                <div className="post-image">
                  <figure className="image-anime reveal">
                    <img src={post.coverImage} alt={post.title} />
                  </figure>
                </div>
              )}
              {/* Post Featured Image End */}

              {/* Post Single Content Start */}
              <div className="post-content">
                {/* Post Entry Start */}
                <div className="post-entry">
                  {post.excerpt && (
                    <p className="wow fadeInUp">{post.excerpt}</p>
                  )}
                  {post.content && (
                    <div
                      className="wow fadeInUp"
                      data-wow-delay="0.2s"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  )}
                </div>
                {/* Post Entry End */}

                {/* Post Tag Links Start */}
                {(post.tags && post.tags.length > 0) && (
                  <div className="post-tag-links">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        {/* Post Tags Start */}
                        <div className="post-tags wow fadeInUp" data-wow-delay="0.5s">
                          <span className="tag-links">
                            Tags:
                            {post.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </span>
                        </div>
                        {/* Post Tags End */}
                      </div>

                      <div className="col-lg-4">
                        {/* Post Social Links Start */}
                        <div className="post-social-sharing wow fadeInUp" data-wow-delay="0.5s">
                          <ul>
                            <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                            <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                            <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                            <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
                          </ul>
                        </div>
                        {/* Post Social Links End */}
                      </div>
                    </div>
                  </div>
                )}
                {/* Post Tag Links End */}
              </div>
              {/* Post Single Content End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Single Post End */}
    </>
  )
}
