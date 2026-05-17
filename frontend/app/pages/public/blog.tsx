import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useBlogPosts } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

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
  const { data: posts } = useBlogPosts({
    initialData: initialPosts,
  })

  // Default blog posts if none from CMS
  const defaultBlogPosts = [
    { id: '1', title: 'Ethical AI Balancing Innovation and Responsibility', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-05-28', slug: 'ethical-ai' },
    { id: '2', title: 'Machine Learning Demytified A Beginner\'s Guide', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-04-22', slug: 'ml-guide' },
    { id: '3', title: 'How AI is Transforming Modern Businesses', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-04-17', slug: 'ai-transforming' },
    { id: '4', title: 'Responsible AI Shaping a Better Future Innovation', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-05-13', slug: 'responsible-ai' },
    { id: '5', title: 'Ethical Intelligence Driving Trust and Progress', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-04-08', slug: 'ethical-intelligence' },
    { id: '6', title: 'AI with Integrity Innovation You Can Trust', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-04-02', slug: 'ai-integrity' },
  ]

  const displayPosts = posts && posts.length > 0 ? posts : defaultBlogPosts

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Our <span>blog</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">blog</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Blog Section Start */}
      <div className="page-blog">
        <div className="container">
          <div className="row">
            {displayPosts.map((post, index) => (
              <div className="col-lg-4 col-md-6" key={post.id}>
                {/* Post Item Start */}
                <div className="post-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  {/* Post Meta Start */}
                  <div className="post-meta">
                    <ul>
                      <li><span><i className="fa-solid fa-calendar-days"></i> {formatDate(post.publishedAt)}</span></li>
                    </ul>
                  </div>
                  {/* Post Meta End */}

                  {/* Post Item Content Start */}
                  <div className="post-item-content">
                    <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
                    <p>{post.excerpt || 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate '}</p>
                  </div>
                  {/* Post Item Content End */}

                  {/* Post Item Readmore Button Start*/}
                  <div className="post-item-btn">
                    <Link to={`/blog/${post.slug}`} className="readmore-btn">read more</Link>
                  </div>
                  {/* Post Item Readmore Button End*/}
                </div>
                {/* Post Item End */}
              </div>
            ))}

            <div className="col-lg-12">
              {/* Page Pagination Start */}
              <div className="page-pagination wow fadeInUp" data-wow-delay="1.2s">
                <ul className="pagination">
                  <li><a href="#"><i className="fa-solid fa-angle-left"></i></a></li>
                  <li className="active"><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#"><i className="fa-solid fa-angle-right"></i></a></li>
                </ul>
              </div>
              {/* Page Pagination End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Blog Section End */}
    </>
  )
}
