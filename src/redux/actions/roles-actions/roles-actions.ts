// Note: All roles action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { FETCH_ALL_LIST_ROLES, UNAUTHORIZE_USER_TRYING_TO_ACCESS_ROLES_DATA } from "@/redux/reducers/roles-reducer/roles-reducer";
import { handleRefreshToken } from "@/constants/refresh-token";

// Note: Action function to fetch all roles list...!
const fetchAllRolesList = createAsyncThunk(
    "roles/fetchAllRolesList",
    async (authToken: string, { dispatch }) => {
        // console.log("Auth token: ", authToken);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_FETCH_ALL_LIST_ROLES,
                    "Auth-Token": authToken
                }
            });
            // console.log("Response in roles action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_LIST_ROLES(data?.data?.roles));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all roles list api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_ROLES_DATA());
        };
    }
);

export {
    fetchAllRolesList
};