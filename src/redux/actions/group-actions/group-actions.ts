// Note: All warehouse action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import {
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA,
    FETCH_ALL_GROUP_CODES,
    FETCH_GROUP_CODES_BY_USER_ID,
}
    from "@/redux/reducers/group-reducer/group-reducer";
import { sessionExpired } from "@/constants/session-expired";
import { AssignGrouptoUserDataType } from "@/types/modules/group-types/group-types";
import { ResHandler } from "@/types/api-types";

// Note: Action function to fetch list all group codes...!
const fetchListAllGroupCodes = createAsyncThunk(
    "group/fetchListAllGroupCodes",
    async (authToken: string, { dispatch }) => {
        // console.log("Auth token: ", authToken);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_FETCH_ALL_LIST_GROUP_CODES,
                    "Auth-Token": authToken
                }
            });
            // console.log("Response in group action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_ALL_GROUP_CODES(data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetch all list group codes api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) sessionExpired(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA());
        };
    }
);

// Note: Action function to fetch group codes list by user id...!
const fetchGroupCodesListByUserId = createAsyncThunk(
    "group/fetchListAllGroupCodes",
    async (
        { authToken, userId }: { authToken: string, userId: string },
        { dispatch }
    ) => {
        // console.log("Auth token: ", authToken);
        // console.log("User id: ", userId);

        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                params: { userId },
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_ADD_FETCH_GROUP_CODES_BY_USER_ID,
                    "Auth-Token": authToken
                }
            });
            // console.log("Response in group action: ", response);
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_GROUP_CODES_BY_USER_ID(data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occured in fetc group codes list by user id api integration: ', error);
            const { status, data } = error?.response;

            // 401:
            if (status == 401) sessionExpired(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA());

            // 404
            else if (status == 404) dispatch(FETCH_GROUP_CODES_BY_USER_ID([]));
        };
    }
);

// Note: Action function to assign group to user...!
const assignGroupToUser = createAsyncThunk(
    "group/assignGroupToUser",
    async (
        { addGroupToUserData, token, resHandler }:
            {
                addGroupToUserData: AssignGrouptoUserDataType,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        // console.log("Token in group action: ", token);
        // console.log("Assign group to user data in group action: ", addGroupToUserData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: addGroupToUserData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_ADD_GROUP_TO_USER,
                    "Auth-Token": token
                }
            });
            // console.log("Response in group action: ", response);
            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        }

        catch (error: any) {
            // console.log('Error occured in assign group to user api integration: ', error);
            resHandler(error?.response);

            const { status, data } = error?.response;

            // 401:
            if (status == 401) {
                sessionExpired(data?.error);
            };
        };
    }
);

export {
    fetchListAllGroupCodes,
    fetchGroupCodesListByUserId,
    assignGroupToUser
};