import { createSlice } from "@reduxjs/toolkit";
import { HandlingUnitStateProps } from "@/types/redux-types";


const initialState: HandlingUnitStateProps = {
    handlingUnit: null,
    totalCount: 0,
    loading: false,
}

const handlingUnitReducer = createSlice({
    name: "handlingUnit",
    initialState,
    reducers: {
        SET_HANDLING_UNIT_LOADING: (state, action) => {
            state.loading = action.payload;
        },
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_HANDLING_UNIT_DATA: (state) => {
            state.handlingUnit = null;
            state.totalCount = 0;
            state.loading = false;
        },
        FETCH_HANDLING_UNIT_DATA: (state, action) => {
            // Handle both paginated response { data: [...], totalCount: number } and simple array
            console.log("action?.payload", action?.payload);
            if (action?.payload?.data && Array.isArray(action?.payload?.data)) {
                state.handlingUnit = action.payload.data;
                state.totalCount = action?.payload?.totalCount || 0;
            } else if (Array.isArray(action?.payload)) {
                state.handlingUnit = action.payload;
                state.totalCount = action.payload.length;
            } else {
                state.handlingUnit = null;
                state.totalCount = 0;
            }
            state.loading = false;
        },
        CLEAR_ALL_GENERATE_BARCODE_STATES: (state) => {
            state.handlingUnit = null;
            state.totalCount = 0;
            state.loading = false;
        }
    }
})

export const {
    SET_HANDLING_UNIT_LOADING,
    UNAUTHORIZE_USER_TRYING_TO_ACCESS_HANDLING_UNIT_DATA,
    FETCH_HANDLING_UNIT_DATA,
    CLEAR_ALL_GENERATE_BARCODE_STATES
} = handlingUnitReducer.actions;

export default handlingUnitReducer.reducer;