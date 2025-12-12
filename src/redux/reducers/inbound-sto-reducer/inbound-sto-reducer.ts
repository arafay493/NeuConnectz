/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InBoundStoStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: InBoundStoStateType = {
    ListAllInBoundSto: {
        data: [],
        totalCount: 0
    },
    ListAllInBoundStoViewDetailsData: {
        data: [],
        totalCount: 0
    },
    InBoundErrorState: ""
};

const inboundStoSlice = createSlice({
    name: "pickingOrdersSlice",
    initialState,
    reducers: {
        FETCH_ALL_INBOUND_STO: (state, action: PayloadAction<any>) => {
            state.InBoundErrorState = "";
            state.ListAllInBoundSto = action?.payload?.data;
        },

        FETCH_ALL_INBOUND_STO_DETAILS_BY_DOC_NO: (state, action: PayloadAction<any>) => {
            state.InBoundErrorState = "";
            state.ListAllInBoundStoViewDetailsData = action?.payload?.data
            // state.ListAllInBoundStoViewDetailsData = {
            //     data: action?.payload?.data?.lineItems,
            //     totalCount: action?.payload?.data?.totalCount
            // };
        },

        CLEAR_ALL_INBOUND_STO_STATES: (state) => {
            state.ListAllInBoundSto = {
                data: [],
                totalCount: 0
            };
            state.InBoundErrorState = "";
        },

        CLEAR_ALL_INBOUND_STO_DETAILS_STATES: (state) => {
            state.ListAllInBoundStoViewDetailsData = {
                data: [],
                totalCount: 0
            };
            state.InBoundErrorState = "";
        },
    }
});

export const
    {
        FETCH_ALL_INBOUND_STO,
        FETCH_ALL_INBOUND_STO_DETAILS_BY_DOC_NO,
        CLEAR_ALL_INBOUND_STO_STATES,
        CLEAR_ALL_INBOUND_STO_DETAILS_STATES
    } = inboundStoSlice.actions;
export default inboundStoSlice.reducer;