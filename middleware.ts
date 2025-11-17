export { auth as middleware } from "@/lib/auth/session";

export const config = {
  matcher: ["/", "/upload", "/quizzes/:path*"]
};

