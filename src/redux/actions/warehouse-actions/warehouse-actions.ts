import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost } from "@/lib/api-service";
import {
    FETCH_ALL_WAREHOUSES,
    FETCH_WAREHOUSES_BY_USER_ID,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_WAREHOUSE_DATA
} from "@/redux/reducers/warehouse-reducer/warehouse-reducer";
import { ResHandler } from "@/types/api-types";
import { WareHouseDataObj } from "@/types/modules/warehouse-types/warehouse-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Note: Action function to fetch all warehouses...!
const fetchAllWareHouses = createAsyncThunk(
    "warehouse/fetchAllWareHouses",
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

        const response = await apiGet('/neu-connect/v2/IWarehouseFeature/ListAllWarehouses', authToken, params);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_WAREHOUSES(data?.data));
        };
    }
);

// Note: Action function to fetch warehouses list by user id...!
const fetchWarehousesListByUserId = createAsyncThunk(
    "warehouse/fetchWarehousesListByUserId",
    async (
        { authToken, userId }: { authToken: string, userId: string },
        { dispatch }
    ) => {
        const response = await apiGet(`/neu-connect/v2/IWarehouseFeature/ListAllWarehousesByUserId?userId=${userId}`, authToken);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_WAREHOUSES_BY_USER_ID(data?.data));
        };
    }
);

// Note: Action function to assign warehouse to user...!
const assignWareHouseToUser = createAsyncThunk(
    "warehouse/assignWareHouseToUser",
    async (
        { wareHouseData, token, resHandler }:
            {
                wareHouseData: WareHouseDataObj,
                token: string,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        const response = await apiPost('/neu-connect/v2/IWarehouseFeature/AddWarehousesToUser', wareHouseData, token);

        const { status, data } = response;

        if (status == 201) {
            resHandler(response);
        };
    }
);

export {
    assignWareHouseToUser, fetchAllWareHouses,
    fetchWarehousesListByUserId
};

