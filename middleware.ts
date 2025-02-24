import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";

export function middleware(req: NextRequest) {
    const encryptedToken = req.cookies.get("authToken")?.value || "";
    const { pathname, origin } = req.nextUrl;

    const isTokenValid = checkValidity(encryptedToken);

    if (!isTokenValid) {
        if (pathname !== "/login") {
            const loginURL = new NextURL("/login", origin);
            return NextResponse.redirect(loginURL);
        }
    } else {
        if (pathname === "/login" || pathname === "/register") {
            const homeURL = new NextURL("/home", origin);
            return NextResponse.redirect(homeURL);
        }
    }
    return NextResponse.next();
}

const checkValidity = (encryptedToken: string) => {

    // Call verify api to check if token is valid
    return true;
}

export const config = {
    matcher: [
      "/home/:path*", 
      "/login",
      "/register",
      "/",
      "/home",
      "/incidents",
      "/analytics"
    ],
  };