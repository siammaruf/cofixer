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
    return <div className="text-center py-8">Loading stats...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  const statCards = stats
    ? [
        {
          label: 'Services',
          value: stats.services,
          color: 'bg-blue-50 text-blue-700',
        },
        {
          label: 'Projects',
          value: stats.projects,
          color: 'bg-green-50 text-green-700',
        },
        {
          label: 'Blog Posts',
          value: stats.blogPosts,
          color: 'bg-purple-50 text-purple-700',
        },
        {
          label: 'Team Members',
          value: stats.teamMembers,
          color: 'bg-orange-50 text-orange-700',
        },
        {
          label: 'Testimonials',
          value: stats.testimonials,
          color: 'bg-pink-50 text-pink-700',
        },
        {
          label: 'Contacts',
          value: stats.contacts,
          color: 'bg-gray-50 text-gray-700',
        },
      ]
    : []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-6 ${card.color}`}>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm opacity-80">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
