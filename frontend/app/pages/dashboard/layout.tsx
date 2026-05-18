import { Outlet, Navigate } from "react-router";
import { useAppSelector } from "~/redux/store/hooks";
import Sidebar from "../../components/layout/sidebar";
import { ErrorBoundary } from "~/components/error-boundary";
import { SuspenseLoader } from "~/components/ui/suspense-loader";

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <SuspenseLoader size="fullScreen" message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}