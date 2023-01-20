import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

function checkAuth(req) {
  if (
    process.env.NEXT_PUBLIC_ENV !== "production" &&
    process.env.NEXT_PUBLIC_ENV !== "local" &&
    process.env.NEXT_PUBLIC_HTTP_USER &&
    process.env.NEXT_PUBLIC_HTTP_PASS
  ) {
    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
      const auth = basicAuth.split(" ")[1];
      const [user, pwd] = atob(auth).split(":");

      if (
        user === process.env.NEXT_PUBLIC_HTTP_USER &&
        pwd === process.env.NEXT_PUBLIC_HTTP_PASS
      ) {
        return true;
      }
    }

    return false;
  }
  return true;
}

export function middleware(req) {
  if (!checkAuth(req)) {
    return NextResponse.rewrite(
      `${req.nextUrl.protocol}//${req.nextUrl.host}/en/401`,
      {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
      }
    );
  }

  // handling default locale from official documentation
  // https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  if (req.nextUrl.locale === "default") {
    return NextResponse.redirect(
      new URL(`/en${req.nextUrl.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
