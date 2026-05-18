import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks';
import { fetchStats } from '~/redux/features/cmsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  Briefcase, FolderGit2, BookOpen, Users2, MessageSquare,
  Mail, TrendingUp, Eye
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

const colorMap: Record<string, string> = {
  Services: 'bg-orange-500/10 text-orange-500',
  Projects: 'bg-blue-500/10 text-blue-500',
  'Blog Posts': 'bg-purple-500/10 text-purple-500',
  'Team Members': 'bg-green-500/10 text-green-500',
  Testimonials: 'bg-pink-500/10 text-pink-500',
  Contacts: 'bg-cyan-500/10 text-cyan-500',
};

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
          <div className="relative mx-auto mb-4" style={{ width: 48, height: 48 }}>
            <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin border-t-primary border-b-secondary" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load stats</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Services', value: stats.services, change: '+12%', icon: 'icon-about-item-1.svg' },
        { label: 'Projects', value: stats.projects, change: '+8%', icon: 'icon-about-item-2.svg' },
        { label: 'Blog Posts', value: stats.blogPosts, change: '+24%', icon: 'icon-about-item-3.svg' },
        { label: 'Team Members', value: stats.teamMembers, change: '+4%', icon: 'icon-about-item-4.svg' },
        { label: 'Testimonials', value: stats.testimonials, change: '+16%', icon: 'icon-sparkle.svg' },
        { label: 'Contacts', value: stats.contacts, change: '+32%', icon: 'icon-mail.svg' },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your CMS.</p>
        </div>
        <Badge variant="success" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = iconMap[card.label] || Eye;
          const colors = colorMap[card.label] || 'bg-gray-500/10 text-gray-500';
          return (
            <Card key={card.label} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", colors)}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{card.value}</div>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">{card.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">No recent activity to display.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <a href="/admin/services/create" className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-center">
                <Briefcase className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="text-sm text-white font-medium">Add Service</span>
              </a>
              <a href="/admin/projects/create" className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-center">
                <FolderGit2 className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                <span className="text-sm text-white font-medium">Add Project</span>
              </a>
              <a href="/admin/blog/create" className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-center">
                <BookOpen className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                <span className="text-sm text-white font-medium">Write Post</span>
              </a>
              <a href="/admin/contacts" className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-center">
                <Mail className="w-5 h-5 mx-auto mb-2 text-cyan-500" />
                <span className="text-sm text-white font-medium">View Contacts</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
