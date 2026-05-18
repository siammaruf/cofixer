import { useState } from 'react';
import { getErrorMessage } from "~/utils/errorHandler"
import { useNavigate, Link } from 'react-router';
import { cmsAdminService } from '~/services/httpServices/cmsService';

export default function CreateService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    icon: '',
    order: 0,
    featured: false,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAdminService.createService(formData);
      navigate('/admin/services');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/services" className="text-[#A93E17] hover:underline text-base">← Back</Link>
        <h1 className="dashboard-section-title">Add Service</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-base font-medium mb-1 text-white">Title *</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-base font-medium mb-1 text-white">Slug *</label>
          <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-base font-medium mb-1 text-white">Short Description</label>
          <input type="text" value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-base font-medium mb-1 text-white">Description</label>
          <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-base font-medium mb-1 text-white">Icon</label>
          <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="dashboard-input" placeholder="Emoji or icon class" />
        </div>
        <div>
          <label className="block text-base font-medium mb-1 text-white">Order</label>
          <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="dashboard-input" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="accent-[#A93E17]" />
            <span className="text-base">Featured</span>
          </label>
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="accent-[#A93E17]" />
            <span className="text-base">Active</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="dashboard-btn disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Service'}
          </button>
          <Link to="/admin/services" className="dashboard-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
