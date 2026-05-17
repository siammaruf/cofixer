import { Outlet } from "react-router";
import Header from "~/components/layout/header";
import Footer from "~/components/layout/footer";

export default function BaseLayout() {
  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: '#060606' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
