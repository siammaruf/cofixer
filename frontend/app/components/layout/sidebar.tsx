import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, UserCircle, LogOut, Settings,
  Briefcase, FolderGit2, BookOpen, Users2, MessageSquare,
  HelpCircle, Mail, Globe, FileText, ChevronDown, ChevronRight, Image, LogIn
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { logout } from "~/redux/features/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Services", icon: Briefcase, href: "/admin/services" },
      { title: "Projects", icon: FolderGit2, href: "/admin/projects" },
      { title: "Blog Posts", icon: BookOpen, href: "/admin/blog" },
      { title: "Team", icon: Users2, href: "/admin/team" },
      { title: "Testimonials", icon: MessageSquare, href: "/admin/testimonials" },
      { title: "FAQs", icon: HelpCircle, href: "/admin/faqs" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Contacts", icon: Mail, href: "/admin/contacts" },
      { title: "Users", icon: Users, href: "/admin/users" },
      { title: "Media Library", icon: Image, href: "/admin/media" },
      { title: "SEO", icon: Globe, href: "/admin/seo" },
      { title: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    "Content": false,
    "Management": false,
  });

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.fullName || user?.email || "User";

  return (
    <aside className="w-72 bg-sidebar min-h-screen flex flex-col border-r border-sidebar-border/50">
      <div className="p-5 border-b border-sidebar-border/50">
        <Link to="/admin" className="flex items-center gap-3 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="140" height="36" className="shrink-0">
            <defs>
              <linearGradient id="cofixerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#953A26"/>
                <stop offset="100%" stopColor="#213581"/>
              </linearGradient>
            </defs>
            <g transform="translate(5, 5)">
              <g transform="matrix(2.8125,0,0,2.8125,0,0)" stroke="none" fill="url(#cofixerGradient)">
                <path d="M9.382 8.675h13.943v13.943L32 31.293V0H.707zM22.618 23.325H8.675V9.382L0 .707V32h31.293z"/>
              </g>
            </g>
            <text x="105" y="76" style={{ fontFamily: "'Racing Sans One', sans-serif", fontSize: '78px', fontWeight: 400, fill: '#a03028', letterSpacing: '-1px' }}>CoFixer</text>
          </svg>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-3 mb-2 text-[10px] font-bold text-sidebar-muted uppercase tracking-widest hover:text-sidebar-foreground/70 transition-colors"
            >
              <span>{section.title}</span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                collapsedSections[section.title] ? "-rotate-90" : "rotate-0"
              )} />
            </button>
            <div className={cn(
              "space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out",
              collapsedSections[section.title] ? "max-h-0 opacity-0" : "max-h-[600px] opacity-100"
            )}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                      active
                        ? "bg-sidebar-active text-white shadow-lg shadow-primary/20"
                        : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                    <Icon className={cn(
                      "w-4.5 h-4.5 transition-colors",
                      active ? "text-white" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                    )} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50 space-y-2">
        <Link
          to="/admin/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-200 group"
        >
          <Avatar className="w-9 h-9 ring-2 ring-sidebar-border/50 group-hover:ring-primary/50 transition-all">
            <AvatarImage src={user?.image ?? undefined} alt={userName} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</p>
            <p className="text-[11px] text-sidebar-muted truncate">{user?.email || "user@example.com"}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-muted hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
