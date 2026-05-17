import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { fetchSeoSettings } from '~/redux/features/cmsSlice'

export default function SeoDashboard() {
  const dispatch = useAppDispatch()
  const { seoSettings: seoList, loading, error } = useAppSelector(
    (state) => state.cms
  )

  useEffect(() => {
    dispatch(fetchSeoSettings())
  }, [dispatch])

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <h1 className="dashboard-section-title mb-6">SEO Settings</h1>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Route</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Page Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Robots</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {seoList.map((seo) => (
              <tr key={seo.id} className="hover:bg-[#FFFFFF08] transition-colors">
                <td className="px-4 py-3 font-mono text-sm text-[#A7AABB]">{seo.route}</td>
                <td className="px-4 py-3 text-white">{seo.title || '-'}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {seo.pageType}
                </td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">{seo.robotsMeta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
