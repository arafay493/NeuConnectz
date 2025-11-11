/***** Note: WareHouseReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WareHouseStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: WareHouseStateType = {
    wareHousesList: {
        data: [],
        totalCount: 0
    },
    wareHousesListByUserPlants: {
        data: [],
        totalCount: 0
    },
    warehousesListByUserId: [],
    warehouseErrorState: ""
};

const wareHouseSlice = createSlice({
    name: "warehouse",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_WAREHOUSE_DATA: (state) => {
            state.wareHousesList = {
                data: [],
                totalCount: 0
            };
            state.warehousesListByUserId = [];
            state.warehouseErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_WAREHOUSES: (state, action: PayloadAction<any>) => {
            state.warehouseErrorState = "";
            state.wareHousesList = action?.payload;
        },

        FETCH_ALL_WAREHOUSES_BY_USER_PLANTS_STATES: (state, action: PayloadAction<any>) => {
            state.warehouseErrorState = "";
            state.wareHousesListByUserPlants = action?.payload;
        },

        FETCH_WAREHOUSES_BY_USER_ID: (state, action: PayloadAction<any>) => {
            state.warehouseErrorState = "";
            state.warehousesListByUserId = [];
            state.warehousesListByUserId = action?.payload;
        },

        CLEAR_ALL_WAREHOUSE_BY_USER_PLANTS_STATES: (state) => {
            state.wareHousesListByUserPlants = {
                data: [],
                totalCount: 0
            };
            state.warehousesListByUserId = [];
            state.warehouseErrorState = "";
        },

        CLEAR_ALL_WAREHOUSE_STATES: (state) => {
            state.wareHousesList = {
                data: [],
                totalCount: 0
            };
            state.warehousesListByUserId = [];
            state.warehouseErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_WAREHOUSE_DATA,
        FETCH_ALL_WAREHOUSES,
        FETCH_WAREHOUSES_BY_USER_ID,
        CLEAR_ALL_WAREHOUSE_BY_USER_PLANTS_STATES,
        FETCH_ALL_WAREHOUSES_BY_USER_PLANTS_STATES,
        CLEAR_ALL_WAREHOUSE_STATES
    } = wareHouseSlice.actions;
export default wareHouseSlice.reducer;