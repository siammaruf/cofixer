import { useState } from 'react';
import { getErrorMessage } from "~/utils/errorHandler"
import { useNavigate, Link } from 'react-router';
import { cmsAdminService } from '~/services/httpServices/cmsService';

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    description: '',
    clientName: '',
    category: '',
    featured: false,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAdminService.createProject(formData);
      navigate('/admin/projects');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/projects" className="text-[#A93E17] hover:underline">← Back</Link>
        <h1 className="dashboard-section-title">Add Project</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Title *</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Slug *</label>
          <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Summary</label>
          <input type="text" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Description</label>
          <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Client Name</label>
          <input type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Category</label>
          <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="dashboard-input" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="accent-[#A93E17]" />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="accent-[#A93E17]" />
            <span className="text-sm">Active</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="dashboard-btn disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          <Link to="/admin/projects" className="dashboard-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
