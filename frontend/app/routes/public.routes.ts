import { route, index } from "@react-router/dev/routes";

export const publicRoutes = [
  index("pages/home.tsx"),
  route("about", "pages/public/about.tsx"),
  route("services", "pages/public/services.tsx"),
  route("services/:slug", "pages/public/services/detail.tsx"),
  route("products", "pages/public/products.tsx"),
  route("products/:slug", "pages/public/products/detail.tsx"),
  route("projects", "pages/public/projects.tsx"),
  route("projects/:slug", "pages/public/projects/detail.tsx"),
  route("blog", "pages/public/blog.tsx"),
  route("blog/:slug", "pages/public/blog/detail.tsx"),
  route("team", "pages/public/team.tsx"),
  route("testimonials", "pages/public/testimonials.tsx"),
  route("faqs", "pages/public/faqs.tsx"),
  route("contact", "pages/public/contact.tsx"),
  route("*", "pages/not-found.tsx"),
];
