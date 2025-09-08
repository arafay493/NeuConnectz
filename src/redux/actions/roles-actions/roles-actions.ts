// Note: All roles action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { FETCH_ALL_LIST_ROLES, UNAUTHORIZE_USER_TRYING_TO_ACCESS_ROLES_DATA } from "@/redux/reducers/roles-reducer/roles-reducer";
import { handleRefreshToken } from "@/constants/refresh-token";

// Note: Action function to fetch all roles list...!
const fetchAllRolesList = createAsyncThunk(
    "roles/fetchAllRolesList",
    async (authToken: string, { dispatch }) => {
        try {
            const response = await apiGet(`/auth${process.env.NEXT_PUBLIC_FETCH_ALL_LIST_ROLES}`);
            
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_LIST_ROLES(data?.data?.roles));
            };
        } catch (error: any) {
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