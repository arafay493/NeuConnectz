/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: Reducer states...!
const initialState: any = {
    ListAllPlantsCodes: {
        data: [],
        totalCount: 0
    },
    ListAllPlantsCodesByUser: {
        data: [],
        totalCount: 0
    },
    PlantsErrorState: ""
};

const plantsSlice = createSlice({
    name: "plants",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PLANTS_DATA: (state) => {
            state.ListAllPlantsCodes = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_PLANTS_CODES: (state, action: PayloadAction<any>) => {
            state.PlantsErrorState = "";
            state.ListAllPlantsCodes = action?.payload;
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

        CLEAR_ALL_PLANTS_STATES: (state) => {
            state.ListAllPlantsCodes = {
                data: [],
                totalCount: 0
            };
            state.PlantsErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_PLANTS_DATA,
        FETCH_ALL_PLANTS_CODES_BY_USER,
        FETCH_ALL_PLANTS_CODES,
        CLEAR_ALL_PLANTS_STATES_BY_USER,
        CLEAR_ALL_PLANTS_STATES
    } = plantsSlice.actions;
export default plantsSlice.reducer;