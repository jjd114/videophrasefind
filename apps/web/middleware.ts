import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/help",
    "/terms-of-service",
    "/video/:s3DirectoryPath",
  ],
});

export const config = {
  matcher: [
    "/((?!.+.[w]+$|_next|favicon.ico|.*.svg).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
