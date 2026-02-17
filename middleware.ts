export { auth as middleware } from "@/auth";

export const config = {
  // Exclude API routes, static assets, and public pages (demo, home)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|demo|$).*)"],
};
