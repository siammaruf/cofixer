import { useState } from 'react';
import { getErrorMessage } from "~/utils/errorHandler"
import { useNavigate, Link } from 'react-router';
import { cmsAdminService } from '~/services/httpServices/cmsService';

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    authorName: '',
    tags: '',
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAdminService.createBlogPost({
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      navigate('/admin/blog');
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/blog" className="text-[#A93E17] hover:underline">← Back</Link>
        <h1 className="dashboard-section-title">Add Blog Post</h1>
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
          <label className="block text-sm font-medium mb-1 text-white">Excerpt</label>
          <input type="text" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Content</label>
          <textarea rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Category</label>
          <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Author Name</label>
          <input type="text" value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} className="dashboard-input" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Tags (comma separated)</label>
          <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="dashboard-input" placeholder="ai, technology, business" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="accent-[#A93E17]" />
            <span className="text-sm">Published</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="dashboard-btn disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <Link to="/admin/blog" className="dashboard-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
