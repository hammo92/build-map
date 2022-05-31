import { removeCookies } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export default async function authenticate(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone();
    const token = req.cookies.token;

    // redirect user to login if no token available
    if (!token && pathname !== "/login") {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // get user from token
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_API_URL}/authenticate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        }
    );
    const { user } = await response.json();

    //if user can't be authenticated by token retun to login screen
    if (!user && pathname !== "/login") {
        url.pathname = "/dest";
        removeCookies("token");
        return NextResponse.redirect(url);
    }

    // if user authenticated take them to their organisations
    if (user) {
        console.log(`user`, user);
        url.pathname = "/organisations";
        //if user has not set up or joined an organisation
        /*if (!user.organisation) {
            if (pathname === "/setup/organisation") {
                return NextResponse.next().cookie("userId", user.id, {
                    sameSite: true,
                    expires: new Date(new Date().getTime() + 1000 * 360000),
                });
            }
            return NextResponse.redirect("/setup/organisation").cookie(
                "userId",
                user.id,
                {
                    sameSite: true,
                    expires: new Date(new Date().getTime() + 1000 * 360000),
                },
            );
        }*/
        if (pathname === "/login" || pathname === "/") {
            url.pathname = "/organisations";
            return NextResponse.redirect(url).cookie("userId", user.id, {
                sameSite: true,
                expires: new Date(new Date().getTime() + 1000 * 360000),
            });
        }
        return NextResponse.next().cookie("userId", user.id, {
            sameSite: true,
            expires: new Date(new Date().getTime() + 1000 * 360000),
        });
    }
    return NextResponse.next();
}
