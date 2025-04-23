// Note: All API related types are defined here...!

export interface ApiMethods {
    POST: string,
    GET: string,
    PUT: string,
    DELETE: string,
};

export interface Urls {
    deployedUrl: string | undefined;
};

export interface ApiRequestRoutes {
    postRequest: string;
    getRequest: string;
};

export interface AxiosDefaultOptions {
    baseURL: string | undefined;
    headers: {
        "Content-Type": string;
    };
};

export type ResHandler = (res: any | null) => void;