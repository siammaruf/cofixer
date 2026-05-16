import { Link } from "react-router";
import { useAppSelector } from "~/redux/store/hooks";
import { appConfig } from "~/config/app.config";

export default function Header() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link to="/" className="text-xl font-bold">
          {appConfig.name}
        </Link>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/services" className="hover:text-primary">Services</Link>
          <Link to="/projects" className="hover:text-primary">Projects</Link>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <Link to="/team" className="hover:text-primary">Team</Link>
          <Link to="/testimonials" className="hover:text-primary">Testimonials</Link>
          <Link to="/faqs" className="hover:text-primary">FAQs</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="hover:text-primary font-medium">Dashboard</Link>
              <Link to="/login" className="hover:text-primary">Logout</Link>
            </>
          ) : (
            <Link to="/login" className="hover:text-primary">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
