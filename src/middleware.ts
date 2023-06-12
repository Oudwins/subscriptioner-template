import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: ["/", "/api/(.*)"],
// });

export default authMiddleware({
  publicRoutes: ["/api/stripe-hooks"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  //matcher: ["/((?!.*\\..*|_next).*)", "/"],
  //matcher: ["/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)", "/"],
};
