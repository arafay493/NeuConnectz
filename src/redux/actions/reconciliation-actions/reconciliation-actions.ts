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

        try {
            const response = await apiGet(`/neu-connect/v2/IReconciliationFeature/GetInventoryAndTransferReceiptItems?fromWarehouseCode=${fromWarehouseCode}&toWarehouseCode=${toWarehouseCode}&dateTime=${date}`, authToken)
            // const response = await axios({
            //     method: API_METHODS.GET,
            //     url: apiRequestRoutes.getRequest,
            //     headers: {
            //         "Api-Url": `${process.env.NEXT_PUBLIC_FETCH_IT_AND_TR_RECONCILIATION_DATA}?fromWarehouseCode=${fromWarehouseCode}&toWarehouseCode=${toWarehouseCode}&dateTime=${date}`,
            //         "Auth-Token": authToken
            //     }
            // });
            const { status, data } = response;

            if (status == 200) {
                dispatch(FETCH_RECONCILIATION_DATA(data?.data));
            };
        }

        catch (error: any) {
            const { status, data } = error?.response;

            // 401:
            if (status == 401) handleRefreshToken(data?.error);

            // 403
            else if (status == 403) dispatch(UNAUTHORIZE_USER_TRYING_TO_ACCESS_RECONCILIATION_DATA());
        };
    }
);

export {
    fetchReconciliationData
};
