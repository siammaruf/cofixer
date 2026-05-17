import { Outlet } from "react-router";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";
import { ErrorBoundary } from "~/components/error-boundary";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#060606' }}>
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
