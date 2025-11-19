/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PutAwayOrdersStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: PutAwayOrdersStateType = {
    ListAllPutAway: {
        data: [],
        totalCount: 0
    },
    ListAllPlantsCodesByUser: {
        data: [],
        totalCount: 0
    },
    PlantsErrorState: ""
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
            state.PlantsErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_PUTAWAY: (state, action: PayloadAction<any>) => {
            state.PlantsErrorState = "";
            state.ListAllPutAway = action?.payload?.data;
        },

        FETCH_ALL_PLANTS_CODES_BY_USER: (state, action: PayloadAction<any>) => {
            state.PlantsErrorState = "";
            state.ListAllPlantsCodesByUser = action?.payload;
        },

        CLEAR_ALL_PLANTS_STATES_BY_USER: (state) => {
            state.ListAllPlantsCodesByUser = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "";
        },

        CLEAR_ALL_PUTAWAY_STATES: (state) => {
            state.ListAllPutAway = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PUTAWAY_DATA,
        FETCH_ALL_PLANTS_CODES_BY_USER,
        FETCH_ALL_PUTAWAY,
        CLEAR_ALL_PLANTS_STATES_BY_USER,
        CLEAR_ALL_PUTAWAY_STATES
    } = putAwayOrdersSlice.actions;
export default putAwayOrdersSlice.reducer;