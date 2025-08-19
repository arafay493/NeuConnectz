import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost } from "@/lib/api-service";
import {
    FETCH_ALL_GROUP_CODES,
    FETCH_GROUP_CODES_BY_USER_ID,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA,
} from "@/redux/reducers/group-reducer/group-reducer";
import { ResHandler } from "@/types/api-types";
import { AssignGroupToUserDataType } from "@/types/modules/group-types/group-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet('/neu-connect/v2/IGroupcodeFeature/ListAllGroupcodes', authToken, params);

        const { status, data } = response;

        const { data: groupData, totalCount } = data?.data

        if (status == 200) {
            dispatch(FETCH_ALL_GROUP_CODES({ groups: groupData, totalCount }));
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
        const response = await apiGet(`/neu-connect/v2/IGroupcodeFeature/ListAllGroupcodesByUserId?userId=${userId}`, authToken);
        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_GROUP_CODES_BY_USER_ID(data?.data));
        };

        if (status == 200) {
            dispatch(FETCH_GROUP_CODES_BY_USER_ID(data?.data));
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
        const response = await apiPost('/neu-connect/v2/IGroupcodeFeature/AddGroupcodeToUser', addGroupToUserData, token);

        const { status, data } = response;

        if (status == 201) {
            resHandler(response);
        };
    }
);

export {
    assignGroupToUser, fetchGroupCodesListByUserId, fetchListAllGroupCodes
};

