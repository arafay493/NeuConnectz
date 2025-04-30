// Note: All GET Api's request are handled here...!

import { NextRequest, NextResponse } from "next/server";
import instance from "@/lib/axios/axios";
import API_METHODS from "@/constants/api-methods";

export const GET = async (req: NextRequest) => {
    try {
        const apiUrl = req.headers.get("Login-Api-Url");
        // console.log("API URL from header: ", apiUrl);

        const token = req.headers.get('Auth-Token');
        // console.log("Token: ", token);

        // Note: Check if apiUrl is not provided in the header...!
        if (!apiUrl || !token) {
            return NextResponse.json(
                { error: "API URL or Token is required" },
                { status: 400 }
            );
        };

        const response = await instance({
            method: API_METHODS.GET,
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        const { status, data } = response;
        // console.log('Response status in server:', status);
        // console.log('Response in server:', data);

        return NextResponse.json(
            data,
            { status: status }
        );
    }

    catch (error: any) {
        // console.error("Error in GET request: ", error?.response?.data);
        return NextResponse.json(
            { error: error?.response?.data?.message || "Internal Server Error" },
            { status: error?.response?.data?.statusCode || 500 }
        );
    };
};