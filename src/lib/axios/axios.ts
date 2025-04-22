/***** Note: Axios Configuration File *****/

import
axios,
{
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError
}
    from "axios";
import { Urls, AxiosDefaultOptions } from "@/types/api-types";
import { getCookie } from "cookies-next";

// Note: This is a configuration file for axios. It is used to set up the axios instance with the base...!
const urls: Urls = {
    deployedUrl: process.env.API_URL
};

// Note: Default config options...!
const defaultOptions: AxiosDefaultOptions = {
    baseURL: urls.deployedUrl,
    headers: {
        "Content-Type": "application/json",
    }
};

// Note: Create instance...!
const instance: AxiosInstance = axios.create(defaultOptions);

// Note: Request Interceptor – Set Auth Token...!
instance
    .interceptors
    .request
    .use(
        (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
            const fetchToken = getCookie("AuthToken") as string;
            console.log("Auth token: ", fetchToken);

            if (config.headers) {
                if (fetchToken) config.headers.Authorization = `Bearer ${fetchToken}`;
                else delete config.headers.Authorization;
            };

            return config;
        },

        (error) => {
            return Promise.reject(error);
        }
    );

// Note: Response Interceptor – Global Error Handling
instance
    .interceptors
    .response
    .use(
        (response: AxiosResponse) => response, // just return response if successful
        (error: AxiosError) => {
            if (error.response) {
                const status = error.response.status;
                console.log("Error status: ", status, error.response.data);
            }

            else {
                console.error("Network or unexpected error:", error.message);
            };

            return Promise.reject(error);
        }
    );

export default instance;