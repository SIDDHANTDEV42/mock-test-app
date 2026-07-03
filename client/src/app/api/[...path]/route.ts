import { NextRequest, NextResponse } from "next/server";

const productionApiUrl = "https://examprep-showcase-api.onrender.com/api";

type RouteContext = {
    params: Promise<{ path: string[] }>;
};

const apiBaseUrl = () => {
    const value = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || productionApiUrl;
    return value.replace(/\/$/, "");
};

const buildBackendUrl = async (request: NextRequest, context: RouteContext) => {
    const { path } = await context.params;
    const url = new URL(request.url);
    const backendUrl = new URL(`${apiBaseUrl()}/${path.join("/")}`);
    backendUrl.search = url.search;
    return backendUrl;
};

const buildHeaders = (request: NextRequest) => {
    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");
    const cookie = request.headers.get("cookie");

    if (contentType) headers.set("content-type", contentType);
    if (accept) headers.set("accept", accept);
    if (cookie) headers.set("cookie", cookie);

    headers.set("origin", request.nextUrl.origin);
    return headers;
};

const proxy = async (request: NextRequest, context: RouteContext) => {
    const backendUrl = await buildBackendUrl(request, context);
    const method = request.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);

    const backendResponse = await fetch(backendUrl, {
        method,
        headers: buildHeaders(request),
        body: hasBody ? await request.arrayBuffer() : undefined,
        cache: "no-store",
        redirect: "manual",
    });

    const responseHeaders = new Headers();
    const contentType = backendResponse.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);

    const response = new NextResponse(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: responseHeaders,
    });

    const setCookies =
        (backendResponse.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ||
        [backendResponse.headers.get("set-cookie")].filter(Boolean);

    setCookies.forEach((cookie) => {
        if (cookie) response.headers.append("set-cookie", cookie);
    });

    return response;
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
