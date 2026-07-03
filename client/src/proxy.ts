import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
        try {
            const response = await fetch(`${apiBaseUrl}/auth/me`, {
                headers: {
                    cookie: request.headers.get('cookie') || '',
                },
                cache: 'no-store',
            });

            if (!response.ok) {
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            const data = await response.json();
            if (data?.user?.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*'],
};
