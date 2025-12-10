// import API_ENDPOINTS from '@/lib/api-config';
// import { NextRequest, NextResponse } from 'next/server';

// // Function to handle the proxy logic
// async function proxyRequest(req: NextRequest, method: string) {
//     let targetBackend: string | undefined = '';

//     // Decide which backend to use based on path
//     if (req.nextUrl.pathname.startsWith(process.env.AUTH_API_URL!)) {
//         targetBackend = API_ENDPOINTS.auth;
//     } else if (req.nextUrl.pathname.startsWith(process.env.ZCAPI_API_URL!)) {
//         targetBackend = API_ENDPOINTS.neuConnect;
//     } else if (req.nextUrl.pathname.startsWith(process.env.TT_API_URL!)) {
//         targetBackend = API_ENDPOINTS.traceAndTrack;
//     } else {
//         return new NextResponse(JSON.stringify({ error: 'Unknown API route' }), { status: 400 });
//     }

//     // Remove the "/api/backend/{type}" part
//     console.log("Requested URL" + req.nextUrl.pathname)
//     console.log("Requested Next URL Search" + req.nextUrl.search)
//     const replacedUrl = req.nextUrl.pathname.replace(/^\/api\/backend\/(auth|neu-connect\/v2|trace-and-track\/v2)/, '')
//     const url = targetBackend + replacedUrl + req.nextUrl.search;

//     console.log("Target Backend:", targetBackend);
//     console.log("URL:", url);

//     // Forward the request to the target backend
//     const headers = Object.fromEntries(req.headers.entries());
//     console.log("🚀 ~ proxyRequest ~ headers:", headers)
//     delete headers.host;

//     const response = await fetch(url, {
//         method,
//         headers,
//         body: method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined,
//     });
//     // 👇 Add real backend URL only in development
//     // if (process.env.NODE_ENV === 'development') {
//     //     newHeaders['x-real-backend-url'] = url;
//     // }

//     if (response.ok) {
//         const json = await response.json();
//         return new NextResponse(JSON.stringify(json), {
//             status: response.status,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     } else {
//         return new NextResponse(await response.text(), { status: response.status });
//     }
// }

// // Export named functions for each HTTP method
// export async function GET(request: NextRequest) {
//     return await proxyRequest(request, 'GET');
// }

// export async function POST(request: NextRequest) {
//     return await proxyRequest(request, 'POST');
// }

// export async function PUT(request: NextRequest) {
//     return await proxyRequest(request, 'PUT');
// }

// export async function PATCH(request: NextRequest) {
//     return await proxyRequest(request, 'PATCH');
// }

// export async function DELETE(request: NextRequest) {
//     return await proxyRequest(request, 'DELETE');
// }






















import API_ENDPOINTS from '@/lib/api-config';
import { NextRequest, NextResponse } from 'next/server';

async function proxyRequest(req: NextRequest, method: string) {
    let targetBackend: string | undefined = '';

    if (req.nextUrl.pathname.startsWith(process.env.AUTH_API_URL!)) {
        targetBackend = API_ENDPOINTS.auth;
    } else if (req.nextUrl.pathname.startsWith(process.env.ZCAPI_API_URL!)) {
        targetBackend = API_ENDPOINTS.neuConnect;
    } else if (req.nextUrl.pathname.startsWith(process.env.TT_API_URL!)) {
        targetBackend = API_ENDPOINTS.traceAndTrack;
    } else {
        return new NextResponse(JSON.stringify({ error: 'Unknown API route' }), { status: 400 });
    }

    console.log("Requested URL:", req.nextUrl.pathname);
    console.log("Requested Next URL Search:", req.nextUrl.search);

    const replacedUrl = req.nextUrl.pathname.replace(/^\/api\/backend\/(auth|neu-connect\/v2|trace-and-track\/v2)/, '');
    const url = targetBackend + replacedUrl + req.nextUrl.search;

    console.log("Target Backend:", targetBackend);
    console.log("Final Target URL:", url);

    const headers = Object.fromEntries(req.headers.entries());
    delete headers.host;

    const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined,
    });

    const newHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

    // 👇 Add real backend URL only in development
    // if (process.env.NODE_ENV === 'development') {
    //     newHeaders['real-backend-url'] = url;
    // }
    newHeaders['real-backend-url'] = url;

    if (response.ok) {
        const json = await response.json();
        return new NextResponse(JSON.stringify(json), {
            status: response.status,
            headers: newHeaders,
        });
    } else {
        const errorText = await response.text();
        return new NextResponse(errorText, {
            status: response.status,
            headers: newHeaders,
        });
    }
}

// Export handlers
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