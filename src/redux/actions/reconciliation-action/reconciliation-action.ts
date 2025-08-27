import { handleRefreshToken } from "@/constants/refresh-token";
import { apiGet } from "@/lib/api-service";
import { FETCH_RECONCILIATION_DATA, UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA } from "@/redux/reducers/reconciliation-reducer/reconciliation-reducer";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface FetchReconciliationTableProps {
    authToken: string;
    fromWarehouseCode: string;
    toWarehouseCode: string;
    date: string;
}

// Note: Action function to fetch all warehouses...!
const fetchReconciliationData = createAsyncThunk(
    "reconciliation/fetchReconciliationData",
    async ({ authToken, fromWarehouseCode, toWarehouseCode, date }: FetchReconciliationTableProps, { dispatch }) => {

        const params = {
            fromWarehouseCode,
            toWarehouseCode,
            dateTime: date
        }

        const response = await apiGet(`/neu-connect/v2/IReconciliationFeature/GetInventoryAndTransferReceiptItems`, authToken, params)

        const { status, data } = response;

        if (status == 200) {
            dispatch(FETCH_RECONCILIATION_DATA(data?.data));
        };
    }
);
export {
    fetchReconciliationData
};
