/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PickingOrdersStateType, PutAwayOrdersStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: PickingOrdersStateType = {
    ListAllReservation: {
        data: [],
        totalCount: 0
    },
    ListAllOutbound: {
        data: [],
        totalCount: 0
    },
    ListAllPickingOutBoundViewDetailsData: {
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
            state.ListAllReservation = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_RESERVATIONS: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllReservation = action?.payload?.data;
        },

        FETCH_ALL_OUTBOUNDS: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllOutbound = action?.payload?.data;
        },

        FETCH_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO: (state, action: PayloadAction<any>) => {
            state.PickingErrorState = "";
            state.ListAllPickingOutBoundViewDetailsData = action?.payload;
        },

        CLEAR_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO: (state) => {
            state.ListAllPickingOutBoundViewDetailsData = {
                data: [],
                totalCount: 0
            };
            state.PickingErrorState = "";
        },

        CLEAR_ALL_RESERVATION_STATES: (state) => {
            state.ListAllReservation = {
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
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PICKING_DATA,
        FETCH_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO,
        FETCH_ALL_RESERVATIONS,
        FETCH_ALL_OUTBOUNDS,
        CLEAR_ALL_PICKING_OUTBOUND_DETAILS_BY_DOC_NO,
        CLEAR_ALL_RESERVATION_STATES,
        CLEAR_ALL_OUTBOUND_STATES
    } = pickingOrdersSlice.actions;
export default pickingOrdersSlice.reducer;