import { useState } from 'react';
import { getErrorMessage } from "~/utils/errorHandler"
import { useNavigate, Link } from 'react-router';
import { cmsAdminService } from '~/services/httpServices/cmsService';

export default function CreateFaq() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAdminService.createFaq(formData);
      navigate('/admin/faqs');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/faqs" className="text-[#A93E17] hover:underline">← Back</Link>
        <h1 className="dashboard-section-title">Add FAQ</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Question *</label>
          <input required type="text" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Answer *</label>
          <textarea required rows={4} value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Category</label>
          <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="dashboard-input" />
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
            {loading ? 'Creating...' : 'Create FAQ'}
          </button>
          <Link to="/admin/faqs" className="dashboard-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
