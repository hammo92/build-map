import { deleteCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    /*if (!pathname.startsWith("/login")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }*/

    if (!pathname.startsWith("/_next")) {
        const url = request.nextUrl.clone();
        const token = request.cookies?.get("token");
        console.log("token", token);
        const atLogin = pathname.startsWith("/login");
        const atRoot = pathname === "/";
        console.log("pathname", pathname);

        const redirectToLogin = () => {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("from", request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        };

        // redirect user to login if no token available
        if (!token && !atLogin) {
            redirectToLogin();
        }

        if (token) {
            // get user from token
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}/authenticate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });
            const { user } = await response.json();
            if (!user && !atLogin) redirectToLogin();
            if (user) {
                if (atRoot || atLogin) {
                    const organisationUrl = new URL("/organisations", request.url);
                    return NextResponse.redirect(organisationUrl).cookies.set("userId", user.id);
                } else {
                    const response = NextResponse.next();
                    response.cookies.set("userId", user.id, {
                        sameSite: true,
                        expires: new Date(new Date().getTime() + 1000 * 360000),
                    });
                    return response;
                }
            }
        }
    }

    return NextResponse.next();
}
