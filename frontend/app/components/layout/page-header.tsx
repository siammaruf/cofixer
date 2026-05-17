import { Link } from "react-router";

interface PageHeaderProps {
  title: string;
  highlight: string;
  breadcrumb: string;
}

export default function PageHeader({ title, highlight, breadcrumb }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="page-header-box">
              <h1 data-cursor="-opaque">{title} <span>{highlight}</span></h1>
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{breadcrumb}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
