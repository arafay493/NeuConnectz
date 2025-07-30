/***** Note: ITRReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITRStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: ITRStateType = {
    itrData: [],
    trData: [],
    itData: [],
    itrErrorState: "",
    itrDataCount: 0,
    itDataCount: 0,
    trDataCount: 0
};

const ITRReducer = createSlice({
    name: "ITR",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA: (state) => {
            state.itrData = [];
            state.trData = [];
            state.itData = [];
            state.itrErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_ITR_DATA: (state, action: PayloadAction<any>) => {
            // console.log("ITR data in ITR reducer: ", action.payload);
            state.itrErrorState = "";
            state.itrData = action?.payload?.itrData;
            state.itrDataCount = action?.payload?.itrDataCount;
        },

        FETCH_ALL_TR_DATA: (state, action: PayloadAction<any>) => {
            // console.log("TR data in ITR reducer: ", action.payload);
            state.itrErrorState = "";
            state.trData = action?.payload?.trData;
            state.trDataCount = action?.payload?.trDataCount
        },

        FETCH_ALL_IT_DATA: (state, action: PayloadAction<any>) => {
            // console.log("IT data in ITR reducer: ", action.payload);
            state.itrErrorState = "";
            state.itData = action?.payload?.itData;
            state.itDataCount = action?.payload?.itDataCount;
        },

        CLEAR_ALL_ITR_STATES: (state) => {
            state.itrData = [];
            state.trData = [];
            state.itData = [];
            state.itrErrorState = "";
            state.itrDataCount = 0;
            state.itDataCount = 0;
            state.trDataCount = 0;
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_ITR_DATA,
        FETCH_ALL_ITR_DATA,
        FETCH_ALL_TR_DATA,
        FETCH_ALL_IT_DATA,
        CLEAR_ALL_ITR_STATES
    } = ITRReducer.actions;
export default ITRReducer.reducer;