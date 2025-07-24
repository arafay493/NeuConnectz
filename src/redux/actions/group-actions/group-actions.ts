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
import { handleRefreshToken } from "@/constants/refresh-token";
import { AssignGroupToUserDataType } from "@/types/modules/group-types/group-types";
import { ResHandler } from "@/types/api-types";

// Note: Action function to fetch list all group codes...!
const fetchListAllGroupCodes = createAsyncThunk(
    "group/fetchListAllGroupCodes",
    async (
        { authToken, lastCount, skipRecords }:
            {
                authToken: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const response = await axios({
                method: API_METHODS.GET,
                url: apiRequestRoutes.getRequest,
                params: {
                    lastCount,
                    skipRecords
                },
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_FETCH_ALL_LIST_GROUP_CODES,
                    "Auth-Token": authToken
                }
            });

            const { status, data } = response;

            const { data: groupData, totalCount } = data?.data

            if (status == 200) {
                dispatch(FETCH_ALL_GROUP_CODES({ groups: groupData, totalCount }));
            };
        }

        catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

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

            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_GROUP_CODES_BY_USER_ID(data?.data));
            };
        } catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

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
                addGroupToUserData: AssignGroupToUserDataType,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
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

            const { status, data } = response;

            if (status == 201) {
                resHandler(response);
            };
        } catch (error: any) {
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
    fetchListAllGroupCodes,
    fetchGroupCodesListByUserId,
    assignGroupToUser
};