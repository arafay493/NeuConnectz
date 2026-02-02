import API_METHODS from "@/constants/api-methods";
import axiosInstance from "@/lib/axios-instance";
import { handleRefreshToken } from "@/constants/refresh-token";

// Generic function for GET requests
export const apiGet = async (endpoint: string, authToken?: string, params?: { [key: string]: number | string }) => {
    try {
        const response = await axiosInstance({
            method: API_METHODS.GET,
            url: endpoint,
            params,
            headers: {
                'Auth-Token': authToken
            }
        });
        return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
        const { status, data } = error?.response || {};
        // console.log('Dataaaa: ', data);

        // Handle 401 - Unauthorized
        if (status === 401) {
            handleRefreshToken(error.message);
        }

        return { success: false, error: data.message, status };
    }
};

// Generic function for POST requests
export const apiPost = async (endpoint: string, payload: any, authToken?: string) => {
    try {
        const response = await axiosInstance({
            method: API_METHODS.POST,
            url: endpoint,
            data: payload,
            headers: {
                'Auth-Token': authToken
            }
        });
        return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
        const { status, data } = error?.response || {};
        console.log('Data: ', data);

        // Handle 401 - Unauthorized
        if (status === 401) {
            handleRefreshToken(error.message);
        }

        return { success: false, error: data.message, status };
    }
};

// Generic function for PUT requests
export const apiPut = async (endpoint: string, payload: any, authToken?: string) => {
    try {
        const response = await axiosInstance({
            method: API_METHODS.PUT,
            url: endpoint,
            data: payload,
            headers: {
                'Auth-Token': authToken
            }
        });
        console.log('Put response: ' , response);
        return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
        const { status, data } = error?.response || {};

        // Handle 401 - Unauthorized
        if (status === 401) {
            handleRefreshToken(error.message);
        }

        return { success: false, error: error.message, status };
    }
};

// Generic function for DELETE requests
export const apiDelete = async (endpoint: string, authToken?: string) => {
    try {
        const response = await axiosInstance({
            method: API_METHODS.DELETE,
            url: endpoint,
            headers: {
                'Auth-Token': authToken
            }
        });
        return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
        const { status, data } = error?.response || {};

        // Handle 401 - Unauthorized
        if (status === 401) {
            handleRefreshToken(error.message);
        }

        return { success: false, error: error.message, status };
    }
};
