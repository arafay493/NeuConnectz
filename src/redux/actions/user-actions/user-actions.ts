import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import { FETCH_ALL_USERS, UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA } from "@/redux/reducers/user-reducer/user-reducer";
import { ResHandler } from "@/types/api-types";
import { CreateUserDataType, UpdateUserType } from "@/types/modules/user-types/user-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Note: Action function fetch all users...!
const fetchAllUsers = createAsyncThunk(
    "user/fetchAllUsers",
    async (
        { authToken, LastCount, skipRecord }:
            {
                authToken: string,
                LastCount?: number,
                skipRecord?: number
            },
        { dispatch }
    ) => {
        try {
            const params: { [key: string]: number } = {};
            if (LastCount !== undefined) params.LastCount = LastCount;
            if (skipRecord !== undefined) params.skipRecord = skipRecord;

            const response = await apiGet('/neu-connect/v2/IUserManagementFeature/ListUsers', authToken, params);

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_USERS(data?.data));
            };
        }

        catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA());
        };
    }
);

// Note: Action function to create / add user...!
const addUser = createAsyncThunk(
    "user/add",
    async (
        { userData, token, resHandler }:
            {
                userData: CreateUserDataType,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/neu-connect/v2/IUserManagementFeature/AddUser', userData, token);

            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            resHandler(error?.response);

            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                handleRefreshToken(data?.error);
            };
        };
    }
);

// Note: Action function to update user...!
const updateUser = createAsyncThunk(
    "user/updateUser",
    async (
        { editUserData, token, resHandler }:
            {
                editUserData: UpdateUserType,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        try {
            const response = await apiPut('/neu-connect/v2/IUserManagementFeature/ActivateOrDeactivateUser', editUserData, token);

            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            resHandler(error?.response);

            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                handleRefreshToken(data?.error);
            };
        };
    }
);

export {
    addUser, fetchAllUsers, updateUser
};
