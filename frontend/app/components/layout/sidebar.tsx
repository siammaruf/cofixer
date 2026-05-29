import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, UserCircle, LogOut, Settings,
  Briefcase, FolderGit2, BookOpen, Users2, MessageSquare,
  HelpCircle, Mail, Globe, FileText, ChevronDown, ChevronRight, Image, FolderOpen
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
      { title: "Categories", icon: FolderOpen, href: "/admin/blog/categories" },
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
      <div className="py-[20px] px-[30px] border-b border-sidebar-border/50">
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
            <path d="M152.11 57.05L148.99 71.79Q147.04 72.72 144.97 73.62Q142.91 74.52 140.57 75.18Q138.23 75.84 135.46 76.23Q132.69 76.62 129.41 76.62Q118.96 76.62 113.31 71.94Q107.65 67.26 107.65 56.34Q107.65 50.03 109.60 44.45Q111.55 38.87 115.37 34.70Q119.20 30.53 124.81 28.11Q130.43 25.69 137.68 25.69Q141.11 25.69 143.96 26.16Q146.81 26.63 149.11 27.37Q151.41 28.11 153.24 28.97Q155.08 29.82 156.56 30.60L153.75 45.11L139.71 45.11Q139.79 44.33 139.91 43.08Q140.02 41.84 140.10 40.55Q140.18 39.26 140.26 38.01Q140.33 36.77 140.33 35.91Q140.33 35.28 140.26 34.47Q140.18 33.65 139.87 32.87Q139.55 32.09 138.89 31.58Q138.23 31.07 137.14 31.07Q135.11 31.07 133.43 32.75Q131.75 34.43 130.43 37.20Q129.10 39.96 128.09 43.47Q127.07 46.98 126.41 50.61Q125.75 54.24 125.40 57.75Q125.05 61.26 125.05 63.91Q125.05 64.69 125.12 65.86Q125.20 67.03 125.59 68.12Q125.98 69.21 126.80 69.99Q127.62 70.77 129.02 70.77Q131.44 70.77 133.70 67.77Q135.97 64.77 137.68 57.05L152.11 57.05M179.41 41.60Q188.69 41.60 192.91 44.88Q197.35 48.31 197.35 56.27Q197.35 61.18 195.71 65.12Q194.08 69.06 191.11 71.63Q185.18 76.62 173.95 76.62Q164.36 76.62 160.22 72.96Q155.78 69.14 155.78 61.49Q155.78 56.42 157.84 52.29Q159.91 48.15 163.81 45.42Q169.51 41.60 179.41 41.60M174.11 71.32Q176.06 71.32 177.50 69.14Q178.94 66.95 179.80 63.79Q180.66 60.63 181.09 57.24Q181.52 53.85 181.52 51.35Q181.52 49.17 181.09 48.04Q180.66 46.91 179.26 46.91Q177.15 46.91 175.63 49.17Q174.11 51.43 173.17 54.55Q172.24 57.67 171.81 60.95Q171.38 64.22 171.38 66.25Q171.38 71.32 174.11 71.32M199.22 76L209.75 26.47L242.59 26.47L241.34 32.40L225.35 32.40L222.31 46.67L235.65 46.67L234.40 52.68L221.06 52.68L216.07 76L199.22 76M259.44 42.46L252.19 76L236.35 76L243.45 42.46L259.44 42.46M261.47 32.24Q261.47 34.04 260.73 35.36Q259.99 36.69 258.78 37.62Q257.57 38.56 256.01 39.03Q254.45 39.50 252.81 39.50Q249.69 39.50 247.58 38.01Q245.48 36.53 245.48 33.33Q245.48 31.62 246.18 30.25Q246.88 28.89 248.09 27.99Q249.30 27.09 250.90 26.63Q252.50 26.16 254.21 26.16Q257.26 26.16 259.36 27.64Q261.47 29.12 261.47 32.24M279.02 42.46L283.70 51.27L291.89 42.46L300.86 42.46L286.74 56.97L296.80 76L280.27 76L274.81 65.70L264.51 76L255.54 76L271.84 60.09L262.56 42.46L279.02 42.46M336.97 60.32L315.05 60.32Q314.74 62.04 314.63 63.60Q314.51 65.16 314.51 66.41Q314.51 67.11 314.59 67.97Q314.66 68.82 314.94 69.56Q315.21 70.31 315.72 70.81Q316.22 71.32 317.16 71.32Q317.86 71.32 318.76 70.85Q319.66 70.38 320.55 69.53Q321.45 68.67 322.27 67.42Q323.09 66.17 323.56 64.61L336.35 64.61L334.32 72.96Q332.76 73.97 330.73 74.67Q328.70 75.38 326.44 75.81Q324.18 76.23 321.84 76.43Q319.50 76.62 317.39 76.62Q313.49 76.62 310.14 75.92Q306.79 75.22 304.29 73.50Q301.79 71.79 300.35 68.94Q298.91 66.09 298.91 61.88Q298.91 58.06 300.12 54.39Q301.33 50.73 304.17 47.88Q307.02 45.03 311.82 43.32Q316.61 41.60 323.79 41.60Q331.59 41.60 335.53 44.02Q339.47 46.44 339.47 51.59Q339.47 53.69 338.84 56.15Q338.22 58.61 336.97 60.32M325.43 51.04Q325.43 48.62 324.65 47.76Q323.87 46.91 322.78 46.91Q321.53 46.91 320.48 47.73Q319.42 48.54 318.56 49.91Q317.71 51.27 317 53.03Q316.30 54.78 315.83 56.73L324.73 56.73Q324.88 55.80 325.04 54.78Q325.19 53.93 325.31 52.91Q325.43 51.90 325.43 51.04M339.94 76L347.03 42.46L359.75 42.46L360.92 48.31L361.46 48.31Q363.26 45.50 366.07 43.55Q368.87 41.60 373.48 41.60Q373.79 41.60 374.45 41.64Q375.11 41.68 375.93 41.88Q376.75 42.07 377.65 42.42Q378.55 42.77 379.40 43.40L375.97 59.46L367.47 59.46Q367.31 54.63 366.61 52.72Q365.91 50.81 364.35 50.81Q363.57 50.81 362.67 51.16Q361.78 51.51 360.84 52.68L355.85 76" fill="#a03028"/>
          </svg>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-3 mb-2 text-[10px] font-bold text-white uppercase tracking-widest hover:text-white transition-colors"
            >
              <span>{section.title}</span>
              <ChevronDown className={cn("text-white",
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
                        : "text-white hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                    )}
                    <Icon className={cn(
                      "w-4.5 h-4.5 transition-colors",
                      active ? "text-white" : "text-white group-hover:text-white"
                    )} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50 space-y-1">
        <Link
          to="/admin/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          <Avatar className="w-9 h-9 ring-2 ring-sidebar-border/50 group-hover:ring-primary/50 transition-all">
            <AvatarImage src={user?.image ?? undefined} alt={userName} />
            <AvatarFallback className="bg-primary/30 text-white text-xs font-bold">
              {getInitials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-sm font-semibold text-white truncate mb-0">{userName}</p>
            <p className="text-[11px] text-white truncate mb-0">{user?.email || "user@example.com"}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
