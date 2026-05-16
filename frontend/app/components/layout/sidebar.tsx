import { Link } from "react-router";
import {
  LayoutDashboard, Users, UserCircle, LogOut, Settings,
  Briefcase, FolderGit2, BookOpen, Users2, MessageSquare,
  HelpCircle, Mail, Globe, FileText
} from "lucide-react";
import { appConfig } from "~/config/app.config";

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-black">{appConfig.name}</h2>
        <nav className="space-y-4">
          <div>
            <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-accent">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</h3>
            <div className="space-y-1">
              <Link to="/admin/services" className="flex items-center p-2 rounded-md hover:bg-accent">
                <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Services</span>
              </Link>
              <Link to="/admin/projects" className="flex items-center p-2 rounded-md hover:bg-accent">
                <FolderGit2 className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Projects</span>
              </Link>
              <Link to="/admin/blog" className="flex items-center p-2 rounded-md hover:bg-accent">
                <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Blog</span>
              </Link>
              <Link to="/admin/team" className="flex items-center p-2 rounded-md hover:bg-accent">
                <Users2 className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Team</span>
              </Link>
              <Link to="/admin/testimonials" className="flex items-center p-2 rounded-md hover:bg-accent">
                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Testimonials</span>
              </Link>
              <Link to="/admin/faqs" className="flex items-center p-2 rounded-md hover:bg-accent">
                <HelpCircle className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">FAQs</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</h3>
            <div className="space-y-1">
              <Link to="/admin/contacts" className="flex items-center p-2 rounded-md hover:bg-accent">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Contacts</span>
              </Link>
              <Link to="/admin/users" className="flex items-center p-2 rounded-md hover:bg-accent">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Users</span>
              </Link>
              <Link to="/admin/seo" className="flex items-center p-2 rounded-md hover:bg-accent">
                <Globe className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">SEO</span>
              </Link>
              <Link to="/admin/media" className="flex items-center p-2 rounded-md hover:bg-accent">
                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Media</span>
              </Link>
              <Link to="/admin/settings" className="flex items-center p-2 rounded-md hover:bg-accent">
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Settings</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</h3>
            <div className="space-y-1">
              <Link to="/admin/profile" className="flex items-center p-2 rounded-md hover:bg-accent">
                <UserCircle className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Profile</span>
              </Link>
              <Link to="/login" className="flex items-center p-2 rounded-md hover:bg-accent">
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm">Logout</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
