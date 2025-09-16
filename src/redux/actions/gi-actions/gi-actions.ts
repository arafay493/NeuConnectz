import API_METHODS from "@/constants/api-methods";
import apiRequestRoutes from "@/constants/api-request";
import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet, apiPost, apiPut } from "@/lib/api-service";
import {
    FETCH_ALL_GOODS_ISSUE
} from "@/redux/reducers/gi-reducer/gi-reducer";
import { ResHandler } from "@/types/api-types";
import { AddSAPConfigDataType } from "@/types/modules/sap-types/sap-types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Note: Action function fetch list goods issue...!
const fetchAllGoodsIssue = createAsyncThunk(
    "GI/fetchAllGoodsIssue",
    async (
        { token, apiUrl, lastCount, skipRecords }:
            {
                token: string,
                apiUrl: string,
                lastCount?: number,
                skipRecords?: number
            },
        { dispatch }
    ) => {
        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.lastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        const response = await apiGet(`/neu-connect/v2/${apiUrl}`, token, params);
        console.log("Fetch all Goods Issue api response: ", response);

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_ALL_GOODS_ISSUE({
                goodsIssueData: data?.data?.data,
                totalGoodsIssueCount: data?.data?.totalRecords
            }));
        };
    }
);

export {
    fetchAllGoodsIssue
};