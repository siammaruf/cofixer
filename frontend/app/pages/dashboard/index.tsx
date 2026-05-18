import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { fetchStats } from '~/redux/features/cmsSlice'

export default function DashboardOverview() {
  const dispatch = useAppDispatch()
  const { stats, loading, error } = useAppSelector((state) => state.cms)

  useEffect(() => {
    dispatch(fetchStats())
  }, [dispatch])

  if (loading) {
    return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading stats...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>
  }

  const statCards = stats
    ? [
        {
          label: 'Services',
          value: stats.services,
          icon: 'icon-about-item-1.svg',
        },
        {
          label: 'Projects',
          value: stats.projects,
          icon: 'icon-about-item-2.svg',
        },
        {
          label: 'Blog Posts',
          value: stats.blogPosts,
          icon: 'icon-about-item-3.svg',
        },
        {
          label: 'Team Members',
          value: stats.teamMembers,
          icon: 'icon-about-item-4.svg',
        },
        {
          label: 'Testimonials',
          value: stats.testimonials,
          icon: 'icon-sparkle.svg',
        },
        {
          label: 'Contacts',
          value: stats.contacts,
          icon: 'icon-mail.svg',
        },
      ]
    : []

  return (
    <div>
      <h1 className="dashboard-section-title mb-6">Dashboard <span>Overview</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="dashboard-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="dashboard-heading">{card.value}</div>
                <div className="dashboard-text-sm mt-1">{card.label}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#060606] border border-[#FFFFFF0F] flex items-center justify-center">
                <img src={`/images/${card.icon}`} alt="" className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
