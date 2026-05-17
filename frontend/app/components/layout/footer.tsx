import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            {/* Section Title Start */}
            <div className="section-title">
              <h2 className="wow fadeInUp" data-cursor="-opaque">Let's start work <span>together!</span></h2>
              <p className="wow fadeInUp" data-wow-delay="0.2s">Partner with us to create intelligent, impactful, and future-ready AI solutions together.</p>
            </div>
            {/* Section Title End */}
          </div>

          <div className="col-lg-5">
            {/* Section Button Start */}
            <div className="section-btn wow fadeInUp" data-wow-delay="0.4s">
              <Link to="/contact" className="btn-default">Let's Work Together</Link>
            </div>
            {/* Section Button End */}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-4">
            {/* About Footer Start */}
            <div className="about-footer">
              {/* Footer Logo Start */}
              <div className="footer-logo">
                <img src="/images/footer-logo.svg" alt="" />
              </div>
              {/* Footer Logo End */}
            </div>
            {/* About Footer End */}
          </div>

          <div className="col-lg-5 col-md-8">
            <div className="footer-contact-box">
              {/* Footer Links Start */}
              <div className="footer-links">
                <h3>Get In Touch</h3>
                <p><a href="tel:152885253">+(00) - 152 885 253</a></p>
                <p><a href="mailto:info@domainname.com">info@domainname.com</a></p>
              </div>
              {/* Footer Links End */}

              {/* Footer Links Start */}
              <div className="footer-links">
                <h3>Our Location</h3>
                <p>123 Lorem Street Suite 5B, Ips Park London, UK SW1A 1AA</p>
              </div>
              {/* Footer Links End */}
            </div>
          </div>

          <div className="col-lg-4">
            {/* Footer Links Start */}
            <div className="footer-links footer-privacy-policy">
              <h3>Subscribe Newsletter's</h3>
              {/* Footer Newsletter Form Start */}
              <div className="footer-newsletter-form">
                <form id="newslettersForm" action="#" method="POST">
                  <div className="form-group">
                    <input type="email" name="mail" className="form-control" id="mail" placeholder="Enter your email" required />
                    <button type="submit" className="newsletter-btn">subscribe<i className="fa-regular fa-paper-plane"></i></button>
                  </div>
                </form>
              </div>
              {/* Footer Newsletter Form End */}
            </div>
            {/* Footer Links End */}
          </div>

          <div className="col-lg-12">
            {/* Footer Nav Start */}
            <nav className="footer-nav wow fadeInUp" data-wow-delay="0.2s">
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/team">Our Team</Link></li>
                <li><Link to="/faqs">FAQ</Link></li>
                <li><Link to="/testimonials">Testimonials</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </nav>
            {/* Footer Nav End */}

            {/* Footer Copyright Text Start */}
            <div className="footer-copyright-text">
              <p>Copyright © 2025 All Rights Reserved.</p>
            </div>
            {/* Footer Copyright Text End */}
          </div>
        </div>
      </div>
    </footer>
  );
}
