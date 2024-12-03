import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

export const config = {
  matcher: "/api/:path*",
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Checking if the request is for an API route
  if (!url.pathname.startsWith("/api")) {
    return NextResponse.rewrite(new URL("/404", request.url)); // Use rewrite for custom 404 handling
  }

  if (request.url.includes("/api/blogs")) {
    const logResult = logMiddleware(request);
    console.log(logResult.response);
  }


  // Calling authMiddleware to validate the request
  const authResult = await authMiddleware(request); // Await if authMiddleware is async
  if (!authResult?.isValid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Allow the request to proceed if authentication is valid
  return NextResponse.next();
}
