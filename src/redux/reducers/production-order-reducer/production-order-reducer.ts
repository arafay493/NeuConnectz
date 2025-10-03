import { ProductionOrderStateProps } from "@/types/redux-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: Reducer states...!
const initialState: ProductionOrderStateProps = {
    data: [],
    productionOrderById: null,
    scannedProductionOrder: null,
    totalCount: 0,
    loading: false
};

const generateBarcode = createSlice({
    name: "generateBarcode",
    initialState,
    reducers: {
        SET_PRODUCTION_ORDER_LOADING: (state, action) => {
            state.loading = action.payload;
        },

        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PRODUCTION_ORDER_DATA: (state) => {
            state.data = [];
            state.totalCount = 0;
            state.loading = false;
        },

        FETCH_PRODUCTION_ORDER_DATA: (state, action: PayloadAction<any>) => {
            // Handle both paginated response { data: [...], totalCount: number } and simple array
            if (action?.payload?.batches && Array.isArray(action?.payload?.batches)) {
                state.data = action.payload.batches;
                state.totalCount = action?.payload?.totalCount || 0;
            } else if (Array.isArray(action?.payload)) {
                state.data = action.payload;
                state.totalCount = action.payload.length;
            } else {
                state.data = null;
                state.totalCount = 0;
            }
            state.loading = false;
        },

        FETCH_PRODUCTION_ORDER_DATA_BY_ID: (state, action: PayloadAction<any>) => {
            state.productionOrderById = action.payload;
            state.loading = false;
        },

        SCAN_PRODUCTION_ORDER: (state, action: PayloadAction<any>) => {
            state.scannedProductionOrder = action.payload;
        },

        CLEAR_ALL_PRODUCTION_ORDER_STATES: (state) => {
            state.data = null;
            state.totalCount = 0;
            state.loading = false;
        },
    }
});

export const
    {
        SET_PRODUCTION_ORDER_LOADING,
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PRODUCTION_ORDER_DATA,
        FETCH_PRODUCTION_ORDER_DATA,
        FETCH_PRODUCTION_ORDER_DATA_BY_ID,
        SCAN_PRODUCTION_ORDER,
        CLEAR_ALL_PRODUCTION_ORDER_STATES
    } = generateBarcode.actions;
export default generateBarcode.reducer;