import { Outlet, Navigate } from "react-router";
import { useAppSelector } from "~/redux/store/hooks";
import Sidebar from "../../components/layout/sidebar";
import { ErrorBoundary } from "~/components/error-boundary";
import { SuspenseLoader } from "~/components/ui/suspense-loader";
import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Toaster } from "sonner";

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return <SuspenseLoader size="fullScreen" message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/50 px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </Button>
              <div className="relative max-w-md flex-1 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-[34px] pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 animate-fade-in">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </div>
  );
}
