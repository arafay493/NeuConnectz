/***** Note: WareHouseReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WareHouseStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: WareHouseStateType = {
    wareHousesList: []
};

const wareHouseSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {
        FETCH_ALL_WAREHOUSES: (state, action: PayloadAction<any>) => {
            // console.log("Warehouses list data in reducer: ", action.payload);
            state.wareHousesList = action?.payload;
        },

        CLEAR_ALL_WAREHOUSE_STATES: (state) => {
            state.wareHousesList = [];
        },
    }
});

export const
    {
        FETCH_ALL_WAREHOUSES,
        CLEAR_ALL_WAREHOUSE_STATES
    } = wareHouseSlice.actions;
export default wareHouseSlice.reducer;