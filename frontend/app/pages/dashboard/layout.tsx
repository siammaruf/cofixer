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
    <div className="flex min-h-screen bg-[#060606]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-[#FFFFFF0F] bg-[#060606]">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}