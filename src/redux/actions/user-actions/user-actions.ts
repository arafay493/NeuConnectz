// Note: All authenticated action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { FETCH_ALL_USERS } from "@/redux/reducers/user-reducer/user-reducer";
import { sessionExpired } from "@/constants/session-expired";

// Note: Action function fetch all users...!
const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (authToken: string, { dispatch }) => {
        // console.log("Auth token: ", authToken);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Login-Api-Url": process.env.NEXT_PUBLIC_FETCH_ALL_USERS,
                    "Auth-Token": authToken
                }
            });
            // console.log("Response in user action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_USERS(data?.data?.users));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all users api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                sessionExpired(data?.error);
            };
        };
    }
);

export { fetchAllUsers };