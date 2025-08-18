const API_ENDPOINTS = {
    auth: process.env.AUTH_LOGIN_API,
    refreshToken: process.env.AUTH_REFRESH_TOKEN,
    neuConnect: process.env.NEU_CONNECT_URL,
    traceAndTrack: process.env.TRACE_AND_TRACK_URL,
    baseUrl: process.env.NEXT_PUBLIC_API_URL
};

export default API_ENDPOINTS;