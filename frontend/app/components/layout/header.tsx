import { Link, useLocation } from "react-router";
import { useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Initialize slicknav mobile menu after React has rendered the header
    if (typeof window === 'undefined' || !(window as any).$) return;

    const $ = (window as any).$;

    // Only re-initialize if slicknav content was wiped out by React re-render
    if ($('.responsive-menu').children('.slicknav_menu').length > 0) return;

    // Clean up stale content before re-initializing
    $('.responsive-menu').empty();
    $('.navbar-toggle').empty();

    $('#menu').slicknav({
      label: '',
      prependTo: '.responsive-menu'
    });
  });

  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            {/* Logo Start */}
            <Link className="navbar-brand" to="/">
              <img src="/images/logo.svg" alt="Logo" />
            </Link>
            {/* Logo End */}

            {/* Main Menu Start */}
            <div className="collapse navbar-collapse main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav mr-auto" id="menu">
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} to="/about">About Us</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/products') ? 'active' : ''}`} to="/products">Products</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/services') ? 'active' : ''}`} to="/services">Services</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>

              {/* Header Btn Start */}
              <div className="header-btn">
                <Link to="/contact" className="btn-default">Get Started</Link>
              </div>
              {/* Header Btn End */}
            </div>
            {/* Main Menu End */}
            <div className="navbar-toggle"></div>
          </div>
        </nav>
        <div className="responsive-menu"></div>
      </div>
    </header>
  );
}
