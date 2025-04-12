import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { API_CONSTANTS } from "./constants/ApiConstants";

export async function middleware(req: NextRequest) {
    const encryptedToken = req.cookies.get("Token")?.value || "";
    const { pathname, origin } = req.nextUrl;
    const isTokenValid = await checkValidity(encryptedToken); 
    const requestHeaders = new Headers(req.headers);

    if (isTokenValid) {
        requestHeaders.set("Authorization", `Bearer ${encryptedToken}`);
    }

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    if (
        !isTokenValid &&
        ["/home", "/incidents", "/", "/analytics"].includes(pathname)
    ) {
        const loginURL = req.nextUrl.clone();
        loginURL.pathname = "/login";
        return NextResponse.redirect(loginURL);
    }

    if (
        isTokenValid &&
        ["/login", "/register"].includes(pathname)
    ) {
        const homeURL = req.nextUrl.clone();
        homeURL.pathname = "/home";
        return NextResponse.redirect(homeURL);
    }

    return response;
}

const checkValidity = async (encryptedToken: string) => {

        const res = await fetch(API_CONSTANTS.VERIFY_USER, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + encryptedToken
            }
        })
        let response = await res.json();
        if (response.message == 'valid token') {
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
        "/mobile-client",
        "/login",
        "/register"
    ],
};