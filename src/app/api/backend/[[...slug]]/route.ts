import API_ENDPOINTS from '@/lib/api-config';
import { NextRequest, NextResponse } from 'next/server';

// Function to handle the proxy logic
async function proxyRequest(req: NextRequest, method: string) {
    let targetBackend: string | undefined = '';

    // Decide which backend to use based on path
    if (req.nextUrl.pathname.startsWith(process.env.AUTH_API_URL!)) {
        targetBackend = API_ENDPOINTS.auth;
    } else if (req.nextUrl.pathname.startsWith(process.env.REFRESH_AUTH_API_URL!)) {
        targetBackend = API_ENDPOINTS.refreshToken;
    } else if (req.nextUrl.pathname.startsWith(process.env.ZCAPI_API_URL!)) {
        targetBackend = API_ENDPOINTS.neuConnect;
    } else if (req.nextUrl.pathname.startsWith(process.env.TT_API_URL!)) {
        targetBackend = API_ENDPOINTS.traceAndTrack;
    } else {
        return new NextResponse(JSON.stringify({ error: 'Unknown API route' }), { status: 400 });
    }

    // Remove the "/api/backend/{type}" part
    const url = targetBackend + req.nextUrl.pathname.replace(/^\/api\/backend\/(auth\/login|auth\/refresh-token|neu-connect\/v2|trace-and-track\/v2)/, '') + req.nextUrl.search;

    const headers = Object.fromEntries(req.headers.entries());
    delete headers.host;

    const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined,
    });

    if (response.ok) {
        const json = await response.json();
        return new NextResponse(JSON.stringify(json), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } else {
        return new NextResponse(await response.text(), { status: response.status });
    }
}

// Export named functions for each HTTP method
export async function GET(request: NextRequest) {
    return await proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
    return await proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
    return await proxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
    return await proxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
    return await proxyRequest(request, 'DELETE');
}