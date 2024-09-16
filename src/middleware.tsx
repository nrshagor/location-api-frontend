import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    console.log(decoded);
    // Define role-based access control
    const { role } = decoded;

    // Define protected paths and their required roles
    const rolePaths: { [key: string]: string[] } = {
      "/dashboard/profile": ["admin", "user", "superAdmin"],
      "/dashboard/admin": ["superAdmin"],
    };

    const pathname = req.nextUrl.pathname;
    const isPathProtected = Object.keys(rolePaths).some((path) =>
      pathname.startsWith(path)
    );

    if (isPathProtected) {
      const allowedRoles = Object.entries(rolePaths).find(([path]) =>
        pathname.startsWith(path)
      )?.[1];
      if (allowedRoles && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/profile", "/dashboard/admin/:path*"],
};
