/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PutAwayOrdersStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: PutAwayOrdersStateType = {
    ListAllPutAway: {
        data: [],
        totalCount: 0
    },
    ListAllPutAwayDetailsByDocNo: {
        data: [],
        totalCount: 0
    },
    PutAwayErrorState: ""
};

const putAwayOrdersSlice = createSlice({
    name: "putaway",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PUTAWAY_DATA: (state) => {
            state.ListAllPutAway = {
                data: [],
                totalCount: 0
            };
            state.PutAwayErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_PUTAWAY: (state, action: PayloadAction<any>) => {
            state.PutAwayErrorState = "";
            state.ListAllPutAway = action?.payload?.data;
        },

        FETCH_ALL_PUTAWAY_DETAILS_BY_DOC_NO: (state, action: PayloadAction<any>) => {
            state.PutAwayErrorState = "";
            state.ListAllPutAwayDetailsByDocNo = action?.payload?.data;
        },

        CLEAR_ALL_PUTAWAY_DETAILS_BY_DOC_NO: (state) => {
            state.ListAllPutAwayDetailsByDocNo = {
                data: [],
                totalCount: 0
            };
            state.PutAwayErrorState = "";
        },

        CLEAR_ALL_PUTAWAY_STATES: (state) => {
            state.ListAllPutAway = {
                data: [],
                totalCount: 0
            };
            state.PutAwayErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PUTAWAY_DATA,
        FETCH_ALL_PUTAWAY_DETAILS_BY_DOC_NO,
        FETCH_ALL_PUTAWAY,
        CLEAR_ALL_PUTAWAY_DETAILS_BY_DOC_NO,
        CLEAR_ALL_PUTAWAY_STATES
    } = putAwayOrdersSlice.actions;
export default putAwayOrdersSlice.reducer;