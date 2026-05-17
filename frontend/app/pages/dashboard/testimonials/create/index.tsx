import { useState } from 'react';
import { getErrorMessage } from "~/utils/errorHandler"
import { useNavigate, Link } from 'react-router';
import { cmsAdminService } from '~/services/httpServices/cmsService';

export default function CreateTestimonial() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    company: '',
    content: '',
    rating: 5,
    image: '',
    featured: false,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAdminService.createTestimonial(formData);
      navigate('/admin/testimonials');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to create testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/testimonials" className="text-[#A93E17] hover:underline">← Back</Link>
        <h1 className="dashboard-section-title">Add Testimonial</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Client Name *</label>
          <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Client Role</label>
          <input type="text" value={formData.clientRole} onChange={e => setFormData({...formData, clientRole: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Company</label>
          <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Content *</label>
          <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Rating (1-5)</label>
          <input type="number" min={1} max={5} value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Image URL</label>
          <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="dashboard-input" />
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
            {loading ? 'Creating...' : 'Create Testimonial'}
          </button>
          <Link to="/admin/testimonials" className="dashboard-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
