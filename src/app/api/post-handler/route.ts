// Note: All POST Api's request are handled here...!

import { NextRequest, NextResponse } from "next/server";
import instance from "@/lib/axios/axios";
import API_METHODS from "@/constants/api-methods";

export const POST = async (req: NextRequest) => {
    console.log("POST request: ", req?.body);

    try {
        const apiUrl = req.headers.get("Api-Url");
        console.log("API URL from header: ", apiUrl);

        const token = req.headers.get('Auth-Token');
        console.log("Token: ", token);

        const body = await req?.json();
        console.log("POST request body: ", body);

        // Note: Check if apiUrl is not provided in the header...!
        if (!apiUrl) {
            return NextResponse.json(
                { error: "API URL is required" },
                { status: 400 }
            );
        };

        const response = await instance({
            method: API_METHODS.POST,
            url: apiUrl,
            data: body,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        });
        const { status, data } = response;
        console.log('Response status in server:', status);
        console.log('Response in server:', data);

        return NextResponse.json(
            data,
            { status: status }
        );
    }

    catch (error: any) {
        console.error("Error in POST request: ", error?.response?.data);
        return NextResponse.json(
            { error: error?.response?.data?.message || "Internal Server Error" },
            { status: error?.response?.data?.statusCode || 500 }
        );
    };
};