import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_ALL_PLANTS_CODES } from "@/redux/reducers/plants-reducer/plants-reducer";
import { ResHandler } from "@/types/api-types";
import { AssignGroupToUserDataType } from "@/types/modules/group-types/group-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Note: Action function to fetch list all plant codes...!
const fetchListAllPlantsCodes = createAsyncThunk(
    "group/fetchListAllPlantsCodes",
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

        const response = await apiGet('/neu-connect/v2/IPlantFeature/ListAllPlants', authToken, params);

        const { status, data } = response;

        const { data: PlantsData, totalCount } = data?.data

        if (status == 200) {
            dispatch(FETCH_ALL_PLANTS_CODES({ data: PlantsData, totalCount }));
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
    fetchListAllPlantsCodes,
    assignPlantsToUser
};

