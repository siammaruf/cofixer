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

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SEO Settings</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Route</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Page Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Robots</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {seoList.map((seo) => (
              <tr key={seo.id}>
                <td className="px-4 py-3 font-mono text-sm">{seo.route}</td>
                <td className="px-4 py-3">{seo.title || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {seo.pageType}
                </td>
                <td className="px-4 py-3 text-sm">{seo.robotsMeta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
