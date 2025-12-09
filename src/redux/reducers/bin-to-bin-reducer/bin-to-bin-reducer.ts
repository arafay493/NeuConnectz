/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BinToBinTransferOrdersStateType} from "@/types/redux-types";

// Note: Reducer states...!
const initialState: BinToBinTransferOrdersStateType = {
    ListAllBinToBin: {
        data: [],
        totalCount: 0
    },
    ListAllOutbound: {
        data: [],
        totalCount: 0
    },
    ListAllSalesOrder: {
        data: [],
        totalCount: 0
    },
    ListAllPickingOutBoundViewDetailsData: {
        data: [],
        totalCount: 0
    },
    ListAllPickingSalesOrderViewDetailsData: {
        data: [],
        totalCount: 0
    },
    PickingErrorState: ""
};

const pickingOrdersSlice = createSlice({
    name: "pickingOrdersSlice",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PICKING_DATA: (state) => {
            state.ListAllBinToBin = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_BIN_TO_BIN: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllBinToBin = action?.payload?.data;
        },

        FETCH_ALL_OUTBOUNDS: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllOutbound = action?.payload?.data;
        },

        FETCH_ALL_SALES_ORDER: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllSalesOrder = action?.payload?.data;
        },

        FETCH_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllPickingOutBoundViewDetailsData = action?.payload;
        },

        FETCH_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllPickingSalesOrderViewDetailsData = action?.payload;
        },

        CLEAR_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO: (state) => {
            state.ListAllPickingSalesOrderViewDetailsData = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "";
        },

        CLEAR_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO: (state) => {
            state.ListAllPickingOutBoundViewDetailsData = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "";
        },

        CLEAR_ALL_BIN_TO_BIN_STATES: (state) => {
            state.ListAllBinToBin = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "";
        },

        CLEAR_ALL_OUTBOUND_STATES: (state) => {
            state.ListAllOutbound = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "";
        },

        CLEAR_ALL_SALES_ORDER_STATES: (state) => {
            state.ListAllSalesOrder = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PICKING_DATA,
        FETCH_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO,
        FETCH_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO,
        FETCH_ALL_BIN_TO_BIN,
        FETCH_ALL_OUTBOUNDS,
        FETCH_ALL_SALES_ORDER,
        CLEAR_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO,
        CLEAR_ALL_PICKING_SALES_ORDER_DETAILS_BY_DOC_NO,
        CLEAR_ALL_BIN_TO_BIN_STATES,
        CLEAR_ALL_OUTBOUND_STATES,
        CLEAR_ALL_SALES_ORDER_STATES
    } = pickingOrdersSlice.actions;
export default pickingOrdersSlice.reducer;