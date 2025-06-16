// Note: All user action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { FETCH_ALL_USERS, UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA } from "@/redux/reducers/user-reducer/user-reducer";
import { handleRefreshToken } from "@/constants/refresh-token";
import { CreateUserDataType, UpdateUserType } from "@/types/modules/user-types/user-types";
import { ResHandler } from "@/types/api-types";

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
                    "Api-Url": process.env.NEXT_PUBLIC_FETCH_ALL_USERS,
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
        // console.log("Token in user action: ", token);
        // console.log("Add user data in user action: ", userData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: userData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_ADD_USER,
                    "Auth-Token": token
                }
            });
            // console.log("Response in user action: ", response);
            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            // console.log('Error occured in add user api integration: ', error);
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
        // console.log("Token in user action: ", token);
        // console.log("Status data in user action: ", editUserData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: editUserData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_UPDATE_USER,
                    "Auth-Token": token
                }
            });
            // console.log("Response in user action: ", response);
            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            // console.log('Error occured in update user api integration: ', error);
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
    fetchAllUsers,
    addUser,
    updateUser
};