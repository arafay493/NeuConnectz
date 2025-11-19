import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_ALL_PLANTS_CODES_BY_USER } from "@/redux/reducers/plants-reducer/plants-reducer";
import { CLEAR_ALL_PUTAWAY_STATES, FETCH_ALL_PUTAWAY } from "@/redux/reducers/putaway-reducer/putaway-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchListAllPutAway = createAsyncThunk(
    "putaway/fetchListAllPutAway",
    async (
        { authToken, lastCount, skipRecords, apiUrl }:
            {
                authToken: string,
                apiUrl: string
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        try {
            const params: { [key: string]: number } = {};
            if (lastCount !== undefined) params.lastCount = lastCount;
            if (skipRecords !== undefined) params.skipRecords = skipRecords;

            const response = await apiGet(`/neu-connect/v2${apiUrl}`, authToken, params);

            const { status, data } = response;

            const { data: PutAwayData } = data

            if (status == 200) {
                dispatch(FETCH_ALL_PUTAWAY({ data: PutAwayData }));
            }
        } catch (error) {
            dispatch(CLEAR_ALL_PUTAWAY_STATES())
        }
    }
);

// Note: Action function to fetch list all plant codes...!
const fetchListAllUserPlantsCodes = createAsyncThunk(
    "plants/fetchListAllUserPlantsCodes",
    async (
        { authToken, userId, lastCount, skipRecords }:
            {
                authToken: string,
                userId: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number | string } = {
            userId: userId
        };
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet('/neu-connect/v2/IPlantFeature/ListAllPlantsAssignedToUser', authToken, params);

        const { status, data } = response;

        const { data: PlantsData, totalCount } = data?.data

        if (status == 200) {
            dispatch(FETCH_ALL_PLANTS_CODES_BY_USER({ data: PlantsData, totalCount }));
        };
    }
);

// Note: Action function to assign group to user...!
const assignPlantsToUser = createAsyncThunk(
    "plants/assignPlantsToUser",
    async (
        // { payload, token, resHandler }:
        //     {
        //         addGroupToUserData: AssignGroupToUserDataType,
        //         token: string,
        //         resHandler: ResHandler
        //     },
        { payload, token, resHandler }:
            any,
        { dispatch }
    ) => {
        const response = await apiPost('/neu-connect/v2/IPlantFeature/AssignPlantsToUser', payload, token);

        const { status, data } = response;

        if (status == 201) {
            resHandler(data);
        };
    }
);

export {
    fetchListAllPutAway,
    fetchListAllUserPlantsCodes,
    assignPlantsToUser
};

