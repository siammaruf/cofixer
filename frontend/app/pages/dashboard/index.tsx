import { useEffect } from 'react';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks';
import { fetchStats } from '~/redux/features/cmsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Briefcase, FolderGit2, BookOpen, Users2, MessageSquare,
  Mail, TrendingUp, ArrowRight, Plus, Sparkles
} from 'lucide-react';
import { cn } from '~/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Services: Briefcase,
  Projects: FolderGit2,
  'Blog Posts': BookOpen,
  'Team Members': Users2,
  Testimonials: MessageSquare,
  Contacts: Mail,
};

const colorMap: Record<string, { bg: string; icon: string; gradient: string }> = {
  Services: { bg: 'bg-orange-500/10', icon: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
  Projects: { bg: 'bg-blue-500/10', icon: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  'Blog Posts': { bg: 'bg-purple-500/10', icon: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  'Team Members': { bg: 'bg-emerald-500/10', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
  Testimonials: { bg: 'bg-pink-500/10', icon: 'text-pink-600', gradient: 'from-pink-500 to-pink-600' },
  Contacts: { bg: 'bg-cyan-500/10', icon: 'text-cyan-600', gradient: 'from-cyan-500 to-cyan-600' },
};

const quickActions = [
  { label: 'Add Service', href: '/admin/services/create', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-500/10 hover:bg-orange-500/15' },
  { label: 'Add Project', href: '/admin/projects/create', icon: FolderGit2, color: 'text-blue-600', bg: 'bg-blue-500/10 hover:bg-blue-500/15' },
  { label: 'Write Post', href: '/admin/blog/create', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-500/10 hover:bg-purple-500/15' },
  { label: 'View Contacts', href: '/admin/contacts', icon: Mail, color: 'text-cyan-600', bg: 'bg-cyan-500/10 hover:bg-cyan-500/15' },
];

export default function DashboardOverview() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.cms);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2 font-medium">Failed to load stats</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Services', value: stats.services, change: '+12%' },
        { label: 'Projects', value: stats.projects, change: '+8%' },
        { label: 'Blog Posts', value: stats.blogPosts, change: '+24%' },
        { label: 'Team Members', value: stats.teamMembers, change: '+4%' },
        { label: 'Testimonials', value: stats.testimonials, change: '+16%' },
        { label: 'Contacts', value: stats.contacts, change: '+32%' },
      ]
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight !mb-0">Dashboard</h1>
          <p className="text-black/70 mt-0.5 text-sm !mb-0">Welcome back! Here's what's happening with your CMS.</p>
        </div>
        <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = iconMap[card.label] || Mail;
          const colors = colorMap[card.label] || { bg: 'bg-gray-500/10', icon: 'text-gray-600', gradient: 'from-gray-500 to-gray-600' };
          return (
            <Card key={card.label} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {card.label}
                </CardTitle>
                <div className={cn("p-2.5 rounded-xl", colors.bg, "group-hover:scale-110 transition-transform duration-300")}>
                  <Icon className={cn("w-5 h-5", colors.icon)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground tracking-tight">{card.value}</div>
                <div className="flex items-center mt-3 text-xs text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">{card.change}</span>
                  <span className="ml-1.5">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest updates from your CMS</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Start adding content to see activity here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Frequently used actions</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.href}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border border-border/30 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group",
                      action.bg
                    )}
                  >
                    <div className={cn("p-2 rounded-lg bg-card shadow-sm", action.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground flex-1">{action.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
