import { useState } from 'react';
import { getErrorMessage } from "~/utils/errorHandler"
import { useNavigate, Link } from 'react-router';
import { cmsAdminService } from '~/services/httpServices/cmsService';

export default function CreateTeamMember() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    order: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAdminService.createTeamMember(formData);
      navigate('/admin/team');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to create team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/team" className="text-[#A93E17] hover:underline">← Back</Link>
        <h1 className="dashboard-section-title">Add Team Member</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Name *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Role *</label>
          <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Bio</label>
          <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Image URL</label>
          <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Order</label>
          <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="dashboard-input" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="accent-[#A93E17]" />
            <span className="text-sm">Active</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="dashboard-btn disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Member'}
          </button>
          <Link to="/admin/team" className="dashboard-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
