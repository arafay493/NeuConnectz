/***** Note: ITRReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITRStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: ITRStateType = {
    itrData: [],
    trData: [],
    itData: [],
    itrErrorState: ""
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
            state.trData = [];
            state.itData = [];
            state.itrData = action?.payload;
        },

        FETCH_ALL_TR_DATA: (state, action: PayloadAction<any>) => {
            console.log("TR data in ITR reducer: ", action.payload);
            state.itrErrorState = "";
            state.itrData = [];
            state.itData = [];
            state.trData = action?.payload;
        },

        FETCH_ALL_IT_DATA: (state, action: PayloadAction<any>) => {
            console.log("IT data in ITR reducer: ", action.payload);
            state.itrErrorState = "";
            state.itrData = [];
            state.trData = [];
            state.itData = action?.payload;
        },

        CLEAR_ALL_ITR_STATES: (state) => {
            state.itrData = [];
            state.trData = [];
            state.itData = [];
            state.itrErrorState = "";
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