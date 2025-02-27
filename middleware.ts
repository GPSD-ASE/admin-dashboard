import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { API_CONSTANTS } from "./constants/ApiConstants";

export function middleware(req: NextRequest) {
    const encryptedToken = req.cookies.get("Token")?.value || "";

    const { pathname, origin } = req.nextUrl;
    let isTokenValid: boolean = true;
    checkValidity(encryptedToken).then((response: boolean) => {
        isTokenValid = response;
    });
    if (!isTokenValid) {
        if (pathname === "/home" || pathname === "/incidents" || pathname === "/" || pathname === "/analytics" || pathname === "/mobile-client") {
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

const checkValidity = async (encryptedToken: string) => {

        const res = await fetch(API_CONSTANTS.VERIFY_USER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let response = await res.json();
        if (res.ok) {
            return true;
        } else {
            return false;
        }
}

export const config = {
    matcher: [
        "/home",
        "/",
        "/home",
        "/incidents",
        "/analytics",
        "/mobile-client"
    ],
};