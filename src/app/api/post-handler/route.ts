// Note: All POST Api's request are handled here...!

import { NextRequest, NextResponse } from "next/server";
import instance from "@/lib/axios/axios";
import API_METHODS from "@/constants/api-methods";

export const POST = async (req: NextRequest) => {
    console.log("POST request: ", req?.body);

    try {
        const apiUrl = req.headers.get("Login-Api-Url");
        console.log("API URL from header: ", apiUrl);

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
        });
        const { status, data } = response;
        console.log('Response status in server:', status);
        console.log('Response in server:', data);

        return NextResponse.json(
            data,
            { status: status }
        );
    }

    catch (error) {
        console.error("Error in POST request: ", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    };
};