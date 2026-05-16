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
        <Link to="/admin/testimonials" className="text-primary hover:underline">← Back</Link>
        <h1 className="text-2xl font-bold">Add Testimonial</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Client Name *</label>
          <input required type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client Role</label>
          <input type="text" value={formData.clientRole} onChange={e => setFormData({...formData, clientRole: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
          <input type="number" min={1} max={5} value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            <span className="text-sm">Active</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Testimonial'}
          </button>
          <Link to="/admin/testimonials" className="border px-6 py-2 rounded-lg hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
