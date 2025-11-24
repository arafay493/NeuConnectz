/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MovementTypeStateType, PlantsStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: MovementTypeStateType = {
    ListAllMovementTypes: {
        data: [],
        totalCount: 0
    },
    ListAllMovementTypesByUser: {
        data: [],
        totalCount: 0
    },
    MovementTypesErrorState: ""
};

const movementTypeSlice = createSlice({
    name: "movementType",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_MOVEMENT_TYPE_DATA: (state) => {
            state.ListAllMovementTypes = {
                data: [],
                totalCount: 0
            };
            state.MovementTypesErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_MOVEMENT_TYPE: (state, action: PayloadAction<any>) => {
            state.MovementTypesErrorState = "";
            state.ListAllMovementTypes = action?.payload;
        },

        FETCH_ALL_MOVEMENT_TYPE_BY_USER: (state, action: PayloadAction<any>) => {
            state.MovementTypesErrorState = "";
            state.ListAllMovementTypesByUser = action?.payload;
        },

        CLEAR_ALL_MOVEMENT_TYPE_STATES_BY_USER: (state) => {
            state.ListAllMovementTypesByUser = {
                data: [],
                totalCount: 0
            };
            state.MovementTypesErrorState = "";
        },

        CLEAR_ALL_MOVEMENT_TYPE_STATES: (state) => {
            state.ListAllMovementTypes = {
                data: [],
                totalCount: 0
            };
            state.MovementTypesErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_MOVEMENT_TYPE_DATA,
        FETCH_ALL_MOVEMENT_TYPE_BY_USER,
        FETCH_ALL_MOVEMENT_TYPE,
        CLEAR_ALL_MOVEMENT_TYPE_STATES_BY_USER,
        CLEAR_ALL_MOVEMENT_TYPE_STATES
    } = movementTypeSlice.actions;
export default movementTypeSlice.reducer;