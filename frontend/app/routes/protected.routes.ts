import { route, index } from "@react-router/dev/routes";

export const protectedRoutes = [
  index("pages/dashboard/index.tsx"),
  route("profile", "pages/dashboard/profile.tsx"),
  route("users", "pages/dashboard/users/index.tsx"),
  route("users/create", "pages/dashboard/users/create.tsx"),
  route("services", "pages/dashboard/services/index.tsx"),
  route("services/create", "pages/dashboard/services/create/index.tsx"),
  route("projects", "pages/dashboard/projects/index.tsx"),
  route("projects/create", "pages/dashboard/projects/create/index.tsx"),
  route("blog", "pages/dashboard/blog/index.tsx"),
  route("blog/create", "pages/dashboard/blog/create/index.tsx"),
  route("team", "pages/dashboard/team/index.tsx"),
  route("team/create", "pages/dashboard/team/create/index.tsx"),
  route("testimonials", "pages/dashboard/testimonials/index.tsx"),
  route("testimonials/create", "pages/dashboard/testimonials/create/index.tsx"),
  route("faqs", "pages/dashboard/faqs/index.tsx"),
  route("faqs/create", "pages/dashboard/faqs/create/index.tsx"),
  route("contacts", "pages/dashboard/contacts/index.tsx"),
  route("seo", "pages/dashboard/seo/index.tsx"),
  route("media", "pages/dashboard/media/index.tsx"),
  route("settings", "pages/dashboard/settings/index.tsx"),
];
