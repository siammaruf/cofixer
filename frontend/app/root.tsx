import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { useState, useEffect } from "react";
import { Providers } from './hooks/providers/providers';
import MagicCursor from "./components/MagicCursor";
import WowInit from "./components/WowInit";
import type { Route } from "./+types/root";
import "./styles/app.css";
import "quill/dist/quill.snow.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap",
  },
  { rel: "stylesheet", href: "/css/bootstrap.min.css" },
  { rel: "stylesheet", href: "/css/slicknav.min.css" },
  { rel: "stylesheet", href: "/css/swiper-bundle.min.css" },
  { rel: "stylesheet", href: "/css/all.min.css" },
  { rel: "stylesheet", href: "/css/animate.css" },
  { rel: "stylesheet", href: "/css/magnific-popup.css" },
  { rel: "stylesheet", href: "/css/mousecursor.css" },
  { rel: "stylesheet", href: "/css/custom.css" },
  { rel: "icon", type: "image/svg+xml", href: "/images/favicon.svg" },
];

function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="preloader">
      <div className="loading-container">
        <div className="loading"></div>
        <div id="loading-icon"><img src="/images/loader.svg" alt="" /></div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />

        {/* Security Meta Tags */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:3000 https://api.cofixer.com; frame-src 'self' https://www.google.com; base-uri 'self'; form-action 'self';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />

        {/* Prevent clickjacking via meta (backup to X-Frame-Options header) */}
        <meta name="robots" content="index, follow" />

        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: '.tabs-list-h40{height:40px!important}.tabs-trigger-active-r20[data-state="active"]{border-radius:20px!important}' }} />
      </head>
      <body suppressHydrationWarning>
        <Preloader />

        <Providers>
          {children}
        </Providers>
        <WowInit />
        <MagicCursor />
        <ScrollRestoration />
        <Scripts />

        {/* Template JS Files */}
        <script src="/js/jquery-3.7.1.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
        <script src="/js/validator.min.js"></script>
        <script src="/js/jquery.slicknav.js"></script>
        <script src="/js/swiper-bundle.min.js"></script>
        <script src="/js/jquery.waypoints.min.js"></script>
        <script src="/js/jquery.counterup.min.js"></script>
        <script src="/js/jquery.magnific-popup.min.js"></script>
        <script src="/js/parallaxie.js"></script>
        <script src="/js/gsap.min.js"></script>
        <script src="/js/SplitText.js"></script>
        <script src="/js/ScrollTrigger.min.js"></script>
        <script src="/js/SmoothScroll.js"></script>
        <script src="/js/jquery.mb.YTPlayer.min.js"></script>
        <script src="/js/function.js"></script>
        <script src="/js/wow.min.js"></script>
      </body>
    </html>
  );
}

export async function loader() {
  return {
    ENV: {
      API_URL: process.env.VITE_API_URL,
    },
  };
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)};`,
        }}
      />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Oops! page not found" : "Error";
    details =
      error.status === 404
        ? "The page you are looking for does not exist."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Page not <span>found</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">404 Error page</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* error section start */}
      <div className="error-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="error-page-image wow fadeInUp">
                <img src="/images/404-error-img.png" alt="" />
              </div>
              <div className="error-page-content">
                <div className="section-title">
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">{message}<span>found</span></h2>
                </div>
                <div className="error-page-content-body">
                  <p className="wow fadeInUp" data-wow-delay="0.4s">{details}</p>
                  <a className="btn-default wow fadeInUp" data-wow-delay="0.6s" href="/">back to home</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* error section end */}
    </>
  );
}
